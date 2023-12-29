import { Signer, Wallet } from "ethers";

import { Provider } from "@ethersproject/providers";
import { DeployedContracts } from "../config";
import { abiCoder } from "../utils/abi-coder";
import { getChainByChainId } from "../utils";
import {
  EMPTY_BYTES,
  ESSEBCE_NFT_SYMBOL,
  ESSENCE_NFT_NAME,
  MAX_UINT72,
  ZERO_ADDRESS,
} from "./constants";
import {
  LensHub__factory,
  ProfileNFT__factory,
  ProfilelessHub__factory,
  IDataTokenFactory,
  IDataTokenFactory__factory,
} from "./contracts";
import {
  _buildProfilelessPostSig,
  _buildCyberPostSig,
  _buildLensPostSig,
} from "./helpers";
import {
  CreateDataTokenInput,
  CreateDataTokenOutput,
  GraphType,
  Chain,
  EIP712Signature,
  ChainId,
  LensBaseFeeCollectModuleInitData,
  LensPostParams,
  ProfilelessPostParams,
  CyberPostParams,
} from "./types";

export class DataTokenFactory {
  chainId: ChainId;
  chain: Chain;
  signer?: Signer;
  instance: IDataTokenFactory;

  constructor({
    chainId,
    signer,
    provider,
  }: {
    chainId: ChainId;
    signer?: Signer;
    provider?: Provider;
  }) {
    this.chainId = chainId;
    this.chain = getChainByChainId(chainId);
    if (signer) {
      this.signer = signer;
      this.instance = IDataTokenFactory__factory.connect(ZERO_ADDRESS, signer);
    } else if (provider) {
      this.instance = IDataTokenFactory__factory.connect(
        ZERO_ADDRESS,
        provider,
      );
    } else {
      throw new Error("No avaliable signer and provider");
    }
  }

  public getAddress(graphType: GraphType): string {
    switch (graphType) {
      case GraphType.Lens:
        return DeployedContracts[this.chain].Lens.DataTokenFactory;
      case GraphType.Cyber:
        return DeployedContracts[this.chain].Cyber.DataTokenFactory;
      case GraphType.Profileless:
        return DeployedContracts[this.chain].Profileless.DataTokenFactory;
    }
  }

  public async createDataToken(
    input: CreateDataTokenInput,
  ): Promise<CreateDataTokenOutput> {
    if (input.type === GraphType.Cyber) {
      this._checkGraphNetwork(GraphType.Cyber);
      this.instance = this.instance.attach(
        DeployedContracts[this.chain].Cyber.DataTokenFactory,
      );
    } else if (input.type === GraphType.Lens) {
      this._checkGraphNetwork(GraphType.Lens);
      this.instance = this.instance.attach(
        DeployedContracts[this.chain].Lens.DataTokenFactory,
      );
    } else {
      this._checkGraphNetwork(GraphType.Profileless);
      this.instance = this.instance.attach(
        DeployedContracts[this.chain].Profileless.DataTokenFactory,
      );
    }

    const initData = await this._generateDataTokenInitData(input);

    const output = {} as CreateDataTokenOutput;
    await this.instance.createDataToken(initData).then(async (tx: any) => {
      const r = await tx.wait();
      r.events.forEach((e: any) => {
        if (e.event === "DataTokenCreated") {
          output.creator = e.args[0];
          output.originalContract = e.args[1];
          output.dataToken = e.args[2];
        }
      });
    });
    return output;
  }

