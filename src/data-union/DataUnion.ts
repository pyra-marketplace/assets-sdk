import { BigNumber, BigNumberish, Wallet, ethers } from "ethers";
import { DataverseConnector, Signal } from "@dataverse/dataverse-connector";
// import {
//   loadDataUnionsPublishedBy,
//   loadDataUnionsCollectedBy,
//   loadDataUnionSubscriptionsBy,
//   loadDataUnionCollectors,
//   loadDataUnion,
//   Data_Union_Subscriber,
//   loadDataUnionSubscribers,
//   DataUnion as DataUnionGraphType,
//   Data_Union_Subscription,
//   isDataUnionCollectedBy,
//   loadDataUnions,
// } from "../graphql";
import { oneDayLater } from "../utils";
import { abiCoder } from "../utils";
import { DataAssetBase } from "../data-asset/DataAssetBase";
import {
  ActParams,
  AddActionsParams,
  EIP712Signature,
  PublishParams,
} from "../data-asset/types";
import { DataMonetizerBase__factory } from "../data-asset/abi/typechain";
import { ChainId } from "../types";
import {
  DataUnion__factory,
  FeeCollectModule__factory,
  MonthlySubscribeModule__factory,
  SubscribeAction__factory,
} from "./abi/typechain";
import { UnionAsset } from "./types";
import { DEPLOYED_ADDRESSES } from "./addresses";

export class DataUnion extends DataAssetBase {
  constructor({
    chainId,
    folderId,
    dataverseConnector,
  }: {
    chainId: ChainId;
    folderId: string;
    dataverseConnector: DataverseConnector;
  }) {
    super({
      chainId,
      assetContract: DEPLOYED_ADDRESSES[chainId].DataUnion,
      fileOrFolderId: folderId,
      dataverseConnector,
    });
  }

  public async getUnionAsset() {
    if (!this.assetContract) {
      throw new Error(
        "AssetContract cannot be empty, please pass in through constructor",
      );
    }
    if (!this.assetId) {
      throw new Error(
        "AssetId cannot be empty, please call createAssetHandler first",
      );
    }
    const dataUnion = DataUnion__factory.connect(
      this.assetContract,
      this.signer,
    );
    const unionAsset: UnionAsset = await dataUnion.getUnionAsset(this.assetId);
    return unionAsset;
  }

  public async publish({
    resourceId,
    actionsConfig,
    withSig,
  }: {
    resourceId: string;
    actionsConfig?: {
      collectAction?: {
        currency: string;
        amount: BigNumberish;
        totalSupply?: BigNumberish;
      };
      subscribeAction?: {
        currency: string;
        amount: BigNumberish;
      };
    };
    withSig?: boolean;
  }) {
    if (this.assetId) {
      return this.assetId;
    }
    if (!this.chainId) {
      throw new Error(
        "ChainId cannot be empty, please pass in through constructor",
      );
    }

    const data: string = abiCoder.encode(["string"], [this.fileOrFolderId]);

    const actions: string[] = [];
    const actionInitDatas: string[] = [];

    if (actionsConfig?.collectAction) {
      actions.push(DEPLOYED_ADDRESSES[this.chainId].CollectAction);

      const collectModuleInitData = abiCoder.encode(
        ["uint256", "address", "uint256"],
        [
          actionsConfig.collectAction.totalSupply ??
            ethers.constants.MaxUint256,
          actionsConfig.collectAction.currency,
          actionsConfig.collectAction.amount,
        ],
      );
      const actionInitData = abiCoder.encode(
        ["address", "bytes"],
        [
          DEPLOYED_ADDRESSES[this.chainId].FeeCollectModule,
          collectModuleInitData,
        ],
      );
      actionInitDatas.push(actionInitData);
    }

    if (actionsConfig?.subscribeAction) {
      actions.push(DEPLOYED_ADDRESSES[this.chainId].SubscribeAction);

      const subscribeModuleInitData = abiCoder.encode(
        ["address", "uint256"],
        [
          actionsConfig.subscribeAction.currency,
          actionsConfig.subscribeAction.amount,
        ],
      );
      const actionInitData = abiCoder.encode(
        ["address", "bytes"],
        [
          DEPLOYED_ADDRESSES[this.chainId].MonthlySubscribeModule,
          subscribeModuleInitData,
        ],
      );
      actionInitDatas.push(actionInitData);
    }

    const publishParams: PublishParams = {
      resourceId,
      data,
      actions,
      actionInitDatas,
      images: [],
    };

    const assetId = await this.createAssetHandler(publishParams, withSig);
    this.assetId = assetId.toString();
  }

