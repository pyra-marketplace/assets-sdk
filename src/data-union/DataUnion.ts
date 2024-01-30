import { BigNumber, BigNumberish, Wallet, ethers } from "ethers";
import {
  Attached,
  DataAsset,
  Connector,
  FileContent,
  SYSTEM_CALL,
  Signal,
  StructuredFolder,
  StructuredFolderRecord
} from "@meteor-web3/connector";
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
  PublishParams
} from "../data-asset/types";
import { DataMonetizerBase__factory } from "../data-asset/abi/typechain";
import { ChainId } from "../types";
import {
  loadDataUnionsCollectedBy,
  loadDataUnionsPublishedBy
} from "../graphql";
import {
  DataUnion__factory,
  FeeCollectModule__factory,
  MonthlySubscribeModule__factory,
  SubscribeAction__factory
} from "./abi/typechain";
import { UnionAsset } from "./types";
import { DEPLOYED_ADDRESSES } from "./addresses";

export class DataUnion extends DataAssetBase {
  constructor({
    chainId,
    connector,
    folderId,
    assetId
  }: {
    chainId?: ChainId;
    connector: Connector;
    folderId?: string;
    assetId?: string;
  }) {
    super({
      chainId,
      connector,
      assetContract: DEPLOYED_ADDRESSES[chainId!]?.DataUnion,
      fileOrFolderId: folderId,
      assetId
    });
  }

  public async publish({
    resourceId,
    actionsConfig,
    withSig
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
        "ChainId cannot be empty, please pass in through constructor"
      );
    }

