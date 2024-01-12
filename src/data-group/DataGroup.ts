// to-do

import { BigNumber, BigNumberish, BytesLike, ethers } from "ethers";
import {
  DataverseConnector,
  SYSTEM_CALL,
  SignalType,
} from "@dataverse/dataverse-connector";
import { ChainId, DataToken, DataTokenFactory, GraphType } from "../data-token";
import { DeployedContracts } from "../config";
import {
  loadDataUnionsPublishedBy,
  loadDataUnionsCollectedBy,
  loadDataUnionSubscriptionsBy,
  loadDataUnionCollectors,
  loadDataUnion,
  Data_Union_Subscriber,
  loadDataUnionSubscribers,
  DataUnion as DataUnionGraphType,
  Data_Union_Subscription,
  isDataUnionCollectedBy,
  loadDataUnions,
} from "../graphql";
import { getBlockNumberByTimestamp } from "../utils";
import { abiCoder } from "../utils";
import BlockNumberConfig from "../config/block.config.json";
import { DataAssetBase } from "../data-asset/DataAssetBase";
import {
  BlockSubscribeModule__factory,
  IDataUnion,
  IDataUnion__factory,
  IERC20__factory,
  LitACL__factory,
  TimeSegmentSubscribeModule__factory,
} from "./contracts";
import { IDataUnionDefinitions } from "./contracts/IDataUnion";

import {
  CloseDataUnionOutput,
  CollectDataUnionOutput,
  Currency,
  PublishDataUnionInput,
  SubscribeDataUnionInput,
  SubscribeDataUnionOutput,
  SubscribeModule,
  TimeSegment,
} from "./types";

export class DataGroup extends DataAssetBase {
  instance: IDataUnion;

  constructor({
    chainId,
    folderId,
    dataverseConnector,
  }: {
    chainId: ChainId;
    folderId: string;
    dataverseConnector: DataverseConnector;
  }) {
    const assetContract =
      DeployedContracts[ChainId[chainId]].DataUnion.DataUnion;

    super({
      chainId,
      assetContract,
      fileOrFolderId: folderId,
      dataverseConnector,
    });

    this.instance = IDataUnion__factory.connect(assetContract, this.signer);
  }

  public async createDataGroup(params: PublishDataUnionInput) {
    this.assertCheckChain();

    const {
      createDataTokenInput: {
        type,
        collectModule,
        collectLimit,
        amount,
        currency,
        recipient,
        endTimestamp,
      },
      resourceId,
      subscribeModule,
      subscribeModuleInput,
    } = params;

    const creator = await this.signer.getAddress();

    const input = {
      type: type ?? GraphType.Profileless,
      contentURI: this.fileOrFolderId,
      collectModule: collectModule ?? "LimitedFeeCollectModule",
      collectLimit: collectLimit ?? 2 ** 52,
      recipient: recipient ?? creator,
      currency,
      amount: ethers.utils.parseUnits(
        String(amount),
        currency === "USDC" ? 6 : 18,
      ),
      endTimestamp,
    };

    const dataTokenFactory = new DataTokenFactory({
      chainId: this.chainId!,
      signer: this.signer,
    });

    const createData = await dataTokenFactory._generateDataTokenInitData(input);

    const dataTokenFactoryAddress = dataTokenFactory.getAddress(type);

    const subscribeModuleInitData = this._generateSubscribeModuleInitData({
      subscribeModule,
      ...subscribeModuleInput,
      amount: ethers.utils.parseEther(String(subscribeModuleInput.amount)),
    });

    const publish = async () => {
      const tx = await this.instance.publish(
        dataTokenFactoryAddress,
        createData,
        resourceId,
        DeployedContracts[ChainId[this.chainId!]].DataUnion[subscribeModule],
        subscribeModuleInitData,
      );

      const result = await tx.wait();
      const targetEvents = result.events?.filter(e => e.event === "Published");
      if (!targetEvents || targetEvents.length === 0 || !targetEvents[0].args) {
        throw new Error("Filter Published event failed");
      }
      return targetEvents[0].args[3];
      // return {
      //   dataUnionId: targetEvents[0].args[0],
      //   publisher: targetEvents[0].args[1],
      //   resourceId: targetEvents[0].args[2],
      //   dataToken: targetEvents[0].args[3],
      //   subscribeModule: targetEvents[0].args[4],
      //   startBlockNumber: targetEvents[0].args[5],
      // } as PublishDataUnionOutput;
    };

    const assetId = await this.createAssetHandler(publish);

    return assetId;
  }