  public async _generateDataTokenInitData(
    input: CreateDataTokenInput,
  ): Promise<string> {
    if (input.type === GraphType.Lens) {
      this._checkGraphNetwork(GraphType.Lens);
      const inputLens = input as CreateDataTokenInput<GraphType.Lens>;

      const actionModuleInitData = this._generateLensModuleInitData(inputLens);

      const lensHub = LensHub__factory.connect(
        DeployedContracts[this.chain].Lens.LensHubProxy,
        this.signer!,
      );

      const nonce = (
        await lensHub.nonces(await this.signer!.getAddress())
      ).toNumber();

      const signature: EIP712Signature = await _buildLensPostSig({
        chain: this.chain,
        wallet: this.signer! as Wallet,
        profileId: inputLens.profileId,
        contentURI: inputLens.contentURI,
        actionModules: [
          DeployedContracts[this.chain].Lens.CollectPublicationAction,
        ],
        actionModulesInitDatas: [actionModuleInitData],
        referenceModule: ZERO_ADDRESS,
        referenceModuleInitData: EMPTY_BYTES,
        nonce,
      });

      const postParams = {
        profileId: inputLens.profileId,
        contentURI: inputLens.contentURI,
        actionModules: [
          DeployedContracts[this.chain].Lens.CollectPublicationAction,
        ],
        actionModulesInitDatas: [actionModuleInitData],
        referenceModule: ZERO_ADDRESS,
        referenceModuleInitData: EMPTY_BYTES,
      } as LensPostParams;

      return abiCoder.encode(
        [
          "tuple(uint256 profileId,string contentURI,address[] actionModules,bytes[] actionModulesInitDatas,address referenceModule,bytes referenceModuleInitData) postParams",
          "tuple(address signer, uint8 v,bytes32 r,bytes32 s,uint256 deadline) signature",
        ],
        [postParams, signature],
      );
    } else if (input.type === GraphType.Cyber) {
      this._checkGraphNetwork(GraphType.Cyber);
      const inputCyber = input as CreateDataTokenInput<GraphType.Cyber>;
      const transferable = true;
      const deployAtRegister = false;

      const collectModuleAddress =
        inputCyber.essenseMw === "None"
          ? ZERO_ADDRESS
          : DeployedContracts[this.chain].Cyber[inputCyber.essenseMw];

      const collectModuleInitData =
        await this._generateCyberModuleInitData(inputCyber);
      const walletAddr = await this.signer!.getAddress();

      const cyberProfile = ProfileNFT__factory.connect(
        DeployedContracts[this.chain].Cyber.CyberProfileProxy,
        this.signer!,
      );

      const nonce = await cyberProfile.nonces(walletAddr);

      const signature = await _buildCyberPostSig({
        chain: this.chain,
        wallet: this.signer! as Wallet,
        profileId: inputCyber.profileId,
        name: ESSENCE_NFT_NAME,
        symbol: ESSEBCE_NFT_SYMBOL,
        essenceTokenURI: inputCyber.contentURI,
        essenceMw: collectModuleAddress,
        transferable,
        initData: collectModuleInitData,
        nonce,
      });

      const postParams = {
        profileId: inputCyber.profileId,
        name: ESSENCE_NFT_NAME,
        symbol: ESSEBCE_NFT_SYMBOL,
        essenceTokenURI: inputCyber.contentURI!,
        essenceMw: collectModuleAddress,
        transferable,
        deployAtRegister,
      } as CyberPostParams;

      return abiCoder.encode(
        [
          "tuple(uint256 profileId,string name,string symbol,string essenceTokenURI,address essenceMw,bool transferable,bool deployAtRegister) input",
          "bytes",
          "tuple(uint8 v,bytes32 r,bytes32 s,uint256 deadline) sig",
        ],
        [postParams, collectModuleInitData, signature],
      );
    } else {
      this._checkGraphNetwork(GraphType.Profileless);
      const inputProfileless =
        input as CreateDataTokenInput<GraphType.Profileless>;

      const collectModuleAddress =
        DeployedContracts[this.chain].Profileless[
          inputProfileless.collectModule
        ];

      const collectModuleInitData =
        this._generateProfilelessModuleInitData(inputProfileless);

      const postParams = {
        contentURI: inputProfileless.contentURI,
        collectModule: collectModuleAddress,
        collectModuleInitData,
      } as ProfilelessPostParams;

      const profilelessHub = ProfilelessHub__factory.connect(
        DeployedContracts[this.chain].Profileless.ProfilelessHub,
        this.signer!,
      );

      const nonce = (
        await profilelessHub.getSigNonces(await this.signer!.getAddress())
      ).toNumber();

      const signature: EIP712Signature = await _buildProfilelessPostSig({
        chain: this.chain,
        wallet: this.signer! as Wallet,
        contentURI: input.contentURI,
        collectModule: collectModuleAddress,
        collectModuleInitData,
        nonce,
      });

      const data = abiCoder.encode(
        [
          "tuple(string contentURI,address collectModule,bytes collectModuleInitData)",
          "tuple(address signer, uint8 v,bytes32 r,bytes32 s,uint256 deadline)",
        ],
        [postParams, signature],
      );

      return data;
    }
  }

