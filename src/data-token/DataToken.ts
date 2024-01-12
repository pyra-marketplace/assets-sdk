import { BigNumberish, Wallet, ethers } from "ethers";
import {
  DataverseConnector,
  DataAsset,
  Attached,
  SYSTEM_CALL,
} from "@dataverse/dataverse-connector";
import { DeployedContracts } from "../config";
import {
  isDataTokenCollectedBy,
  loadDataTokensCollectedBy,
  loadDataTokensCreatedBy,
  loadDataTokenCollectors,
  loadDataToken,
  loadDataTokens,
} from "../graphql";
import {
  DataToken_Collector,
  DataToken as DataTokenGraphType,
} from "../graphql/types";
import { abiCoder } from "../utils/abi-coder";
import { currentTimestamp } from "../utils";
import { DataAssetBase } from "../data-asset/DataAssetBase";
import { EMPTY_BYTES, ZERO_ADDRESS } from "./constants";
import {
  IDataToken,
  IDataToken__factory,
  IERC20__factory,
  LensHub__factory,
  SimpleFeeCollectModule__factory,
  LimitedFeeCollectModule__factory,
  LimitedTimedFeeCollectModule__factory,
  ProfileNFT__factory,
  CollectPublicationAction__factory,
  ProfilelessHub__factory,
} from "./contracts";
import { DataTypes } from "./contracts/IDataToken";
import {
  _buildLensCollectSig,
  _buildCyberCollectSig,
  getCollectPaidMwData,
  _buildProfilelessCollectSig,
} from "./helpers";
import {
  CollectDataTokenOutput,
  CyberCollectParams,
  GraphType,
  LensActParams,
  EIP712Signature,
  ChainId,
  ProfilelessCollectParams,
  CreateDataTokenInput,
  Chain,
} from "./types";
import { DataTokenFactory } from "./DataTokenFactory";

export class DataToken extends DataAssetBase {
  instance?: IDataToken;

  constructor({
    chainId,
    dataTokenAddress,
    fileId,
    dataverseConnector,
  }: {
    chainId: ChainId;
    dataTokenAddress: string;
    fileId: string;
    dataverseConnector: DataverseConnector;
  }) {
    super({
      chainId,
      assetContract: dataTokenAddress,
      fileOrFolderId: fileId,
      dataverseConnector,
    });
    if (dataTokenAddress) {
      this.instance = IDataToken__factory.connect(
        dataTokenAddress,
        this.signer,
      );
    }
  }

  async createDataToken(
    params: CreateDataTokenInput<GraphType.Profileless>,
  ): Promise<string> {
    this.assertCheckChain();

    let input = {} as CreateDataTokenInput;
    let dataTokenFactory = {} as DataTokenFactory;

    const {
      type,
      collectModule,
      collectLimit,
      amount,
      currency,
      recipient,
      endTimestamp,
    } = params;

    dataTokenFactory = new DataTokenFactory({
      chainId: this.chainId ?? ChainId.PolygonMumbai,
      signer: this.signer,
    });

    input = {
      type: type ?? GraphType.Profileless,
      contentURI: this.fileOrFolderId,
      collectModule: collectModule ?? "LimitedFeeCollectModule",
      collectLimit: collectLimit ?? 2 ** 52,
      ...(collectModule !== "FreeCollectModule" && {
        recipient: recipient ?? (await this.signer.getAddress()),
        currency,
        amount: ethers.utils.parseUnits(
          String(amount),
          currency === "USDC" ? 6 : 18,
        ),
      }),
      ...(collectModule === "LimitedTimedFeeCollectModule" && {
        endTimestamp,
      }),
    };

    const assetId = await this.createAssetHandler(() =>
      dataTokenFactory.createDataToken(input),
    );

    this.instance = IDataToken__factory.connect(assetId, this.signer);

    return assetId;
  }