  private assertCheckChain() {
    if (!this.chainId || !ChainId[this.chainId]) {
      throw new Error("Chain is not set");
    }
  }

  public async collectDataGroup(dataGroupId: BytesLike) {
    const collector = await this.signer!.getAddress();

    const union: IDataUnionDefinitions.UnionStructOutput =
      await this.instance.getDataUnionById(dataGroupId);

    const dataToken = new DataToken({
      chainId: this.chainId!,
      fileId: "",
      dataTokenAddress: union.dataToken,
      dataverseConnector: this.dataverseConnector,
    });

    const unionFolderId = (await dataToken.getContentURI()).replace(
      "ceramic://",
      "",
    );

    const dataUnion = await this.dataverseConnector.runOS({
      method: SYSTEM_CALL.loadDataUnionById,
      params: unionFolderId,
    });

    const linkedAsset =
      dataUnion.accessControl?.monetizationProvider?.dataAsset!;

    dataToken.updateChain(linkedAsset.chainId);

    const collectData = await dataToken._generateCollectData(collector);

    const tx = await this.instance.collect(dataGroupId, collectData);
    const result = await tx.wait();
    const targetEvents = result.events?.filter(e => e.event === "Collected");
    if (!targetEvents || targetEvents.length === 0 || !targetEvents[0].args) {
      throw new Error("Filter Collected event failed");
    }

    return {
      dataUnionId: targetEvents[0].args[0],
      dataToken: targetEvents[0].args[1],
      collectTokenId: targetEvents[0].args[2],
    } as CollectDataUnionOutput;
  }

  public async subscribeDataGroup({
    dataUnionId,
    collectTokenId,
    subscribeInput,
  }: SubscribeDataUnionInput) {
    const { subscribeModule } =
      await this.instance.getDataUnionById(dataUnionId);
    const subscribeData = await this._generateSubscribeData({
      dataUnionId,
      subscribeModule,
      subscribeInput,
    });

    const tx = await this.instance.subscribe(
      dataUnionId,
      subscribeData,
      collectTokenId,
    );

    const result = await tx.wait();
    const targetEvents = result.events?.filter(e => e.event === "Subscribed");
    if (!targetEvents || targetEvents.length === 0 || !targetEvents[0].args) {
      throw new Error("Filter Subscribed event failed");
    }

    return {
      dataUnionId: targetEvents[0].args[0],
      collectTokenId: targetEvents[0].args[1],
      subscribeModule: targetEvents[0].args[2],
      startAt: targetEvents[0].args[3],
      endAt: targetEvents[0].args[4],
    } as SubscribeDataUnionOutput;
  }

  public async loadFilesInDataGroup(groupId: string) {
    if (!groupId) {
      throw new Error("groupId cannot be empty");
    }

    const res = await this.dataverseConnector.runOS({
      method: SYSTEM_CALL.loadFoldersBy,
      params: { signal: { type: SignalType.asset, id: groupId } },
    });

    return Object.assign(
      {},
      ...Object.values(res).map(item => item.mirrorRecord),
    );
  }

  public getDataGroupById(
    dataUnionId: BytesLike,
  ): Promise<IDataUnionDefinitions.UnionStructOutput> {
    return this.instance.getDataUnionById(dataUnionId);
  }

  public getSubscriptionData({
    dataUnionId,
    collectTokenId,
  }: {
    dataUnionId: BytesLike;
    collectTokenId: BigNumberish;
  }) {
    return this.instance.getSubscriptionData(dataUnionId, collectTokenId);
  }

  public isCollected({
    dataUnionId,
    account,
  }: {
    dataUnionId: BytesLike;
    account: string;
  }): Promise<boolean> {
    return this.instance.isCollected(dataUnionId, account);
  }

  public isAccessibleByTokenId({
    dataUnionId,
    collectTokenId,
    blockNumber,
  }: {
    dataUnionId: BytesLike;
    collectTokenId: BigNumberish;
    blockNumber: BigNumberish;
  }): Promise<boolean> {
    return this.instance.isAccessible(dataUnionId, collectTokenId, blockNumber);
  }

