import { BigNumber, BigNumberish, ethers } from "ethers";
import { Connector, SYSTEM_CALL, FileContent } from "@meteor-web3/connector";
// import //   isDataTokenCollectedBy,
// //   loadDataTokenCollectors,
// "../graphql";
import { abiCoder } from "../utils/abi-coder";
import { DataAssetBase } from "../data-asset/DataAssetBase";
import {
  ActParams,
  AddActionsParams,
  PublishParams
} from "../data-asset/types";
import { ChainId } from "../types";
import { getChainNameFromChainId } from "../utils";
import { switchNetwork } from "../utils/network";
import { http } from "../utils/http";
import { retryRPC } from "../utils/retryRPC";
import { FeeCollectModule__factory } from "./abi/typechain";
import { DEPLOYED_ADDRESSES } from "./configs";

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

    const data: string = abiCoder.encode(
      ["string", "string"],
      [resourceId, this.fileOrFolderId]
    );
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

    await switchNetwork({ connector: this.connector, chainId: this.chainId });

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
      resourceId: modelId,
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
      resourceId: res.fileContent.file?.contentType?.resourceId ?? "",
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
    if (!this.chainId) {
      throw new Error(
        "ChainId cannot be empty, please pass in through constructor"
      );
    }

    const res = await retryRPC({
      chainId: this.chainId,
      contractFactory: "dataToken__factory",
      assetContract: this.assetContract,
      method: "getTokenAsset",
      params: [this.assetId]
    });

    return res;
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

    const res = await retryRPC({
      chainId: this.chainId,
      contractFactory: "collectAction__factory",
      assetContract: DEPLOYED_ADDRESSES[this.chainId].CollectAction,
      method: "isCollected",
      params: [this.assetId, account]
    });

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

    await switchNetwork({ connector: this.connector, chainId: this.chainId });

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

    await switchNetwork({ connector: this.connector, chainId: this.chainId });

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
    const dataTokens: any[] = await DataToken.loadDataTokensCreatedBy(creator);
    const dataTokenRecord = Object.fromEntries(
      dataTokens.map((item) => [item.file_id, item])
    );
    if (dataTokens.length > 0) {
      const fileIds = dataTokens.map((dataToken) => dataToken.file_id);

      const res = await this.connector.runOS({
        method: SYSTEM_CALL.loadFilesBy,
        params: {
          modelId: dataTokens[0].resource_id,
          fileIds
        }
      });

      const files = Object.fromEntries(
        Object.entries(res).map(([fileId, file]) => {
          if (file.fileContent.file?.accessControl?.monetizationProvider) {
            (
              file.fileContent.file.accessControl.monetizationProvider
                .dataAsset as Record<string, any>
            )["assetDetail"] = dataTokenRecord[fileId];
          }
          return [fileId, file];
        })
      );

      return files;
    }
    return [];
  }

  public async loadCollectedTokenFiles(collector: string) {
    const dataTokens: any[] =
      await DataToken.loadDataTokensCollectedBy(collector);
    const dataTokenRecord = Object.fromEntries(
      dataTokens.map((item) => [item.file_id, item])
    );

    if (dataTokens.length > 0) {
      const fileIds = dataTokens.map((dataToken) => dataToken.file_id);

      const res = await this.connector.runOS({
        method: SYSTEM_CALL.loadFilesBy,
        params: {
          modelId:
            // .sort((a, b) => parseInt(b.publish_at) - parseInt(a.publish_at))
            // .find((item) => item.resource_id !== "test-resource-id")
            dataTokens[0].resource_id,
          fileIds
        }
      });

      const files = Object.fromEntries(
        Object.entries(res).map(([fileId, file]) => {
          if (file.fileContent.file?.accessControl?.monetizationProvider) {
            (
              file.fileContent.file.accessControl.monetizationProvider
                .dataAsset as Record<string, any>
            )["assetDetail"] = dataTokenRecord[fileId];
          }
          return [fileId, file];
        })
      );

      return files;
    }
    return [];
  }

  static async loadDataTokens(dataTokenIds: string[]) {
    const dataTokens = (
      await http.request({
        url: `*/data-token`,
        method: "get",
        params: {
          asset_ids: dataTokenIds.join(",")
        }
      })
    ).data;
    return dataTokens;
  }

  static async loadDataTokenCollectors(dataTokenId: string) {
    const dataTokens = (
      await http.request({
        url: `*/data-token/collector`,
        method: "get",
        params: {
          asset_id: dataTokenId
        }
      })
    ).data;
    return dataTokens;
  }

  static async loadDataTokensCollectedBy(collector: string) {
    const dataTokens = (
      await http.request({
        url: `*/data-token`,
        method: "get",
        params: {
          collector
        }
      })
    ).data;
    return dataTokens;
  }

  static async loadDataTokensCreatedBy(creator: string) {
    const dataTokens = (
      await http.request({
        url: `*/data-token`,
        method: "get",
        params: {
          publisher: creator
        }
      })
    ).data;
    return dataTokens;
  }
}