  public async addActions({
    collectAction,
    subscribeAction,
    withSig,
  }: {
    collectAction?: {
      currency: string;
      amount: BigNumberish;
      totalSupply?: BigNumberish;
    };
    subscribeAction?: {
      currency: string;
      amount: BigNumberish;
    };
    withSig?: boolean;
  }) {
    if (!this.assetId) {
      throw new Error(
        "AssetId cannot be empty, please call createAssetHandler first",
      );
    }
    if (!this.chainId) {
      throw new Error(
        "ChainId cannot be empty, please pass in through constructor",
      );
    }
    const unionAsset = await this.getUnionAsset();

    const actions: string[] = [];
    const actionInitDatas: string[] = [];

    if (collectAction) {
      if (
        unionAsset.actions.includes(
          DEPLOYED_ADDRESSES[this.chainId].CollectAction,
        )
      ) {
        throw new Error("CollectAction already enabled.");
      }
      actions.push(DEPLOYED_ADDRESSES[this.chainId].CollectAction);

      const collectModuleInitData = abiCoder.encode(
        ["uint256", "address", "uint256"],
        [
          collectAction.totalSupply ?? ethers.constants.MaxUint256,
          collectAction.currency,
          collectAction.amount,
        ],
      );
      const actionInitData = abiCoder.encode(
        ["address", "bytes"],
        [
          DEPLOYED_ADDRESSES[this.chainId].FeeCollectModule,
          collectModuleInitData,
        ],
      );
      actionInitDatas.push(actionInitData);
    }

    if (subscribeAction) {
      if (
        unionAsset.actions.includes(
          DEPLOYED_ADDRESSES[this.chainId].SubscribeAction,
        )
      ) {
        throw new Error("SubscribeAction already enabled.");
      }
      actions.push(DEPLOYED_ADDRESSES[this.chainId].SubscribeAction);

      const subscribeModuleInitData = abiCoder.encode(
        ["address", "uint256"],
        [subscribeAction.currency, subscribeAction.amount],
      );
      const actionInitData = abiCoder.encode(
        ["address", "bytes"],
        [
          DEPLOYED_ADDRESSES[this.chainId].MonthlySubscribeModule,
          subscribeModuleInitData,
        ],
      );
      actionInitDatas.push(actionInitData);
    }

    const addActionsParams: AddActionsParams = {
      assetId: this.assetId,
      actions,
      actionInitDatas,
    };

    return await this._addActions(addActionsParams, withSig);
  }

  public async close(withSig: boolean = false) {
    if (!this.assetId) {
      throw new Error(
        "AssetId cannot be empty, please call createAssetHandler first",
      );
    }
    if (!this.chainId) {
      throw new Error(
        "ChainId cannot be empty, please pass in through constructor",
      );
    }

    const dataUnion = DataUnion__factory.connect(
      DEPLOYED_ADDRESSES[this.chainId].DataUnion,
      this.signer,
    );

    let receipt;
    if (!withSig) {
      const tx = await dataUnion.close(this.assetId);
      receipt = await tx.wait();
    } else {
      const signature = await this._buildCloseSignature();
      const tx = await dataUnion.closeWithSig(this.assetId, signature);
      receipt = await tx.wait();
    }

    const targetEvents = receipt.events?.filter(e => e.event === "UnionClosed");
    if (!targetEvents || targetEvents.length === 0 || !targetEvents[0].args) {
      throw new Error("Filter Published event failed");
    }
    return BigNumber.from(targetEvents[0].args[2]).toNumber();
  }

  public async collect(withSig?: boolean) {
    if (!this.assetId) {
      throw new Error(
        "AssetId cannot be empty, please call createAssetHandler first",
      );
    }
    if (!this.chainId) {
      throw new Error(
        "ChainId cannot be empty, please pass in through constructor",
      );
    }

    const feeCollectModuleContract = FeeCollectModule__factory.connect(
      DEPLOYED_ADDRESSES[this.chainId].FeeCollectModule,
      this.signer,
    );
    const { currency, amount } =
      await feeCollectModuleContract.getAssetCollectDetail(this.assetId);

    await this._checkERC20BalanceAndAllowance(
      currency,
      amount,
      DEPLOYED_ADDRESSES[this.chainId].CollectAction,
    );

    const actionProcessData = abiCoder.encode(
      ["address", "uint256"],
      [currency, amount],
    );

    const actParams: ActParams = {
      assetId: this.assetId,
      actions: [DEPLOYED_ADDRESSES[this.chainId].CollectAction],
      actionProcessDatas: [actionProcessData],
    };

    const [actionReturnData] = await this._act(actParams, withSig);
    const [collectionId] = abiCoder.decode(
      ["uint256", "bytes"],
      actionReturnData,
    );

    return collectionId as BigNumber;
  }

