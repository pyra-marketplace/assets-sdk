/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export declare namespace IDataMonetizer {
  export type ActParamsStruct = {
    assetId: BytesLike;
    actions: string[];
    actionProcessDatas: BytesLike[];
  };

  export type ActParamsStructOutput = [string, string[], string[]] & {
    assetId: string;
    actions: string[];
    actionProcessDatas: string[];
  };

  export type EIP712SignatureStruct = {
    signer: string;
    v: BigNumberish;
    r: BytesLike;
    s: BytesLike;
    deadline: BigNumberish;
  };

  export type EIP712SignatureStructOutput = [
    string,
    number,
    string,
    string,
    BigNumber
  ] & { signer: string; v: number; r: string; s: string; deadline: BigNumber };

  export type AddActionsParamsStruct = {
    assetId: BytesLike;
    actions: string[];
    actionInitDatas: BytesLike[];
  };

  export type AddActionsParamsStructOutput = [string, string[], string[]] & {
    assetId: string;
    actions: string[];
    actionInitDatas: string[];
  };

  export type AddImagesParamsStruct = {
    assetId: BytesLike;
    images: BytesLike[];
  };

  export type AddImagesParamsStructOutput = [string, string[]] & {
    assetId: string;
    images: string[];
  };

  export type AssetStruct = {
    resourceId: string;
    data: BytesLike;
    publishAt: BigNumberish;
    publicationId: BigNumberish;
    actions: string[];
    images: BytesLike[];
  };

  export type AssetStructOutput = [
    string,
    string,
    BigNumber,
    BigNumber,
    string[],
    string[]
  ] & {
    resourceId: string;
    data: string;
    publishAt: BigNumber;
    publicationId: BigNumber;
    actions: string[];
    images: string[];
  };

  export type PublishParamsStruct = {
    resourceId: string;
    data: BytesLike;
    actions: string[];
    actionInitDatas: BytesLike[];
    images: BytesLike[];
  };

  export type PublishParamsStructOutput = [
    string,
    string,
    string[],
    string[],
    string[]
  ] & {
    resourceId: string;
    data: string;
    actions: string[];
    actionInitDatas: string[];
    images: string[];
  };
}

export declare namespace IDataToken {
  export type TokenAssetStruct = {
    resourceId: string;
    fileId: string;
    publishAt: BigNumberish;
    publicationId: BigNumberish;
    actions: string[];
    images: BytesLike[];
  };

  export type TokenAssetStructOutput = [
    string,
    string,
    BigNumber,
    BigNumber,
    string[],
    string[]
  ] & {
    resourceId: string;
    fileId: string;
    publishAt: BigNumber;
    publicationId: BigNumber;
    actions: string[];
    images: string[];
  };
}

