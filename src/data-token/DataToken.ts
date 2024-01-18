import { BigNumber, BigNumberish, ethers } from "ethers";
import {
  DataverseConnector,
  DataAsset,
  Attached,
  SYSTEM_CALL,
} from "@dataverse/dataverse-connector";
import {
  //   isDataTokenCollectedBy,
  loadDataTokensCollectedBy,
  loadDataTokensCreatedBy,
  //   loadDataTokenCollectors,
  //   loadDataToken,
  //   loadDataTokens,
} from "../graphql";
import { abiCoder } from "../utils/abi-coder";
import { DataAssetBase } from "../data-asset/DataAssetBase";
// import { EMPTY_BYTES, ZERO_ADDRESS } from "./constants";
// import {
//   IDataToken,
//   IDataToken__factory,
//   IERC20__factory,
//   LensHub__factory,
//   SimpleFeeCollectModule__factory,
//   LimitedFeeCollectModule__factory,
//   LimitedTimedFeeCollectModule__factory,
//   ProfileNFT__factory,
//   CollectPublicationAction__factory,
//   ProfilelessHub__factory,
// } from "./contracts";
// import { DataTypes } from "./contracts/IDataToken";
// import {
//   _buildLensCollectSig,
//   _buildCyberCollectSig,
//   getCollectPaidMwData,
//   _buildProfilelessCollectSig,
// } from "./helpers";
// import {
//   // CollectDataTokenOutput,
//   // CyberCollectParams,
//   // GraphType,
//   // LensActParams,
//   // EIP712Signature,
//   ChainId,
//   ProfilelessCollectParams,
//   CreateDataTokenInput,
//   Chain,
//   TokenAsset,
//   TradeType,
// } from "./types";
import {
  ActParams,
  AddActionsParams,
  PublishParams,
} from "../data-asset/types";
import { ChainId } from "../types";
import {
  DataToken__factory,
  FeeCollectModule__factory,
  ShareAction__factory,
} from "./abi/typechain";
import { DEPLOYED_ADDRESSES } from "./addresses";
import { TokenAsset, TradeType } from "./types";
// import { DataTokenFactory } from "./DataTokenFactory";

export class DataToken extends DataAssetBase {
  // instance?: IDataToken;

  constructor({
    chainId,
    dataTokenContract,
    fileId,
    dataverseConnector,
  }: {
    chainId: ChainId;
    dataTokenContract: string;
    fileId: string;
    dataverseConnector: DataverseConnector;
  }) {
    super({
      chainId,
      assetContract: dataTokenContract,
      fileOrFolderId: fileId,
      dataverseConnector,
    });
    // if (dataTokenContract) {
    //   this.instance = IDataToken__factory.connect(
    //     dataTokenContract,
    //     this.signer,
    //   );
    // }
  }

  updateChain(chainId: ChainId) {
    this.chainId = chainId;
  }