  public async subscribe({
    year,
    month,
    count,
    withSig,
  }: {
    year: number;
    month: number;
    count?: number;
    withSig?: boolean;
  }) {
    if (!this.assetId) {
      throw new Error(
        "AssetId cannot be empty, please call createAssetHandler first",
      );
    }
    if (!this.chainId) {
      throw new Error(
        "ChainId cannot be empty, please pass in through constructor",
      );
    }
    if (!count) {
      count = 1;
    }
    const monthlySubscribeModule = MonthlySubscribeModule__factory.connect(
      DEPLOYED_ADDRESSES[this.chainId].MonthlySubscribeModule,
      this.signer,
    );
    const { currency, amount } =
      await monthlySubscribeModule.getAssetSubscribeDetail(this.assetId);
    await this._checkERC20BalanceAndAllowance(
      currency,
      amount.mul(count),
      DEPLOYED_ADDRESSES[this.chainId].CollectAction,
    );

    const actionProcessData = abiCoder.encode(
      ["uint256", "uint256", "uint256"],
      [year, month, count],
    );

    const actParams: ActParams = {
      assetId: this.assetId,
      actions: [DEPLOYED_ADDRESSES[this.chainId].CollectAction],
      actionProcessDatas: [actionProcessData],
    };

    const [actionReturnData] = await this._act(actParams, withSig);
    const [startAt, endAt] = abiCoder.decode(
      ["uint256", "uint256"],
      actionReturnData,
    );

    return [startAt, endAt];
  }

  public async getSubscriptionData(collectionId: BigNumberish) {
    if (!this.assetId) {
      throw new Error(
        "AssetId cannot be empty, please call createAssetHandler first",
      );
    }
    if (!this.chainId) {
      throw new Error(
        "ChainId cannot be empty, please pass in through constructor",
      );
    }
    const subscribeAction = SubscribeAction__factory.connect(
      DEPLOYED_ADDRESSES[this.chainId].SubscribeAction,
      this.signer,
    );
    const subscribeData = await subscribeAction.getSubscribeData(
      this.assetId,
      collectionId,
    );

    return subscribeData;
  }

  // public async loadCreatedDataUnionFolders(creator: string) {
  //   const dataUnions = await DataUnion.loadDataUnionsPublishedBy(creator);

  //   const folderIds = dataUnions.map(dataUnion =>
  //     dataUnion.data_token_info.source.replace("ceramic://", ""),
  //   );

  //   const res = await this.dataverseConnector.runOS({
  //     method: SYSTEM_CALL.loadFoldersBy,
  //     params: { folderIds },
  //   });

  //   return res;
  // }

  // public async loadCollectedDataUnionFolders(collector: string) {
  //   const dataUnions = await DataUnion.loadDataUnionsCollectedBy(collector);

  //   const folderIds = dataUnions.map(dataUnion =>
  //     dataUnion.data_token_info.source.replace("ceramic://", ""),
  //   );

  //   const res = await this.dataverseConnector.runOS({
  //     method: SYSTEM_CALL.loadFoldersBy,
  //     params: { folderIds },
  //   });

  //   return res;
  // }

  async applyConditionsToFolder(signal?: Signal) {
    const res = await this.applyFolderConditions(signal);

    return res;
  }

  private async _buildCloseSignature() {
    if (!this.assetContract) {
      throw new Error(
        "AssetContract cannot be empty, please pass in through constructor",
      );
    }
    if (!this.chainId) {
      throw new Error(
        "ChainId cannot be empty, please pass in through constructor",
      );
    }
    const dataMonetizerBase = DataMonetizerBase__factory.connect(
      this.assetContract,
      this.signer,
    );
    const nonce = await dataMonetizerBase.getSigNonce(
      await this.signer.getAddress(),
    );
    const { name, version } = await dataMonetizerBase.eip712Domain();

    const deadline = oneDayLater();

    const msgParams = {
      types: {
        AddActionsWithSig: [{ name: "assetId", type: "bytes32" }],
      },
      domain: {
        name,
        version,
        chainId: this.chainId,
        verifyingContract: this.assetContract,
      },
      value: {
        assetId: this.assetId,
        nonce,
        deadline,
      },
    };

    const { v, r, s } = ethers.utils.splitSignature(
      await (this.signer as Wallet)._signTypedData(
        msgParams.domain,
        msgParams.types,
        msgParams.value,
      ),
    );

    const sig: EIP712Signature = {
      signer: await this.signer.getAddress(),
      v,
      r,
      s,
      deadline,
    };

    return sig;
  }
}