  async applyConditionsToFile({
    unlockingTimeStamp,
    linkedAsset,
    attached,
  }: {
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
      this.assetId &&
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

  private assertCheckInstance() {
    if (!this.instance) {
      throw new Error("DataToken instance is not initialized");
    }
  }

  private assertCheckChain() {
    if (!this.chainId || !ChainId[this.chainId]) {
      throw new Error("Chain is not set");
    }
  }

  public async collectDataToken(): Promise<CollectDataTokenOutput> {
    this.assertCheckInstance();
    const collector = await this.signer!.getAddress();
    const collectData = await this._generateCollectData(collector);

    const output = {} as CollectDataTokenOutput;
    await this.instance!.collect(collectData).then(async (tx: any) => {
      const r = await tx.wait();
      r.events.forEach((e: any) => {
        if (e.event === "Collected") {
          output.dataToken = e.args.dataToken;
          output.collector = e.args.collector;
          output.collectNFT = e.args.collectNFT;
          output.tokenId = e.args.tokenId.toString();
        }
      });
    });
    return output;
  }

  public async loadCreatedDataTokenFiles(creator: string) {
    const dataTokens = await DataToken.loadDataTokensCreatedBy(creator);

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
    const dataTokens = await DataToken.loadDataTokensCollectedBy(collector);

    const fileIds = dataTokens.map(dataToken =>
      dataToken.source.replace("ceramic://", ""),
    );

    const res = await this.dataverseConnector.runOS({
      method: SYSTEM_CALL.loadFilesBy,
      params: { fileIds },
    });

    return res;
  }

  updateChain(chainId: ChainId) {
    this.chainId = chainId;
  }

  public async getType(): Promise<GraphType> {
    this.assertCheckInstance();
    const type = await this.instance!.graphType();
    return type as GraphType;
  }

  public getContentURI() {
    this.assertCheckInstance();
    return this.instance!.getContentURI();
  }

  public getCollectNFT() {
    this.assertCheckInstance();
    return this.instance!.getCollectNFT();
  }

  public isCollected(account: string): Promise<boolean> {
    this.assertCheckInstance();
    return this.instance!.isCollected(account);
  }

  public getMetadata(): Promise<DataTypes.MetadataStructOutput> {
    this.assertCheckInstance();
    return this.instance!.getMetadata();
  }

  public getDataTokenOwner(): Promise<string> {
    this.assertCheckInstance();
    return this.instance!.getDataTokenOwner();
  }

  static async loadDataTokensCreatedBy(
    dataTokenCreator: string,
  ): Promise<Array<DataTokenGraphType>> {
    return await loadDataTokensCreatedBy(dataTokenCreator);
  }

  static async loadDataTokensCollectedBy(
    collector: string,
  ): Promise<Array<DataTokenGraphType>> {
    return await loadDataTokensCollectedBy(collector);
  }
  static async isDataTokenCollectedBy({
    dataTokenId,
    collector,
  }: {
    dataTokenId: string;
    collector: string;
  }): Promise<boolean> {
    return isDataTokenCollectedBy(dataTokenId, collector);
  }

  static async loadDataTokenCollectors(
    dataTokenId: string,
  ): Promise<Array<DataToken_Collector>> {
    return await loadDataTokenCollectors(dataTokenId);
  }

  static async loadDataToken(dataTokenId: string): Promise<DataTokenGraphType> {
    return loadDataToken(dataTokenId);
  }

  static async loadDataTokens(
    dataTokenIds: Array<string>,
  ): Promise<Array<DataTokenGraphType>> {
    return loadDataTokens(dataTokenIds);
  }

  public async _generateCollectData(
    collector: string,
    actorProfileId?: BigNumberish,
  ) {
    const meta = await this.getMetadata();
    const type = await this.getType();
    let collectData: string;
    switch (type) {
      case GraphType.Profileless:
        collectData = await this._generateProfilelessCollectData(meta);
        break;

      case GraphType.Lens:
        collectData = await this._generateLensCollectData(
          meta,
          collector,
          actorProfileId!,
        );
        break;

      case GraphType.Cyber:
        collectData = await this._generateCyberCollectData(meta, collector);
        break;
    }
    return collectData;
  }

  private async _generateLensCollectData(
    meta: DataTypes.MetadataStructOutput,
    collector: string,
    actorProfileId: BigNumberish,
  ) {
    this.assertCheckChain();
    let actionModuleProcessData;
    let collectData = EMPTY_BYTES;
    this._checkGraphNetwork(GraphType.Lens);
    const { collectModule } = await CollectPublicationAction__factory.connect(
      meta.collectMiddleware,
      this.signer!,
    ).getCollectData(meta.profileId, meta.pubId);
    switch (collectModule) {
      case DeployedContracts[ChainId[this.chainId!]].Lens
        .SimpleFeeCollectModule: {
        const moduleInfo = await SimpleFeeCollectModule__factory.connect(
          collectModule,
          this.signer!,
        ).getPublicationData(meta.profileId, meta.pubId);
        if (moduleInfo.endTimestamp.lt(currentTimestamp())) {
          throw new Error(
            `Collect Expired at ${moduleInfo.endTimestamp.toString()}`,
          );
        }
        actionModuleProcessData = await this._generateLensValidateData(
          collectModule,
          moduleInfo,
          collector,
        );
        break;
      }

      default: {
        throw new Error("CollectModule not supported");
      }
    }

    const network = await this.signer!.provider?.getNetwork();
    if (!network) {
      throw new Error("Can not get network from provider");
    }

    const lensHub = LensHub__factory.connect(
      DeployedContracts[ChainId[this.chainId!]].Lens.LensHubProxy,
      this.signer!,
    );

    const nonce = (
      await lensHub.nonces(await this.signer!.getAddress())
    ).toNumber();

    const signature: EIP712Signature = await _buildLensCollectSig({
      chain: ChainId[this.chainId!] as Chain,
      wallet: this.signer! as Wallet,
      publicationActedProfileId: meta.profileId,
      publicationActedId: meta.pubId,
      actorProfileId,
      referrerProfileIds: [],
      referrerPubIds: [],
      actionModuleAddress: meta.collectMiddleware,
      actionModuleData: actionModuleProcessData,
      nonce,
    });

    const actParams: LensActParams = {
      publicationActedProfileId: meta.profileId,
      publicationActedId: meta.pubId,
      actorProfileId,
      referrerProfileIds: [],
      referrerPubIds: [],
      actionModuleAddress: meta.collectMiddleware,
      actionModuleData: actionModuleProcessData,
    };

    collectData = abiCoder.encode(
      [
        "tuple(uint256 publicationActedProfileId, uint256 publicationActedId, uint256 actorProfileId, uint256[] referrerProfileIds, uint256[] referrerPubIds, address actionModuleAddress, bytes actionModuleData)",
        "tuple(address signer, uint8 v,bytes32 r,bytes32 s,uint256 deadline)",
      ],
      [actParams, signature],
    );

    return collectData;
  }

  private async _generateProfilelessCollectData(
    meta: DataTypes.MetadataStructOutput,
  ) {
    this.assertCheckChain();
    let collectModuleValidateData;
    switch (meta.collectMiddleware) {
      case DeployedContracts[ChainId[this.chainId!]].Profileless
        .LimitedFeeCollectModule: {
        const collectModuleInst = LimitedFeeCollectModule__factory.connect(
          meta.collectMiddleware,
          this.signer!,
        );
        const moduleInfo = await collectModuleInst.getPublicationData(
          meta.pubId,
        );

        collectModuleValidateData = await this._generateProfilelessValidateData(
          meta.collectMiddleware,
          moduleInfo,
        );

        break;
      }

      case DeployedContracts[ChainId[this.chainId!]].Profileless
        .LimitedTimedFeeCollectModule: {
        const collectModuleInst = LimitedTimedFeeCollectModule__factory.connect(
          meta.collectMiddleware,
          this.signer!,
        );
        const moduleInfo = await collectModuleInst.getPublicationData(
          meta.pubId,
        );
        if (moduleInfo.endTimestamp < currentTimestamp()) {
          throw new Error(`Collect Expired at ${moduleInfo.endTimestamp}`);
        }
        collectModuleValidateData = await this._generateProfilelessValidateData(
          meta.collectMiddleware,
          moduleInfo,
        );
        break;
      }

      case DeployedContracts[ChainId[this.chainId!]].Profileless
        .FreeCollectModule: {
        collectModuleValidateData = EMPTY_BYTES;
        break;
      }
      default:
        throw new Error("Invalid Collect Module");
    }

    const profilelessHub = ProfilelessHub__factory.connect(
      DeployedContracts[ChainId[this.chainId!]].Profileless.ProfilelessHub,
      this.signer!,
    );

    const nonce = (
      await profilelessHub.getSigNonces(await this.signer!.getAddress())
    ).toNumber();

    const signature = await _buildProfilelessCollectSig({
      chain: ChainId[this.chainId!] as Chain,
      wallet: this.signer! as Wallet,
      pubId: meta.pubId,
      collectModuleValidateData,
      nonce,
    });

    const collectParams: ProfilelessCollectParams = {
      pubId: meta.pubId,
      collectModuleValidateData,
    };

    const collectData = abiCoder.encode(
      [
        "tuple(uint256 pubId,bytes collectModuleValidateData)",
        "tuple(address signer, uint8 v,bytes32 r,bytes32 s,uint256 deadline)",
      ],
      [collectParams, signature],
    );
    return collectData;
  }

  private async _generateCyberCollectData(
    meta: DataTypes.MetadataStructOutput,
    collector: string,
  ) {
    this.assertCheckChain();
    const collectParams = {
      collector: collector,
      profileId: meta.profileId,
      essenceId: meta.pubId,
    } as CyberCollectParams;

    const cyberProfile = ProfileNFT__factory.connect(
      DeployedContracts[ChainId[this.chainId!]].Cyber.CyberProfileProxy,
      this.signer!,
    );

    switch (meta.collectMiddleware.toLowerCase()) {
      case DeployedContracts[
        ChainId[this.chainId!]
      ].Cyber.CollectPaidMw.toLowerCase(): {
        const { currency, amount } = await getCollectPaidMwData({
          chainId: this.chainId!,
          profileId: meta.profileId,
          essenceId: meta.pubId,
        });

        await this._checkERC20BalanceAndAllowance(
          currency,
          amount,
          meta.collectMiddleware,
        );
        break;
      }
      default:
        throw new Error("CollectModule not supported");
    }

    const collectPreData = EMPTY_BYTES;
    const collectPostData = EMPTY_BYTES;
    const nonce = await cyberProfile.nonces(collector);

    const signature: Omit<EIP712Signature, "signer"> =
      await _buildCyberCollectSig({
        chain: ChainId[this.chainId!] as Chain,
        wallet: this.signer! as Wallet,
        profileId: collectParams.profileId,
        collector: collectParams.collector,
        essenceId: collectParams.essenceId,
        preData: collectPreData,
        postData: collectPostData,
        nonce,
      });

    return abiCoder.encode(
      [
        "tuple(address collector,uint256 profileId,uint256 essenceId) params",
        "bytes preData",
        "bytes postData",
        "address sender",
        "tuple(uint8 v,bytes32 r,bytes32 s,uint256 deadline) sig",
      ],
      [collectParams, collectPreData, collectPostData, collector, signature],
    );
  }

  private async _generateLensValidateData(
    collectModule: string,
    moduleInfo: any,
    collector: string,
  ) {
    if (moduleInfo.currency !== ZERO_ADDRESS) {
      await this._checkERC20BalanceAndAllowance(
        moduleInfo.currency,
        moduleInfo.amount,
        collectModule,
      );
    }

    const collectModuleValidateData = abiCoder.encode(
      ["address", "uint256"],
      [moduleInfo.currency, moduleInfo.amount],
    );

    return abiCoder.encode(
      ["address", "bytes"],
      [collector, collectModuleValidateData],
    );
  }

  private async _generateProfilelessValidateData(
    collectModule: string,
    moduleInfo: any,
  ) {
    await this._checkERC20BalanceAndAllowance(
      moduleInfo.currency,
      moduleInfo.amount,
      collectModule,
    );

    return abiCoder.encode(
      ["address", "uint256"],
      [moduleInfo.currency, moduleInfo.amount],
    );
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

  private _checkGraphNetwork(graphType: GraphType) {
    if (graphType === GraphType.Lens) {
      if (ChainId[this.chainId!] !== "PolygonMumbai") {
        throw new Error(`Lens graph not support ${ChainId[this.chainId!]}`);
      }
    } else if (graphType == GraphType.Cyber) {
      if (ChainId[this.chainId!] !== "BSCTestnet") {
        throw new Error(`Cyber graph not support ${ChainId[this.chainId!]}`);
      }
    } else {
      return;
    }
  }
}