  public isAccessibleBySubscriber({
    dataUnionId,
    subscriber,
    blockNumber,
  }: {
    dataUnionId: BytesLike;
    subscriber: string;
    blockNumber: BigNumberish;
  }) {
    this.assertCheckChain();
    const litACL = LitACL__factory.connect(
      DeployedContracts[ChainId[this.chainId!]].DataUnion.LitACL,
      this.signer!,
    );
    return litACL.isAccessible(dataUnionId, subscriber, blockNumber);
  }

  public async close(dataUnionId: BytesLike) {
    const tx = await this.instance.close(dataUnionId);
    const result = await tx.wait();
    const targetEvents = result.events?.filter(e => e.event === "Closed");

    if (!targetEvents || targetEvents.length === 0 || !targetEvents[0].args) {
      throw new Error("Filter Closed event failed");
    }

    return {
      dataUnionId: targetEvents[0].args[0],
      operator: targetEvents[0].args[1],
      endBlockNumber: targetEvents[0].args[2],
    } as CloseDataUnionOutput;
  }

  static async loadDataGroupsPublishedBy(
    publisher: string,
  ): Promise<Array<DataUnionGraphType>> {
    return loadDataUnionsPublishedBy(publisher);
  }

  static async loadDataGroupsCollectedBy(
    collector: string,
  ): Promise<Array<DataUnionGraphType>> {
    return loadDataUnionsCollectedBy(collector);
  }

  static async loadDataGroupCollectors(
    dataUnionId: string,
  ): Promise<Array<Data_Union_Subscriber>> {
    return loadDataUnionCollectors(dataUnionId);
  }

  static async loadDataGroupSubscribers(
    dataUnionId: string,
  ): Promise<Array<Data_Union_Subscriber>> {
    const result: Array<Data_Union_Subscriber> = [];
    const subs = await loadDataUnionSubscribers(dataUnionId);
    subs.forEach((sub: Data_Union_Subscriber) => {
      if (sub.subscriptions.length > 0) {
        result.push(sub);
      }
    });
    return result;
  }

  static async loadDataGroup(dataUnionId: string): Promise<DataUnionGraphType> {
    return loadDataUnion(dataUnionId);
  }

  static async loadDataGroups(
    dataUnionIds: Array<string>,
  ): Promise<Array<DataUnionGraphType>> {
    return loadDataUnions(dataUnionIds);
  }

  static async loadDataGroupSubscriptionsBy({
    dataUnionId,
    collector,
  }: {
    dataUnionId: string;
    collector: string;
  }): Promise<Array<Data_Union_Subscriber>> {
    return loadDataUnionSubscriptionsBy(dataUnionId, collector);
  }

  static async isDataGroupCollectedBy({
    dataUnionId,
    collector,
  }: {
    dataUnionId: string;
    collector: string;
  }): Promise<boolean> {
    return isDataUnionCollectedBy(dataUnionId, collector);
  }

  static async isDataGroupSubscribedBy({
    dataUnionId,
    subscriber,
    timestamp,
    blockNumber,
  }: {
    dataUnionId: string;
    subscriber: string;
    timestamp?: BigNumber;
    blockNumber?: BigNumber;
  }): Promise<boolean> {
    const subList = await loadDataUnionSubscriptionsBy(dataUnionId, subscriber);
    let isSubscribed = false;
    if (subList.length > 0) {
      for (let i = 0; i < subList.length; i++) {
        if (subList[i].subscriptions.length > 0) {
          isSubscribed = this.isInSubscription(
            subList[i].subscriptions,
            !timestamp
              ? blockNumber!
              : BigNumber.from(
                  await getBlockNumberByTimestamp({
                    chainId: ChainId.PolygonMumbai,
                    timestamp: timestamp.toNumber(),
                  }),
                ),
          );
          break;
        }
      }
    }
    return isSubscribed;
  }

  static isInSubscription(
    subscriptions: Array<Data_Union_Subscription>,
    blockNumber: BigNumber,
  ) {
    let isSubscribed = false;
    for (let i = 0; i < subscriptions.length; i++) {
      if (
        BigNumber.from(subscriptions[i].start_at).lte(blockNumber) &&
        BigNumber.from(subscriptions[i].end_at).gte(blockNumber)
      ) {
        isSubscribed = true;
        break;
      }
    }
    return isSubscribed;
  }

