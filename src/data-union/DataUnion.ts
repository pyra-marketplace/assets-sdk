import { BigNumber, BigNumberish, BytesLike, Signer, ethers } from "ethers";
import {
  ActionType,
  BooleanCondition,
  ContentType,
  DataverseConnector,
  DecryptionConditions,
  DecryptionConditionsType,
  EncryptionProtocol,
  ModelName,
  MonetizationProvider,
  SYSTEM_CALL,
  Signal,
  StorageResource,
  UnifiedAccessControlCondition,
} from "@dataverse/dataverse-connector";
import {
  AssetType,
  Chain,
  ChainId,
  DataToken,
  DataTokenFactory,
  GraphType,
} from "../data-token";
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
import {
  getBlockNumberByTimestamp,
  getChainByChainId,
  getChainNameFromChainId,
  getTimestampByBlockNumber,
} from "../utils";
import { abiCoder } from "../utils";
import BlockNumberConfig from "../config/block.config.json";
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
  PublishDataUnionOutput,
  SubscribeDataUnionInput,
  SubscribeDataUnionOutput,
  SubscribeModule,
  TimeSegment,
} from "./types";

export class DataUnion {
  chainId: ChainId;
  chain: Chain;
  signer: Signer;
  instance: IDataUnion;
  dataverseConnector: DataverseConnector;

  constructor({
    chainId,
    dataverseConnector,
  }: {
    chainId: ChainId;
    dataverseConnector: DataverseConnector;
  }) {
    this.chainId = chainId;
    this.chain = getChainByChainId(chainId);
    this.dataverseConnector = dataverseConnector;
    try {
      const provider = this.dataverseConnector.getProvider();
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      this.signer = ethersProvider.getSigner();
      this.instance = IDataUnion__factory.connect(
        DeployedContracts[this.chain].DataUnion.DataUnion,
        this.signer,
      );
    } catch (error) {
      throw new Error("No avaliable signer in dataverseConnector");
    }
  }

  public async getAssetHandler({
    fileOrFolderId,
    params,
    signer,
  }: {
    fileOrFolderId: string;
    params: object;
    signer: Signer;
  }) {
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
    } = params as PublishDataUnionInput;

    const creator = await signer.getAddress();