export interface DataTokenInterface extends utils.Interface {
  functions: {
    "DAPP_TABLE_REGISTRY()": FunctionFragment;
    "act((bytes32,address[],bytes[]))": FunctionFragment;
    "actWithSig((bytes32,address[],bytes[]),(address,uint8,bytes32,bytes32,uint256))": FunctionFragment;
    "addActions((bytes32,address[],bytes[]))": FunctionFragment;
    "addActionsWithSig((bytes32,address[],bytes[]),(address,uint8,bytes32,bytes32,uint256))": FunctionFragment;
    "addImages((bytes32,bytes32[]))": FunctionFragment;
    "addImagesWithSig((bytes32,bytes32[]),(address,uint8,bytes32,bytes32,uint256))": FunctionFragment;
    "approve(address,uint256)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "eip712Domain()": FunctionFragment;
    "getApproved(uint256)": FunctionFragment;
    "getAsset(bytes32)": FunctionFragment;
    "getAssetOwner(bytes32)": FunctionFragment;
    "getDomainSeparator()": FunctionFragment;
    "getSigNonce(address)": FunctionFragment;
    "getTokenAsset(bytes32)": FunctionFragment;
    "isApprovedForAll(address,address)": FunctionFragment;
    "name()": FunctionFragment;
    "ownerOf(uint256)": FunctionFragment;
    "publish((string,bytes,address[],bytes[],bytes32[]))": FunctionFragment;
    "publishWithSig((string,bytes,address[],bytes[],bytes32[]),(address,uint8,bytes32,bytes32,uint256))": FunctionFragment;
    "safeTransferFrom(address,address,uint256)": FunctionFragment;
    "safeTransferFrom(address,address,uint256,bytes)": FunctionFragment;
    "setApprovalForAll(address,bool)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "symbol()": FunctionFragment;
    "tokenByIndex(uint256)": FunctionFragment;
    "tokenOfOwnerByIndex(address,uint256)": FunctionFragment;
    "tokenURI(uint256)": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "transferFrom(address,address,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "DAPP_TABLE_REGISTRY"
      | "act"
      | "actWithSig"
      | "addActions"
      | "addActionsWithSig"
      | "addImages"
      | "addImagesWithSig"
      | "approve"
      | "balanceOf"
      | "eip712Domain"
      | "getApproved"
      | "getAsset"
      | "getAssetOwner"
      | "getDomainSeparator"
      | "getSigNonce"
      | "getTokenAsset"
      | "isApprovedForAll"
      | "name"
      | "ownerOf"
      | "publish"
      | "publishWithSig"
      | "safeTransferFrom(address,address,uint256)"
      | "safeTransferFrom(address,address,uint256,bytes)"
      | "setApprovalForAll"
      | "supportsInterface"
      | "symbol"
      | "tokenByIndex"
      | "tokenOfOwnerByIndex"
      | "tokenURI"
      | "totalSupply"
      | "transferFrom"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "DAPP_TABLE_REGISTRY",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "act",
    values: [IDataMonetizer.ActParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "actWithSig",
    values: [
      IDataMonetizer.ActParamsStruct,
      IDataMonetizer.EIP712SignatureStruct
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "addActions",
    values: [IDataMonetizer.AddActionsParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "addActionsWithSig",
    values: [
      IDataMonetizer.AddActionsParamsStruct,
      IDataMonetizer.EIP712SignatureStruct
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "addImages",
    values: [IDataMonetizer.AddImagesParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "addImagesWithSig",
    values: [
      IDataMonetizer.AddImagesParamsStruct,
      IDataMonetizer.EIP712SignatureStruct
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(
    functionFragment: "eip712Domain",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getApproved",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "getAsset", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "getAssetOwner",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getDomainSeparator",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "getSigNonce", values: [string]): string;
  encodeFunctionData(
    functionFragment: "getTokenAsset",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isApprovedForAll",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "ownerOf",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "publish",
    values: [IDataMonetizer.PublishParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "publishWithSig",
    values: [
      IDataMonetizer.PublishParamsStruct,
      IDataMonetizer.EIP712SignatureStruct
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom(address,address,uint256)",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom(address,address,uint256,bytes)",
    values: [string, string, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setApprovalForAll",
    values: [string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "tokenByIndex",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenOfOwnerByIndex",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenURI",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [string, string, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "DAPP_TABLE_REGISTRY",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "act", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "actWithSig", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "addActions", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "addActionsWithSig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "addImages", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "addImagesWithSig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "eip712Domain",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getApproved",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getAsset", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getAssetOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getDomainSeparator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSigNonce",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTokenAsset",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isApprovedForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "publish", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "publishWithSig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom(address,address,uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom(address,address,uint256,bytes)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setApprovalForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tokenByIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokenOfOwnerByIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "tokenURI", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;

  events: {
    "Approval(address,address,uint256)": EventFragment;
    "ApprovalForAll(address,address,bool)": EventFragment;
    "AssetActed(bytes32,address,address[],bytes[],bytes[])": EventFragment;
    "AssetPublished(bytes32,address,uint256,string,bytes,address[],bytes[],bytes32[])": EventFragment;
    "EIP712DomainChanged()": EventFragment;
    "Transfer(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ApprovalForAll"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AssetActed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AssetPublished"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "EIP712DomainChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
}

export interface ApprovalEventObject {
  owner: string;
  approved: string;
  tokenId: BigNumber;
}
export type ApprovalEvent = TypedEvent<
  [string, string, BigNumber],
  ApprovalEventObject
>;

export type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>;

export interface ApprovalForAllEventObject {
  owner: string;
  operator: string;
  approved: boolean;
}
export type ApprovalForAllEvent = TypedEvent<
  [string, string, boolean],
  ApprovalForAllEventObject
>;

export type ApprovalForAllEventFilter = TypedEventFilter<ApprovalForAllEvent>;

export interface AssetActedEventObject {
  assetId: string;
  actor: string;
  actions: string[];
  actionProcessDatas: string[];
  actionReturnDatas: string[];
}
export type AssetActedEvent = TypedEvent<
  [string, string, string[], string[], string[]],
  AssetActedEventObject
>;

export type AssetActedEventFilter = TypedEventFilter<AssetActedEvent>;

export interface AssetPublishedEventObject {
  assetId: string;
  publisher: string;
  publicationId: BigNumber;
  resourceId: string;
  data: string;
  actions: string[];
  actionInitDatas: string[];
  images: string[];
}
export type AssetPublishedEvent = TypedEvent<
  [string, string, BigNumber, string, string, string[], string[], string[]],
  AssetPublishedEventObject
>;

export type AssetPublishedEventFilter = TypedEventFilter<AssetPublishedEvent>;

export interface EIP712DomainChangedEventObject {}
export type EIP712DomainChangedEvent = TypedEvent<
  [],
  EIP712DomainChangedEventObject
>;

export type EIP712DomainChangedEventFilter =
  TypedEventFilter<EIP712DomainChangedEvent>;

export interface TransferEventObject {
  from: string;
  to: string;
  tokenId: BigNumber;
}
export type TransferEvent = TypedEvent<
  [string, string, BigNumber],
  TransferEventObject
>;

export type TransferEventFilter = TypedEventFilter<TransferEvent>;

export interface DataToken extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: DataTokenInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    DAPP_TABLE_REGISTRY(overrides?: CallOverrides): Promise<[string]>;

    act(
      actParams: IDataMonetizer.ActParamsStruct,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    actWithSig(
      actParams: IDataMonetizer.ActParamsStruct,
      signature: IDataMonetizer.EIP712SignatureStruct,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    addActions(
      addActionsParams: IDataMonetizer.AddActionsParamsStruct,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    addActionsWithSig(
      addActionsParams: IDataMonetizer.AddActionsParamsStruct,
      signature: IDataMonetizer.EIP712SignatureStruct,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    addImages(
      addImagesParams: IDataMonetizer.AddImagesParamsStruct,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    addImagesWithSig(
      addImagesParams: IDataMonetizer.AddImagesParamsStruct,
      signature: IDataMonetizer.EIP712SignatureStruct,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    eip712Domain(
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, BigNumber, string, string, BigNumber[]] & {
        fields: string;
        name: string;
        version: string;
        chainId: BigNumber;
        verifyingContract: string;
        salt: string;
        extensions: BigNumber[];
      }
    >;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getAsset(
      assetId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[IDataMonetizer.AssetStructOutput]>;

    getAssetOwner(
      assetId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getDomainSeparator(overrides?: CallOverrides): Promise<[string]>;

    getSigNonce(
      signer: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getTokenAsset(
      assetId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[IDataToken.TokenAssetStructOutput]>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    name(overrides?: CallOverrides): Promise<[string]>;

    ownerOf(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    publish(
      publishParams: IDataMonetizer.PublishParamsStruct,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    publishWithSig(
      publishParams: IDataMonetizer.PublishParamsStruct,
      signature: IDataMonetizer.EIP712SignatureStruct,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    symbol(overrides?: CallOverrides): Promise<[string]>;

    tokenByIndex(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    tokenOfOwnerByIndex(
      owner: string,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    tokenURI(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;
  };

  DAPP_TABLE_REGISTRY(overrides?: CallOverrides): Promise<string>;

  act(
    actParams: IDataMonetizer.ActParamsStruct,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  actWithSig(
    actParams: IDataMonetizer.ActParamsStruct,
    signature: IDataMonetizer.EIP712SignatureStruct,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  addActions(
    addActionsParams: IDataMonetizer.AddActionsParamsStruct,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  addActionsWithSig(
    addActionsParams: IDataMonetizer.AddActionsParamsStruct,
    signature: IDataMonetizer.EIP712SignatureStruct,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  addImages(
    addImagesParams: IDataMonetizer.AddImagesParamsStruct,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  addImagesWithSig(
    addImagesParams: IDataMonetizer.AddImagesParamsStruct,
    signature: IDataMonetizer.EIP712SignatureStruct,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  approve(
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

  eip712Domain(
    overrides?: CallOverrides
  ): Promise<
    [string, string, string, BigNumber, string, string, BigNumber[]] & {
      fields: string;
      name: string;
      version: string;
      chainId: BigNumber;
      verifyingContract: string;
      salt: string;
      extensions: BigNumber[];
    }
  >;

  getApproved(
    tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  getAsset(
    assetId: BytesLike,
    overrides?: CallOverrides
  ): Promise<IDataMonetizer.AssetStructOutput>;

  getAssetOwner(assetId: BytesLike, overrides?: CallOverrides): Promise<string>;

  getDomainSeparator(overrides?: CallOverrides): Promise<string>;

  getSigNonce(signer: string, overrides?: CallOverrides): Promise<BigNumber>;

  getTokenAsset(
    assetId: BytesLike,
    overrides?: CallOverrides
  ): Promise<IDataToken.TokenAssetStructOutput>;

  isApprovedForAll(
    owner: string,
    operator: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  name(overrides?: CallOverrides): Promise<string>;

  ownerOf(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

  publish(
    publishParams: IDataMonetizer.PublishParamsStruct,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  publishWithSig(
    publishParams: IDataMonetizer.PublishParamsStruct,
    signature: IDataMonetizer.EIP712SignatureStruct,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  "safeTransferFrom(address,address,uint256)"(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  "safeTransferFrom(address,address,uint256,bytes)"(
    from: string,
    to: string,
    tokenId: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  setApprovalForAll(
    operator: string,
    approved: boolean,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  symbol(overrides?: CallOverrides): Promise<string>;

  tokenByIndex(
    index: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  tokenOfOwnerByIndex(
    owner: string,
    index: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  tokenURI(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  transferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  callStatic: {
    DAPP_TABLE_REGISTRY(overrides?: CallOverrides): Promise<string>;

    act(
      actParams: IDataMonetizer.ActParamsStruct,
      overrides?: CallOverrides
    ): Promise<string[]>;

    actWithSig(
      actParams: IDataMonetizer.ActParamsStruct,
      signature: IDataMonetizer.EIP712SignatureStruct,
      overrides?: CallOverrides
    ): Promise<string[]>;

    addActions(
      addActionsParams: IDataMonetizer.AddActionsParamsStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    addActionsWithSig(
      addActionsParams: IDataMonetizer.AddActionsParamsStruct,
      signature: IDataMonetizer.EIP712SignatureStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    addImages(
      addImagesParams: IDataMonetizer.AddImagesParamsStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    addImagesWithSig(
      addImagesParams: IDataMonetizer.AddImagesParamsStruct,
      signature: IDataMonetizer.EIP712SignatureStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    eip712Domain(
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, BigNumber, string, string, BigNumber[]] & {
        fields: string;
        name: string;
        version: string;
        chainId: BigNumber;
        verifyingContract: string;
        salt: string;
        extensions: BigNumber[];
      }
    >;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    getAsset(
      assetId: BytesLike,
      overrides?: CallOverrides
    ): Promise<IDataMonetizer.AssetStructOutput>;

    getAssetOwner(
      assetId: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    getDomainSeparator(overrides?: CallOverrides): Promise<string>;

    getSigNonce(signer: string, overrides?: CallOverrides): Promise<BigNumber>;

    getTokenAsset(
      assetId: BytesLike,
      overrides?: CallOverrides
    ): Promise<IDataToken.TokenAssetStructOutput>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    name(overrides?: CallOverrides): Promise<string>;

    ownerOf(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

    publish(
      publishParams: IDataMonetizer.PublishParamsStruct,
      overrides?: CallOverrides
    ): Promise<string>;

    publishWithSig(
      publishParams: IDataMonetizer.PublishParamsStruct,
      signature: IDataMonetizer.EIP712SignatureStruct,
      overrides?: CallOverrides
    ): Promise<string>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    symbol(overrides?: CallOverrides): Promise<string>;

    tokenByIndex(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenOfOwnerByIndex(
      owner: string,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenURI(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "Approval(address,address,uint256)"(
      owner?: string | null,
      approved?: string | null,
      tokenId?: BigNumberish | null
    ): ApprovalEventFilter;
    Approval(
      owner?: string | null,
      approved?: string | null,
      tokenId?: BigNumberish | null
    ): ApprovalEventFilter;

    "ApprovalForAll(address,address,bool)"(
      owner?: string | null,
      operator?: string | null,
      approved?: null
    ): ApprovalForAllEventFilter;
    ApprovalForAll(
      owner?: string | null,
      operator?: string | null,
      approved?: null
    ): ApprovalForAllEventFilter;

    "AssetActed(bytes32,address,address[],bytes[],bytes[])"(
      assetId?: BytesLike | null,
      actor?: string | null,
      actions?: null,
      actionProcessDatas?: null,
      actionReturnDatas?: null
    ): AssetActedEventFilter;
    AssetActed(
      assetId?: BytesLike | null,
      actor?: string | null,
      actions?: null,
      actionProcessDatas?: null,
      actionReturnDatas?: null
    ): AssetActedEventFilter;

    "AssetPublished(bytes32,address,uint256,string,bytes,address[],bytes[],bytes32[])"(
      assetId?: BytesLike | null,
      publisher?: string | null,
      publicationId?: BigNumberish | null,
      resourceId?: null,
      data?: null,
      actions?: null,
      actionInitDatas?: null,
      images?: null
    ): AssetPublishedEventFilter;
    AssetPublished(
      assetId?: BytesLike | null,
      publisher?: string | null,
      publicationId?: BigNumberish | null,
      resourceId?: null,
      data?: null,
      actions?: null,
      actionInitDatas?: null,
      images?: null
    ): AssetPublishedEventFilter;

    "EIP712DomainChanged()"(): EIP712DomainChangedEventFilter;
    EIP712DomainChanged(): EIP712DomainChangedEventFilter;

    "Transfer(address,address,uint256)"(
      from?: string | null,
      to?: string | null,
      tokenId?: BigNumberish | null
    ): TransferEventFilter;
    Transfer(
      from?: string | null,
      to?: string | null,
      tokenId?: BigNumberish | null
    ): TransferEventFilter;
  };

  estimateGas: {
    DAPP_TABLE_REGISTRY(overrides?: CallOverrides): Promise<BigNumber>;

    act(
      actParams: IDataMonetizer.ActParamsStruct,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    actWithSig(
      actParams: IDataMonetizer.ActParamsStruct,
      signature: IDataMonetizer.EIP712SignatureStruct,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    addActions(
      addActionsParams: IDataMonetizer.AddActionsParamsStruct,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    addActionsWithSig(
      addActionsParams: IDataMonetizer.AddActionsParamsStruct,
      signature: IDataMonetizer.EIP712SignatureStruct,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    addImages(
      addImagesParams: IDataMonetizer.AddImagesParamsStruct,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    addImagesWithSig(
      addImagesParams: IDataMonetizer.AddImagesParamsStruct,
      signature: IDataMonetizer.EIP712SignatureStruct,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    eip712Domain(overrides?: CallOverrides): Promise<BigNumber>;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAsset(assetId: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    getAssetOwner(
      assetId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getDomainSeparator(overrides?: CallOverrides): Promise<BigNumber>;

    getSigNonce(signer: string, overrides?: CallOverrides): Promise<BigNumber>;

    getTokenAsset(
      assetId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    ownerOf(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    publish(
      publishParams: IDataMonetizer.PublishParamsStruct,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    publishWithSig(
      publishParams: IDataMonetizer.PublishParamsStruct,
      signature: IDataMonetizer.EIP712SignatureStruct,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<BigNumber>;

    tokenByIndex(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenOfOwnerByIndex(
      owner: string,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenURI(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    DAPP_TABLE_REGISTRY(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    act(
      actParams: IDataMonetizer.ActParamsStruct,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    actWithSig(
      actParams: IDataMonetizer.ActParamsStruct,
      signature: IDataMonetizer.EIP712SignatureStruct,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    addActions(
      addActionsParams: IDataMonetizer.AddActionsParamsStruct,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    addActionsWithSig(
      addActionsParams: IDataMonetizer.AddActionsParamsStruct,
      signature: IDataMonetizer.EIP712SignatureStruct,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    addImages(
      addImagesParams: IDataMonetizer.AddImagesParamsStruct,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    addImagesWithSig(
      addImagesParams: IDataMonetizer.AddImagesParamsStruct,
      signature: IDataMonetizer.EIP712SignatureStruct,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    balanceOf(
      owner: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    eip712Domain(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getAsset(
      assetId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getAssetOwner(
      assetId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getDomainSeparator(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSigNonce(
      signer: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTokenAsset(
      assetId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ownerOf(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    publish(
      publishParams: IDataMonetizer.PublishParamsStruct,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    publishWithSig(
      publishParams: IDataMonetizer.PublishParamsStruct,
      signature: IDataMonetizer.EIP712SignatureStruct,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tokenByIndex(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokenOfOwnerByIndex(
      owner: string,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokenURI(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;
  };
}