    await this.connector.provider?.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${this.chainId.toString(16)}` }]
    });

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
          actionsConfig.collectAction.amount
        ]
      );
      const actionInitData = abiCoder.encode(
        ["address", "bytes"],
        [
          DEPLOYED_ADDRESSES[this.chainId].FeeCollectModule,
          collectModuleInitData
        ]
      );
      actionInitDatas.push(actionInitData);
    }

    if (actionsConfig?.subscribeAction) {
      actions.push(DEPLOYED_ADDRESSES[this.chainId].SubscribeAction);

      const subscribeModuleInitData = abiCoder.encode(
        ["address", "uint256"],
        [
          actionsConfig.subscribeAction.currency,
          actionsConfig.subscribeAction.amount
        ]
      );
      const actionInitData = abiCoder.encode(
        ["address", "bytes"],
        [
          DEPLOYED_ADDRESSES[this.chainId].MonthlySubscribeModule,
          subscribeModuleInitData
        ]
      );
      actionInitDatas.push(actionInitData);
    }

    const publishParams: PublishParams = {
      resourceId,
      data,
      actions,
      actionInitDatas,
      images: []
    };

    return await this.createAssetHandler(publishParams, withSig);
  }

  public async createUnionFolder({
    folderName,
    signals,
    actionsConfig,
    withSig
  }: {
    folderName: string;
    signals?: Signal[];
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
    const res = await this.connector.runOS({
      method: SYSTEM_CALL.createFolder,
      params: {
        folderName,
        signals
      }
    });

    this.fileOrFolderId = res.newFolder.folderId;

    await this.publish({
      resourceId: "test-resource-id" ?? res.newFolder.model[0],
      actionsConfig,
      withSig
    });

    const applyConditionsToFolderRes = await this.applyConditionsToFolder();

    return applyConditionsToFolderRes;
  }

  public async createFileInUnionFolder({
    modelId,
    fileName,
    fileContent,
    unionFolderId,
    timestamp
  }: {
    modelId: string;
    fileName?: string;
    fileContent: FileContent;
    unionFolderId: string;
    timestamp?: number;
  }) {
    if (!this.assetId) {
      throw new Error(
        "AssetId cannot be empty, please call createAssetHandler first"
      );
    }
    if (!this.chainId) {
      throw new Error(
        "ChainId cannot be empty, please pass in through constructor"
      );
    }
    if (!this.assetContract) {
      throw new Error(
        "AssetContract cannot be empty, please pass in through constructor"
      );
    }

    const res = await this.connector.runOS({
      method: SYSTEM_CALL.createIndexFile,
      params: {
        modelId,
        fileName,
        fileContent,
        folderId: unionFolderId
      }
    });

    const applyConditionsToFileRes = await this.applyConditionsToFile({
      fileId: res.fileContent.file.fileId,
      linkedAsset: {
        assetId: this.assetId,
        assetContract: this.assetContract,
        chainId: this.chainId
      },
      attached: {
        timestamp
      }
    });

    return applyConditionsToFileRes;
  }

  public async addFileInToUnionFolder({
    fileId,
    timestamp
  }: {
    fileId: string;
    timestamp?: number;
  }) {
    if (!this.assetId) {
      throw new Error(
        "AssetId cannot be empty, please call createAssetHandler first"
      );
    }
    if (!this.chainId) {
      throw new Error(
        "ChainId cannot be empty, please pass in through constructor"
      );
    }
    if (!this.assetContract) {
      throw new Error(
        "AssetContract cannot be empty, please pass in through constructor"
      );
    }
    if (!this.fileOrFolderId) {
      throw new Error("Folder Id cannot be empty");
    }

    const applyConditionsToFileRes = await this.applyConditionsToFile({
      fileId,
      linkedAsset: {
        assetId: this.assetId,
        assetContract: this.assetContract,
        chainId: this.chainId
      },
      attached: {
        timestamp
      }
    });

    await this.connector.runOS({
      method: SYSTEM_CALL.moveFiles,
      params: {
        targetFolderId: this.fileOrFolderId,
        fileIds: [fileId]
      }
    });

    return applyConditionsToFileRes;
  }

  public async getUnionAsset() {
    if (!this.assetContract) {
      throw new Error(
        "AssetContract cannot be empty, please pass in through constructor"
      );
    }
    if (!this.assetId) {
      throw new Error(
        "AssetId cannot be empty, please call createAssetHandler first"
      );
    }
    if (!this.signer) {
      throw new Error("Signer not found, please collect wallet");
    }

    const dataUnion = DataUnion__factory.connect(
      this.assetContract,
      this.signer
    );
    const unionAsset: UnionAsset = await dataUnion.getUnionAsset(this.assetId);
    return unionAsset;
  }

  public async addActions({
    collectAction,
    subscribeAction,
    withSig
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
        "AssetId cannot be empty, please call createAssetHandler first"
      );
    }
    if (!this.chainId) {
      throw new Error(
        "ChainId cannot be empty, please pass in through constructor"
      );
    }

    await this.connector.provider?.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${this.chainId.toString(16)}` }]
    });

    const unionAsset = await this.getUnionAsset();

    const actions: string[] = [];
    const actionInitDatas: string[] = [];

    if (collectAction) {
      if (
        unionAsset.actions.includes(
          DEPLOYED_ADDRESSES[this.chainId].CollectAction
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
          collectAction.amount
        ]
      );
      const actionInitData = abiCoder.encode(
        ["address", "bytes"],
        [
          DEPLOYED_ADDRESSES[this.chainId].FeeCollectModule,
          collectModuleInitData
        ]
      );
      actionInitDatas.push(actionInitData);
    }

    if (subscribeAction) {
      if (
        unionAsset.actions.includes(
          DEPLOYED_ADDRESSES[this.chainId].SubscribeAction
        )
      ) {
        throw new Error("SubscribeAction already enabled.");
      }
      actions.push(DEPLOYED_ADDRESSES[this.chainId].SubscribeAction);

      const subscribeModuleInitData = abiCoder.encode(
        ["address", "uint256"],
        [subscribeAction.currency, subscribeAction.amount]
      );
      const actionInitData = abiCoder.encode(
        ["address", "bytes"],
        [
          DEPLOYED_ADDRESSES[this.chainId].MonthlySubscribeModule,
          subscribeModuleInitData
        ]
      );
      actionInitDatas.push(actionInitData);
    }

    const addActionsParams: AddActionsParams = {
      assetId: this.assetId,
      actions,
      actionInitDatas
    };

    return await this._addActions(addActionsParams, withSig);
  }

  public async close(withSig: boolean = false) {
    if (!this.assetId) {
      throw new Error(
        "AssetId cannot be empty, please call createAssetHandler first"
      );
    }
    if (!this.chainId) {
      throw new Error(
        "ChainId cannot be empty, please pass in through constructor"
      );
    }
    if (!this.signer) {
      throw new Error("Signer not found, please collect wallet");
    }

    const dataUnion = DataUnion__factory.connect(
      DEPLOYED_ADDRESSES[this.chainId].DataUnion,
      this.signer
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

    const targetEvents = receipt.events?.filter(
      (e) => e.event === "UnionClosed"
    );
    if (!targetEvents || targetEvents.length === 0 || !targetEvents[0].args) {
      throw new Error("Filter Published event failed");
    }
    return BigNumber.from(targetEvents[0].args[2]).toNumber();
  }

  public async collect(withSig?: boolean) {
    if (!this.assetId) {
      throw new Error(
        "AssetId cannot be empty, please call createAssetHandler first"
      );
    }
    if (!this.chainId) {
      throw new Error(
        "ChainId cannot be empty, please pass in through constructor"
      );
    }
    if (!this.signer) {
      throw new Error("Signer not found, please collect wallet");
    }

    await this.connector.provider?.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${this.chainId.toString(16)}` }]
    });

    const feeCollectModuleContract = FeeCollectModule__factory.connect(
      DEPLOYED_ADDRESSES[this.chainId].FeeCollectModule,
      this.signer
    );
    const { currency, amount } =
      await feeCollectModuleContract.getAssetCollectDetail(this.assetId);

    await this._checkERC20BalanceAndAllowance(
      currency,
      amount,
      DEPLOYED_ADDRESSES[this.chainId].FeeCollectModule
    );

    const actionProcessData = abiCoder.encode(
      ["address", "uint256"],
      [currency, amount]
    );

    const actParams: ActParams = {
      assetId: this.assetId,
      actions: [DEPLOYED_ADDRESSES[this.chainId].CollectAction],
      actionProcessDatas: [actionProcessData]
    };

    const [actionReturnData] = await this._act(actParams, withSig);
    const [collectionId] = abiCoder.decode(
      ["uint256", "bytes"],
      actionReturnData
    );

    return collectionId as BigNumber;
  }

  public async subscribe({
    collectionId,
    year,
    month,
    count,
    withSig
  }: {
    collectionId: BigNumberish;
    year: number;
    month: number;
    count?: number;
    withSig?: boolean;
  }) {
    if (!this.assetId) {
      throw new Error(
        "AssetId cannot be empty, please call createAssetHandler first"
      );
    }
    if (!this.chainId) {
      throw new Error(
        "ChainId cannot be empty, please pass in through constructor"
      );
    }
    if (!this.signer) {
      throw new Error("Signer not found, please collect wallet");
    }

    await this.connector.provider?.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${this.chainId.toString(16)}` }]
    });

    if (!count) {
      count = 1;
    }
    const monthlySubscribeModule = MonthlySubscribeModule__factory.connect(
      DEPLOYED_ADDRESSES[this.chainId].MonthlySubscribeModule,
      this.signer
    );
    const { currency, amount } =
      await monthlySubscribeModule.getAssetSubscribeDetail(this.assetId);

    await this._checkERC20BalanceAndAllowance(
      currency,
      amount.mul(count),
      DEPLOYED_ADDRESSES[this.chainId].MonthlySubscribeModule
    );

    const subscribeProcessData = abiCoder.encode(
      ["uint256", "uint256", "uint256"],
      [year, month, count]
    );

    const actionProcessData = abiCoder.encode(
      ["uint256", "address", "bytes"],
      [
        collectionId,
        DEPLOYED_ADDRESSES[this.chainId].MonthlySubscribeModule,
        subscribeProcessData
      ]
    );

    const actParams: ActParams = {
      assetId: this.assetId,
      actions: [DEPLOYED_ADDRESSES[this.chainId].SubscribeAction],
      actionProcessDatas: [actionProcessData]
    };

    const [actionReturnData] = await this._act(actParams, withSig);
    const [startAt, endAt] = abiCoder.decode(
      ["uint256", "uint256"],
      actionReturnData
    );

    return { startAt, endAt };
  }

  public async getSubscriptionData(collectionId: BigNumberish) {
    if (!this.assetId) {
      throw new Error(
        "AssetId cannot be empty, please call createAssetHandler first"
      );
    }
    if (!this.chainId) {
      throw new Error(
        "ChainId cannot be empty, please pass in through constructor"
      );
    }
    if (!this.signer) {
      throw new Error("Signer not found, please collect wallet");
    }

    const subscribeAction = SubscribeAction__factory.connect(
      DEPLOYED_ADDRESSES[this.chainId].SubscribeAction,
      this.signer
    );
    const subscribeData = await subscribeAction.getSubscribeData(
      this.assetId,
      collectionId
    );

    return subscribeData;
  }

  public async loadCreatedUnionFolders(creator: string) {
    const dataUnions = await loadDataUnionsPublishedBy(creator);

    const folderIds = dataUnions.map(
      (dataUnion: { data_token_info: { source: string } }) =>
        dataUnion.data_token_info.source.replace("ceramic://", "")
    );

    const res = await this.connector.runOS({
      method: SYSTEM_CALL.loadFoldersBy,
      params: { folderIds }
    });

    return res;
  }

  public async loadCollectedUnionFolders(collector: string) {
    const dataUnions = await loadDataUnionsCollectedBy(collector);

    const folderIds = dataUnions.map(
      (dataUnion: { data_token_info: { source: string } }) =>
        dataUnion.data_token_info.source.replace("ceramic://", "")
    );

    const res = await this.connector.runOS({
      method: SYSTEM_CALL.loadFoldersBy,
      params: { folderIds }
    });

    return res;
  }

  async applyConditionsToFile({
    fileId,
    linkedAsset,
    attached
  }: {
    fileId?: string;
    linkedAsset?: DataAsset;
    attached?: Attached;
  }) {
    this.signer &&
      this.addGeneralCondition([
        {
          conditionType: "evmBasic",
          contractAddress: "",
          standardContractType: "",
          chain: "ethereum",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: await this.signer.getAddress()
          }
        }
      ]);

    await this.addLinkCondition({
      acl: {
        conditionType: "evmContract",
        functionName: "isAccessible",
        functionAbi: {
          inputs: [
            {
              internalType: "bytes32",
              name: "assetId",
              type: "bytes32"
            },
            {
              internalType: "address",
              name: "account",
              type: "address"
            },
            {
              internalType: "uint256",
              name: "timestamp",
              type: "uint256"
            }
          ],
          name: "isAccessible",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        returnValueTest: {
          key: "",
          comparator: "=",
          value: "true"
        }
      },
      linkedAsset,
      attached
    });

    const res = await this.applyFileConditions(fileId);

    return res;
  }

  async applyConditionsToFolder(): Promise<{
    newDataUnion: StructuredFolder;
    allDataUnions: StructuredFolderRecord;
  }> {
    const res = await this.applyFolderConditions();

    return res;
  }

  private async _buildCloseSignature() {
    if (!this.assetContract) {
      throw new Error(
        "AssetContract cannot be empty, please pass in through constructor"
      );
    }
    if (!this.chainId) {
      throw new Error(
        "ChainId cannot be empty, please pass in through constructor"
      );
    }
    if (!this.signer) {
      throw new Error("Signer not found, please collect wallet");
    }

    const dataMonetizerBase = DataMonetizerBase__factory.connect(
      this.assetContract,
      this.signer
    );
    const nonce = await dataMonetizerBase.getSigNonce(
      await this.signer.getAddress()
    );
    const { name, version } = await dataMonetizerBase.eip712Domain();

    const deadline = oneDayLater();

    const msgParams = {
      types: {
        AddActionsWithSig: [{ name: "assetId", type: "bytes32" }]
      },
      domain: {
        name,
        version,
        chainId: this.chainId,
        verifyingContract: this.assetContract
      },
      value: {
        assetId: this.assetId,
        nonce,
        deadline
      }
    };

    const { v, r, s } = ethers.utils.splitSignature(
      await (this.signer as Wallet)._signTypedData(
        msgParams.domain,
        msgParams.types,
        msgParams.value
      )
    );

    const sig: EIP712Signature = {
      signer: await this.signer.getAddress(),
      v,
      r,
      s,
      deadline
    };

    return sig;
  }
}