  private _generateLensModuleInitData(
    input: CreateDataTokenInput<GraphType.Lens>,
  ): string {
    this._checkGraphNetwork(GraphType.Lens);
    if (input.type !== GraphType.Lens) {
      throw new Error("GraphType Not Supported");
    }

    const referralFee = 0;
    const followerOnly = false;
    const endTimestamp = input.endTimestamp ?? MAX_UINT72;

    switch (input.collectModule) {
      case "SimpleFeeCollectModule": {
        const collectModuleInitParams: LensBaseFeeCollectModuleInitData = {
          amount: input.amount!,
          collectLimit: input.collectLimit,
          currency: DeployedContracts[this.chain][input.currency!],
          referralFee,
          followerOnly,
          endTimestamp,
          recipient: input.recipient!,
        };
        const collectModuleInitData = abiCoder.encode(
          [
            "tuple(uint160 amount, uint96 collectLimit, address currency, uint16 referralFee, bool followerOnly, uint72 endTimestamp, address recipient) data",
          ],
          [collectModuleInitParams],
        );

        const actionModuleInitData = abiCoder.encode(
          ["address collectModule", "bytes collectModuleInitData"],
          [
            DeployedContracts[this.chain].Lens.SimpleFeeCollectModule,
            collectModuleInitData,
          ],
        );
        return actionModuleInitData;
      }

      case "None": {
        const amount = 0;
        const currency = ZERO_ADDRESS;
        const recipient = ZERO_ADDRESS;
        const collectModuleInitParams: LensBaseFeeCollectModuleInitData = {
          amount,
          collectLimit: input.collectLimit,
          currency,
          referralFee,
          followerOnly,
          endTimestamp,
          recipient,
        };
        const collectModuleInitData = abiCoder.encode(
          [
            "tuple(uint160 amount, uint96 collectLimit, address currency, uint16 referralFee, bool followerOnly, uint72 endTimestamp, address recipient) data",
          ],
          [collectModuleInitParams],
        );

        const actionModuleInitData = abiCoder.encode(
          ["address collectModule", "bytes collectModuleInitData"],
          [
            DeployedContracts[this.chain].Lens.SimpleFeeCollectModule,
            collectModuleInitData,
          ],
        );
        return actionModuleInitData;
      }

      default:
        throw new Error("NotSupported");
    }
  }

  private async _generateCyberModuleInitData(
    input: CreateDataTokenInput<GraphType.Cyber>,
  ): Promise<string> {
    this._checkGraphNetwork(GraphType.Cyber);
    if (input.type !== GraphType.Cyber) {
      throw new Error("GraphType Not Supported");
    }
    switch (input.essenseMw) {
      case "CollectPaidMw": {
        const subscribeRequired = false;
        return abiCoder.encode(
          ["uint256", "uint256", "address", "address", "bool"],
          [
            input.totalSupply!,
            input.amount!,
            input.recipient!,
            DeployedContracts[this.chain][input.currency!],
            subscribeRequired,
          ],
        );
      }

      case "None": {
        return EMPTY_BYTES;
      }

      default:
        throw new Error("Middleware Not Supported");
    }
  }

  private _generateProfilelessModuleInitData(
    input: CreateDataTokenInput<GraphType.Profileless>,
  ) {
    this._checkGraphNetwork(GraphType.Profileless);
    if (input.type !== GraphType.Profileless) {
      throw new Error("GraphType Not Supported");
    }
    switch (input.collectModule) {
      case "FreeCollectModule":
        return abiCoder.encode(["uint256"], [input.collectLimit]);

      case "LimitedFeeCollectModule":
        return abiCoder.encode(
          ["uint256", "uint256", "address", "address"],
          [
            input.collectLimit,
            input.amount!,
            DeployedContracts[this.chain][input.currency!],
            input.recipient!,
          ],
        );

      case "LimitedTimedFeeCollectModule":
        return abiCoder.encode(
          ["uint256", "uint256", "address", "address", "uint40"],
          [
            input.collectLimit,
            input.amount!,
            DeployedContracts[this.chain][input.currency!],
            input.recipient!,
            input.endTimestamp!,
          ],
        );

      default:
        throw new Error("CollectModule Not Supported");
    }
  }

  private _checkGraphNetwork(graphType: GraphType) {
    if (graphType === GraphType.Lens) {
      if (this.chain !== "PolygonMumbai") {
        throw new Error(`Lens graph not support ${this.chain}`);
      }
    } else if (graphType == GraphType.Cyber) {
      if (this.chain !== "BSCTestnet") {
        throw new Error(`Cyber graph not support ${this.chain}`);
      }
    } else {
      return;
    }
  }
}