  public _generateSubscribeModuleInitData({
    subscribeModule,
    currency,
    amount,
    segment,
  }: {
    subscribeModule: SubscribeModule;
    currency: Currency;
    amount: BigNumberish;
    segment?: TimeSegment;
  }): BytesLike {
    this.assertCheckChain();
    if (
      ChainId[this.chainId!] !== "PolygonMumbai" &&
      ChainId[this.chainId!] !== "BSCTestnet"
    ) {
      throw new Error("Unsupported Chain");
    }
    let subscribeModuleInitData;
    switch (subscribeModule) {
      case "BlockSubscribeModule": {
        subscribeModuleInitData = abiCoder.encode(
          ["address", "uint256"],
          [DeployedContracts[ChainId[this.chainId!]][currency], amount],
        );
        break;
      }

      case "TimeSegmentSubscribeModule": {
        const segmentInBlockNumber =
          BlockNumberConfig[
            ChainId[this.chainId!] as keyof typeof BlockNumberConfig
          ]?.segment[segment!];
        subscribeModuleInitData = abiCoder.encode(
          ["address", "uint256", "uint256"],
          [
            DeployedContracts[ChainId[this.chainId!]][currency],
            amount,
            segmentInBlockNumber,
          ],
        );
        break;
      }

      default:
        throw new Error("SubscribeModule Not Supported");
    }
    return subscribeModuleInitData;
  }

  public async _generateSubscribeData({
    dataUnionId,
    subscribeModule,
    subscribeInput,
  }: {
    dataUnionId: BytesLike;
    subscribeModule: string;
    subscribeInput: {
      startAt?: BigNumberish;
      endAt?: BigNumberish;
      segmentsCount?: BigNumberish;
    };
  }) {
    this.assertCheckChain();
    let subscribeData;
    switch (subscribeModule) {
      case (DeployedContracts[ChainId[this.chainId!]] as any).DataUnion
        .BlockSubscribeModule: {
        // 1. get union data
        const blockSubscribeModule = BlockSubscribeModule__factory.connect(
          subscribeModule,
          this.signer!,
        );
        const { currency, amount } =
          await blockSubscribeModule.getUnionData(dataUnionId);

        // 2. check balance and allowance
        const totalAmount = BigNumber.from(subscribeInput.endAt)
          .sub(BigNumber.from(subscribeInput.startAt))
          .add(1)
          .mul(amount);
        await this._checkERC20BalanceAndAllowance(
          currency,
          totalAmount,
          subscribeModule,
        );

        // 3. generate validate data
        const validateData = abiCoder.encode(
          ["address", "uint256"],
          [currency, amount],
        );

        subscribeData = abiCoder.encode(
          ["uint256", "uint256", "bytes"],
          [subscribeInput.startAt!, subscribeInput.endAt!, validateData],
        );
        break;
      }

      case (DeployedContracts[ChainId[this.chainId!]] as any).DataUnion
        .TimeSegmentSubscribeModule: {
        // 1. get union data
        const timePeriodSubscribeModule =
          TimeSegmentSubscribeModule__factory.connect(
            subscribeModule,
            this.signer!,
          );
        const { currency, amount } =
          await timePeriodSubscribeModule.getUnionData(dataUnionId);

        // 2. check balance and allowance
        const totalAmount = BigNumber.from(subscribeInput.segmentsCount).mul(
          amount,
        );
        await this._checkERC20BalanceAndAllowance(
          currency,
          totalAmount,
          subscribeModule,
        );

        // 3. generate validate data
        const validateData = abiCoder.encode(
          ["address", "uint256"],
          [currency, amount],
        );

        subscribeData = abiCoder.encode(
          ["uint256", "uint256", "bytes"],
          [
            subscribeInput.startAt!,
            subscribeInput.segmentsCount!,
            validateData,
          ],
        );
        break;
      }

      default: {
        throw new Error("Unsupported Subscribe Module");
      }
    }

    return subscribeData;
  }

  private async _checkERC20BalanceAndAllowance(
    currency: string,
    amount: BigNumberish,
    spender: string,
  ) {
    const erc20 = IERC20__factory.connect(currency, this.signer!);
    const signerAddr = await this.signer!.getAddress();
    const userBalance = await erc20.balanceOf(signerAddr);
    if (userBalance.lt(amount)) {
      throw new Error("Insufficient Balance");
    }
    const allowance = await erc20.allowance(signerAddr, spender);
    if (allowance.lt(amount)) {
      const tx = await erc20.approve(spender, amount);
      await tx.wait();
    }
  }
}