    const input = {
      type: type ?? GraphType.Profileless,
      contentURI: fileOrFolderId,
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
      chainId: this.chainId,
      signer: this.signer,
    });

    const createData = await dataTokenFactory._generateDataTokenInitData(input);

    const dataTokenFactoryAddress = dataTokenFactory.getAddress(type);

    const subscribeModuleInitData = this._generateSubscribeModuleInitData({
      subscribeModule,
      ...subscribeModuleInput,
      amount: ethers.utils.parseEther(String(subscribeModuleInput.amount)),
    });

    const tx = await this.instance.publish(
      dataTokenFactoryAddress,
      createData,
      resourceId,
      DeployedContracts[this.chain].DataUnion[subscribeModule],
      subscribeModuleInitData,
    );

    const result = await tx.wait();
    const targetEvents = result.events?.filter(e => e.event === "Published");
    if (!targetEvents || targetEvents.length === 0 || !targetEvents[0].args) {
      throw new Error("Filter Published event failed");
    }

    return {
      dataUnionId: targetEvents[0].args[0],
      publisher: targetEvents[0].args[1],
      resourceId: targetEvents[0].args[2],
      dataToken: targetEvents[0].args[3],
      subscribeModule: targetEvents[0].args[4],
      startBlockNumber: targetEvents[0].args[5],
    } as PublishDataUnionOutput;
  }

  public async collectDataUnion(dataUnionId: BytesLike) {
    const collector = await this.signer!.getAddress();

    const union: IDataUnionDefinitions.UnionStructOutput =
      await this.instance.getDataUnionById(dataUnionId);

    const dataToken = new DataToken({
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

    const tx = await this.instance.collect(dataUnionId, collectData);
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

  public async subscribeDataUnion({
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

  async applyMonetizerToFolder({
    folderId,
    dataUnionId,
    signal,
  }: {
    folderId: string;
    dataUnionId: string;
    signal?: Signal;
  }) {
    const monetizationProvider = {
      dataAsset: {
        assetType: AssetType[AssetType.dataUnion],
        assetId: dataUnionId,
        assetContract:
          DeployedContracts[ChainId[this.chainId]].DataUnion.DataUnion,
        chainId: this.chainId,
      },
    };

    const res = await this.dataverseConnector.runOS({
      method: SYSTEM_CALL.monetizeFolder,
      params: {
        folderId,
        monetizationProvider,
        signal,
      },
    });

    return res;
  }

  async applyMonetizerToFile({
    fileId,
    creator,
    unionFolderId,
    blockNumber,
  }: {
    fileId: string;
    creator: string;
    unionFolderId: string;
    blockNumber: number;
  }) {
    const dataUnion = await this.dataverseConnector.runOS({
      method: SYSTEM_CALL.loadDataUnionById,
      params: unionFolderId,
    });
    const linkedAsset =
      dataUnion.accessControl?.monetizationProvider?.dataAsset!;

    const fileRes = await this.dataverseConnector.runOS({
      method: SYSTEM_CALL.loadFile,
      params: fileId,
    });
    const file = fileRes?.fileContent?.file;
    if (!file) {
      throw new Error("The fileId does not exsit or has been deleted");
    }

    const modelId = fileRes?.modelId;
    const dapp = await this.dataverseConnector.getDAppInfo(fileRes?.appId);
    const indexFileModelId =
      this.dataverseConnector.getModelIdByAppIdAndModelName({
        dapp,
        modelName: ModelName.indexFile,
      });
    const actionFileModelId =
      this.dataverseConnector.getModelIdByAppIdAndModelName({
        dapp,
        modelName: ModelName.actionFile,
      });

    if (
      (modelId === indexFileModelId &&
        file.contentType?.resource === StorageResource.IPFS &&
        dataUnion.options?.signal &&
        (dataUnion.options?.signal as ContentType).resource !==
          StorageResource.IPFS) ||
      (modelId === indexFileModelId &&
        file.contentType?.resource === StorageResource.CERAMIC &&
        dataUnion.options?.signal &&
        (dataUnion.options?.signal as ContentType).resource !==
          StorageResource.CERAMIC) ||
      (modelId === actionFileModelId &&
        dataUnion.options?.signal &&
        !((dataUnion.options?.signal as ActionType) in ActionType))
    ) {
      throw new Error(
        "The file type that the data union can store does not match the current file type",
      );
    }

    const unlockingTimeStamp = await getTimestampByBlockNumber({
      chainId: linkedAsset.chainId,
      blockNumber,
    });

    const monetizationProvider = {
      dependency: {
        linkedAsset,
        blockNumber,
      },
    };

    const decryptionConditions = await this.getAccessControlConditions({
      creator,
      unlockingTimeStamp,
      monetizationProvider,
    });

    const encryptionProvider = {
      protocol: EncryptionProtocol.Lit,
      decryptionConditions,
      decryptionConditionsType:
        DecryptionConditionsType.UnifiedAccessControlCondition,
      unlockingTimeStamp,
    };

    const res = await this.dataverseConnector.runOS({
      method: SYSTEM_CALL.monetizeFile,
      params: {
        fileId,
        monetizationProvider,
        encryptionProvider,
      },
    });

    return res;
  }

  async getAccessControlConditions({
    creator,
    unlockingTimeStamp,
    monetizationProvider,
  }: {
    creator: string;
    unlockingTimeStamp?: number;
    monetizationProvider: MonetizationProvider;
  }): Promise<DecryptionConditions> {
    const conditions = [];

    const linkedAsset = monetizationProvider?.dependency?.linkedAsset;
    const assetId = linkedAsset?.assetId;
    const assetContract = linkedAsset?.assetContract;
    const chainId = linkedAsset?.chainId;
    const blockNumber = monetizationProvider?.dependency?.blockNumber;

    unlockingTimeStamp &&
      conditions.push(
        this.getTimeStampAccessControlConditions(String(unlockingTimeStamp)),
      );

    const unifiedAccessControlConditions = [
      {
        conditionType: "evmBasic",
        contractAddress: "",
        standardContractType: "",
        chain: "ethereum",
        method: "",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: "=",
          value: `${creator}`,
        },
      },
    ] as (UnifiedAccessControlCondition | BooleanCondition)[];

    if (assetId && assetContract && chainId && blockNumber) {
      unifiedAccessControlConditions.push(
        ...[
          { operator: "or" },
          this.getIsDataUnionSubscribedAccessControlConditions({
            contractAddress: assetContract,
            chain: getChainNameFromChainId(chainId),
            dataUnionId: assetId,
            blockNumber,
          }),
        ],
      );
    }

    conditions.push(unifiedAccessControlConditions);

    return conditions;
  }

  getIsDataUnionSubscribedAccessControlConditions({
    contractAddress,
    chain,
    dataUnionId,
    blockNumber,
  }: {
    contractAddress: string;
    chain: string;
    dataUnionId: string;
    blockNumber: number;
  }) {
    return {
      contractAddress,
      conditionType: "evmContract",
      functionName: "isAccessible",
      functionParams: [dataUnionId, ":userAddress", String(blockNumber)],
      functionAbi: {
        inputs: [
          {
            internalType: "bytes32",
            name: "dataUnionId",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "subscriber",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "blockNumber",
            type: "uint256",
          },
        ],
        name: "isAccessible",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      chain,
      returnValueTest: {
        key: "",
        comparator: "=",
        value: "true",
      },
    };
  }

  getTimeStampAccessControlConditions(value: string) {
    return {
      conditionType: "evmBasic",
      contractAddress: "",
      standardContractType: "timestamp",
      chain: "ethereum",
      method: "eth_getBlockByNumber",
      parameters: ["latest"],
      returnValueTest: {
        comparator: ">=",
        value,
      },
    };
  }

  public getDataUnionById(
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
    const litACL = LitACL__factory.connect(
      DeployedContracts[this.chain].DataUnion.LitACL,
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

  static async loadDataUnionsPublishedBy(
    publisher: string,
  ): Promise<Array<DataUnionGraphType>> {
    return loadDataUnionsPublishedBy(publisher);
  }

  static async loadDataUnionsCollectedBy(
    collector: string,
  ): Promise<Array<DataUnionGraphType>> {
    return loadDataUnionsCollectedBy(collector);
  }

  static async loadDataUnionCollectors(
    dataUnionId: string,
  ): Promise<Array<Data_Union_Subscriber>> {
    return loadDataUnionCollectors(dataUnionId);
  }

  static async loadDataUnionSubscribers(
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

  static async loadDataUnion(dataUnionId: string): Promise<DataUnionGraphType> {
    return loadDataUnion(dataUnionId);
  }

  static async loadDataUnions(
    dataUnionIds: Array<string>,
  ): Promise<Array<DataUnionGraphType>> {
    return loadDataUnions(dataUnionIds);
  }

  static async loadDataUnionSubscriptionsBy({
    dataUnionId,
    collector,
  }: {
    dataUnionId: string;
    collector: string;
  }): Promise<Array<Data_Union_Subscriber>> {
    return loadDataUnionSubscriptionsBy(dataUnionId, collector);
  }

  static async isDataUnionCollectedBy({
    dataUnionId,
    collector,
  }: {
    dataUnionId: string;
    collector: string;
  }): Promise<boolean> {
    return isDataUnionCollectedBy(dataUnionId, collector);
  }

  static async isDataUnionSubscribedBy({
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
    if (this.chain !== "PolygonMumbai" && this.chain !== "BSCTestnet") {
      throw new Error("Unsupported Chain");
    }
    let subscribeModuleInitData;
    switch (subscribeModule) {
      case "BlockSubscribeModule": {
        subscribeModuleInitData = abiCoder.encode(
          ["address", "uint256"],
          [DeployedContracts[this.chain][currency], amount],
        );
        break;
      }

      case "TimeSegmentSubscribeModule": {
        const segmentInBlockNumber =
          BlockNumberConfig[this.chain].segment[segment!];
        subscribeModuleInitData = abiCoder.encode(
          ["address", "uint256", "uint256"],
          [
            DeployedContracts[this.chain][currency],
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
    let subscribeData;
    switch (subscribeModule) {
      case (DeployedContracts[this.chain] as any).DataUnion
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

      case (DeployedContracts[this.chain] as any).DataUnion
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
