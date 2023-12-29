import { BigNumberish, BytesLike } from "ethers";

export type Chain =
  // | "Polygon"
  | "PolygonMumbai"
  // | "BSC"
  | "BSCTestnet"
  // | "Scroll"
  | "ScrollSepolia";
// | "Filecoin"
// | "FilecoinCalibration";

export enum ChainId {
  // Polygon = 137,
  PolygonMumbai = 80001,
  // BSC = 56,
  BSCTestnet = 97,
  // Scroll = 534352
  ScrollSepolia = 534351,
  // Filecoin = 314
  // FilecoinCalibration = 314159
}

export enum GraphType {
  Lens,
  Cyber,
  Profileless,
}

export type CollectModule<T extends GraphType> = T extends GraphType.Lens
  ? "SimpleFeeCollectModule" | "None"
  : // | "MultipleRFeeCollectModule"
  T extends GraphType.Cyber
  ? "CollectPaidMw" | "None"
  : T extends GraphType.Profileless
  ?
      | "FreeCollectModule"
      | "LimitedFeeCollectModule"
      | "LimitedTimedFeeCollectModule"
  : never;

export type Currency<T extends ChainId = ChainId> =
  T extends ChainId.PolygonMumbai
    ? "WMATIC" | "WETH" | "DAI" | "USDC"
    : T extends ChainId.BSCTestnet
    ? "USDT" | "CCT" | "LINK" | "BNB"
    : T extends ChainId.ScrollSepolia
    ? "WETH" | "USDC" | "USDT"
    : never;

export type CreateDataTokenInput<T extends GraphType = GraphType> = {
  type: T;
  contentURI: string;
} & DataTokenParams[T];

export type DataTokenParams = {
  [GraphType.Lens]: {
    profileId: BigNumberish;
    collectModule: CollectModule<GraphType.Lens>;
    collectLimit: BigNumberish;
    amount?: BigNumberish;
    currency?: Currency;
    recipient?: string;
    endTimestamp?: BigNumberish;
  };
  [GraphType.Cyber]: {
    essenseMw: CollectModule<GraphType.Cyber>;
    profileId: BigNumberish;
    amount?: BigNumberish;
    currency?: Currency;
    totalSupply?: BigNumberish;
    recipient?: string;
  };
  [GraphType.Profileless]: {
    collectModule: CollectModule<GraphType.Profileless>;
    collectLimit: BigNumberish;
    amount?: BigNumberish;
    currency?: Currency;
    recipient?: string;
    endTimestamp?: BigNumberish;
  };
};

export interface CreateDataTokenOutput {
  creator: string;
  originalContract: string;
  dataToken: string;
}

export interface CollectDataTokenOutput {
  dataToken: string;
  collector: string;
  collectNFT: string;
  tokenId: BigNumberish;
}

export interface EIP712Signature {
  signer: string;
  v: number;
  r: string;
  s: string;
  deadline: string;
}

/**
 * ===================LENS===================
 */
export interface LensPostParams {
  profileId: BigNumberish;
  contentURI: string;
  actionModules: string[];
  actionModulesInitDatas: BytesLike[];
  referenceModule: string;
  referenceModuleInitData: BytesLike;
}

export interface LensActParams {
  publicationActedProfileId: BigNumberish;
  publicationActedId: BigNumberish;
  actorProfileId: BigNumberish;
  referrerProfileIds: BigNumberish[];
  referrerPubIds: BigNumberish[];
  actionModuleAddress: string;
  actionModuleData: BytesLike;
}

export interface LensBaseFeeCollectModuleInitData {
  amount: BigNumberish;
  collectLimit: BigNumberish;
  currency: string;
  referralFee: BigNumberish;
  followerOnly: boolean;
  endTimestamp: BigNumberish;
  recipient: string;
}

/**
 * ===================Cyber===================
 */
export interface CyberPostParams {
  profileId: BigNumberish;
  name: string;
  symbol: string;
  essenceTokenURI: string;
  essenceMw: string;
  transferable: boolean;
  deployAtRegister: boolean;
}

export interface CyberCollectParams {
  collector: string;
  profileId: BigNumberish;
  essenceId: BigNumberish;
}

/**
 * ===================Profileless===================
 */
export interface ProfilelessPostParams {
  contentURI: string;
  collectModule: string;
  collectModuleInitData: BytesLike;
}

export interface ProfilelessCollectParams {
  pubId: BigNumberish;
  collectModuleValidateData: BytesLike;
}

export {
  DataToken as DataTokenGraphType,
  DataToken_Collector,
} from "../../graphql/types";

export enum AssetType {
  dataToken,
  dataUnion,
}