  async applyConditionsToFile({
    unlockingTimeStamp,
    linkedAsset,
    attached,
  }: {
    assetId: string;
    unlockingTimeStamp?: number;
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
            value: await this.signer.getAddress(),
          },
        },
      ]);

    this.assetContract &&
      this.chainId &&
      this.addSourceCondition({
        acl: {
          conditionType: "evmContract",
          functionName: "isCollected",
          functionAbi: {
            inputs: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
            ],
            name: "isCollected",
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
          returnValueTest: {
            key: "",
            comparator: "=",
            value: "true",
          },
        },
        unlockingTimeStamp,
      });

    this.addLinkCondition({
      acl: {
        conditionType: "evmContract",
        functionName: "isAccessible",
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
        returnValueTest: {
          key: "",
          comparator: "=",
          value: "true",
        },
      },
      linkedAsset,
      attached,
    });

    const res = await this.applyFileConditions();

    return res;
  }

  public async loadCreatedDataTokenFiles(creator: string) {
    const dataTokens: any[] = await loadDataTokensCreatedBy(creator);

    const fileIds = dataTokens.map(dataToken =>
      dataToken.source.replace("ceramic://", ""),
    );

    const res = await this.dataverseConnector.runOS({
      method: SYSTEM_CALL.loadFilesBy,
      params: { fileIds },
    });

    return res;
  }

  public async loadCollectedDataTokenFiles(collector: string) {
    const dataTokens: any[] = await loadDataTokensCollectedBy(collector);

    const fileIds = dataTokens.map(dataToken =>
      dataToken.source.replace("ceramic://", ""),
    );

    const res = await this.dataverseConnector.runOS({
      method: SYSTEM_CALL.loadFilesBy,
      params: { fileIds },
    });

    return res;
  }

  public async getTokenAsset() {
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
    const dataToken = DataToken__factory.connect(
      this.assetContract,
      this.signer,
    );
    const tokenAsset: TokenAsset = await dataToken.getTokenAsset(this.assetId);
    return tokenAsset;
  }

  public async publish({
    resourceId,
    fileId,
    actionsConfig,
    withSig,
  }: {
    resourceId: string;
    fileId: string;
    actionsConfig?: {
      collectAction?: {
        currency: string;
        amount: BigNumberish;
        totalSupply?: BigNumberish;
      };
      shareAction?: {
        shareName: string;
        shareSymbol: string;
        currency: string;
        ownerFeePoint: BigNumberish;
        initialSupply: BigNumberish;
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

    const data: string = abiCoder.encode(["string"], [fileId]);

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

    if (actionsConfig?.shareAction) {
      actions.push(DEPLOYED_ADDRESSES[this.chainId].ShareAction);

      const actionInitData = abiCoder.encode(
        ["string", "string", "address", "uint256", "uint256", "address"],
        [
          await this.signer.getAddress(),
          actionsConfig.shareAction.shareName,
          actionsConfig.shareAction.shareSymbol,
          actionsConfig.shareAction.currency,
          actionsConfig.shareAction.ownerFeePoint,
          actionsConfig.shareAction.initialSupply ?? 100,
          DEPLOYED_ADDRESSES[this.chainId].DefaultShareSetting,
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

    const assetId = await this._publish(publishParams, withSig);
    this.assetId = assetId.toString();
  }

  public async addActions({
    collectAction,
    shareAction,
    withSig,
  }: {
    collectAction?: {
      currency: string;
      amount: BigNumberish;
      totalSupply?: BigNumberish;
    };
    shareAction?: {
      shareName: string;
      shareSymbol: string;
      currency: string;
      ownerFeePoint: BigNumberish;
      initialSupply: BigNumberish;
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
    const tokenAsset = await this.getTokenAsset();

    const actions: string[] = [];
    const actionInitDatas: string[] = [];

    if (collectAction) {
      if (
        tokenAsset.actions.includes(
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

    if (shareAction) {
      if (
        tokenAsset.actions.includes(
          DEPLOYED_ADDRESSES[this.chainId].ShareAction,
        )
      ) {
        throw new Error("ShareAction already enabled.");
      }
      actions.push(DEPLOYED_ADDRESSES[this.chainId].ShareAction);

      const actionInitData = abiCoder.encode(
        ["string", "string", "address", "uint256", "uint256", "address"],
        [
          await this.signer.getAddress(),
          shareAction.shareName,
          shareAction.shareSymbol,
          shareAction.currency,
          shareAction.ownerFeePoint,
          shareAction.initialSupply ?? 100,
          DEPLOYED_ADDRESSES[this.chainId].DefaultShareSetting,
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

  public async collect() {
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

    const [actionReturnData] = await this._act(actParams);
    const [collectionId] = abiCoder.decode(
      ["uint256", "bytes"],
      actionReturnData,
    );

    return collectionId as BigNumber;
  }

  public async share({
    tradeType,
    amount,
    withSig,
  }: {
    tradeType: TradeType;
    amount: BigNumberish;
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

    let totalPrice: BigNumber;
    const shareAction = ShareAction__factory.connect(
      DEPLOYED_ADDRESSES[this.chainId].ShareAction,
      this.signer,
    );
    if (tradeType === TradeType.Buy) {
      totalPrice = await shareAction.getBuyPrice(this.assetId, amount);
    } else {
      totalPrice = await shareAction.getSellPrice(this.assetId, amount);
    }
    const { currency } = await shareAction.getAssetShareData(this.assetId);
    await this._checkERC20BalanceAndAllowance(
      currency,
      totalPrice,
      DEPLOYED_ADDRESSES[this.chainId].ShareAction,
    );

    const actionProcessData = abiCoder.encode(
      ["uint256", "uint256"],
      [tradeType, amount],
    );
    const actParams: ActParams = {
      assetId: this.assetId,
      actions: [DEPLOYED_ADDRESSES[this.chainId].DefaultShareSetting],
      actionProcessDatas: [actionProcessData],
    };

    const [actionReturnData] = await this._act(actParams, withSig);
    const [price] = abiCoder.decode(["uint256"], actionReturnData);
    return price as BigNumber;
  }
}
