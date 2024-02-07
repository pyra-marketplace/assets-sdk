import { BigNumber, BigNumberish, ethers } from "ethers";
import { Connector, SYSTEM_CALL, FileContent } from "@meteor-web3/connector";
import {
  //   isDataTokenCollectedBy,
  loadDataTokensCollectedBy,
  loadDataTokensCreatedBy
  //   loadDataTokenCollectors,
  //   loadDataToken,
  //   loadDataTokens,
} from "../graphql";
import { abiCoder } from "../utils/abi-coder";
import { DataAssetBase } from "../data-asset/DataAssetBase";
import {
  ActParams,
  AddActionsParams,
  PublishParams
} from "../data-asset/types";
import { ChainId } from "../types";
import { getChainNameFromChainId } from "../utils";
import {
  DataToken__factory,
  CollectAction__factory,
  FeeCollectModule__factory
} from "./abi/typechain";
import { DEPLOYED_ADDRESSES } from "./addresses";
import { TokenAsset } from "./types";

export class DataToken extends DataAssetBase {
  constructor({
    chainId,
    connector,
    fileId,
    assetId
  }: {
    chainId?: ChainId;
    connector: Connector;
    fileId?: string;
    assetId?: string;
  }) {
    super({
      chainId,
      connector,
      assetContract: DEPLOYED_ADDRESSES[chainId!]?.DataToken,
      fileOrFolderId: fileId,
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

    await this.connector.getProvider().request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${this.chainId.toString(16)}` }]
    });

    const data: string = abiCoder.encode(["string", "string"], [resourceId, this.fileOrFolderId]);
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

    const publishParams: PublishParams = {
      data,
      actions,
      actionInitDatas
    };

    return await this.createAssetHandler(publishParams, withSig);
  }

  async applyConditionsToFile(timestamp?: number) {
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

    this.chainId &&
      this.addSourceCondition({
        acl: {
          contractAddress: DEPLOYED_ADDRESSES[this.chainId].CollectAction,
          conditionType: "evmContract",
          chain: getChainNameFromChainId(this.chainId),
          functionName: "isCollected",
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
              }
            ],
            name: "isCollected",
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
        timestamp
      });

    const res = await this.applyFileConditions();

    return res;
  }

  async createTokenFile({
    modelId,
    fileName,
    fileContent,
    actionsConfig,
    timestamp,
    withSig
  }: {
    modelId: string;
    fileName?: string;
    fileContent: FileContent;
    actionsConfig: {
      collectAction?: {
        currency: string;
        amount: BigNumberish;
        totalSupply?: BigNumberish;
      };
    };
    timestamp?: number;
    withSig?: boolean;
  }) {
    const createIndexFileRes = await this.connector.runOS({
      method: SYSTEM_CALL.createIndexFile,
      params: {
        modelId,
        fileName,
        fileContent
      }
    });

    this.fileOrFolderId = createIndexFileRes.fileContent.file.fileId;

    await this.publish({
      resourceId: "test-resource-id" ?? modelId,
      actionsConfig,
      withSig
    });

    const applyConditionsToFileRes =
      await this.applyConditionsToFile(timestamp);

    return applyConditionsToFileRes;
  }

  async monetizeFile({
    actionsConfig,
    withSig
  }: {
    actionsConfig: {
      collectAction?: {
        currency: string;
        amount: BigNumberish;
        totalSupply?: BigNumberish;
      };
    };
    withSig?: boolean;
  }) {
    if (!this.fileOrFolderId) {
      throw new Error("File Id cannot be empty");
    }

    const res = await this.connector.runOS({
      method: SYSTEM_CALL.loadFile,
      params: this.fileOrFolderId
    });

    await this.publish({
      resourceId:
        "test-resource-id" ?? res.fileContent.file?.contentType?.resourceId,
      actionsConfig,
      withSig
    });

    const applyConditionsToFileRes = await this.applyConditionsToFile();

    return applyConditionsToFileRes;
  }

  public async getTokenAsset() {
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
    const dataToken = DataToken__factory.connect(
      this.assetContract,
      this.signer
    );
    const tokenAsset: TokenAsset = await dataToken.getTokenAsset(this.assetId);
    return tokenAsset;
  }

  public async isCollected(account: string) {
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

    const collectAction = CollectAction__factory.connect(
      DEPLOYED_ADDRESSES[this.chainId].CollectAction,
      this.signer
    );

    const res = await collectAction.isCollected(this.assetId, account);

    return res;
  }

  public async addActions({
    collectAction,
    withSig
  }: {
    collectAction?: {
      currency: string;
      amount: BigNumberish;
      totalSupply?: BigNumberish;
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

    await this.connector.getProvider().request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${this.chainId.toString(16)}` }]
    });

    const tokenAsset = await this.getTokenAsset();

    const actions: string[] = [];
    const actionInitDatas: string[] = [];

    if (collectAction) {
      if (
        tokenAsset.actions.includes(
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

    const addActionsParams: AddActionsParams = {
      assetId: this.assetId,
      actions,
      actionInitDatas
    };

    return await this._addActions(addActionsParams, withSig);
  }

  public async collect(withSig: boolean = false) {
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

    await this.connector.getProvider().request({
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

  public async loadCreatedTokenFiles(creator: string) {
    const dataTokens: any[] = await loadDataTokensCreatedBy(creator);

    const fileIds = dataTokens.map((dataToken) =>
      dataToken.source.replace("ceramic://", "")
    );

    const res = await this.connector.runOS({
      method: SYSTEM_CALL.loadFilesBy,
      params: { fileIds }
    });

    return res;
  }

  public async loadCollectedTokenFiles(collector: string) {
    const dataTokens: any[] = await loadDataTokensCollectedBy(collector);

    const fileIds = dataTokens.map((dataToken) =>
      dataToken.source.replace("ceramic://", "")
    );

    const res = await this.connector.runOS({
      method: SYSTEM_CALL.loadFilesBy,
      params: { fileIds }
    });

    return res;
  }
}
