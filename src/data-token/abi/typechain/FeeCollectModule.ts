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

export type AssetCollectDetailStruct = {
  totalSupply: BigNumberish;
  currentCollects: BigNumberish;
  amount: BigNumberish;
  currency: string;
};

export type AssetCollectDetailStructOutput = [
  BigNumber,
  BigNumber,
  BigNumber,
  string
] & {
  totalSupply: BigNumber;
  currentCollects: BigNumber;
  amount: BigNumber;
  currency: string;
};

export interface FeeCollectModuleInterface extends utils.Interface {
  functions: {
    "COLLECT_ACTION()": FunctionFragment;
    "getAssetCollectDetail(bytes32)": FunctionFragment;
    "initializeCollectModule(bytes32,bytes)": FunctionFragment;
    "processCollect(bytes32,address,bytes)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "COLLECT_ACTION"
      | "getAssetCollectDetail"
      | "initializeCollectModule"
      | "processCollect"
      | "supportsInterface"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "COLLECT_ACTION",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getAssetCollectDetail",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "initializeCollectModule",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "processCollect",
    values: [BytesLike, string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "COLLECT_ACTION",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAssetCollectDetail",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "initializeCollectModule",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "processCollect",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;

  events: {
    "CollectModuleCollected(bytes32,address)": EventFragment;
    "CollectModuleInitialized(bytes32,uint256,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "CollectModuleCollected"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "CollectModuleInitialized"): EventFragment;
}

export interface CollectModuleCollectedEventObject {
  assetId: string;
  collector: string;
}
export type CollectModuleCollectedEvent = TypedEvent<
  [string, string],
  CollectModuleCollectedEventObject
>;

export type CollectModuleCollectedEventFilter =
  TypedEventFilter<CollectModuleCollectedEvent>;

export interface CollectModuleInitializedEventObject {
  assetId: string;
  totalSupply: BigNumber;
  currency: string;
  amount: BigNumber;
}
export type CollectModuleInitializedEvent = TypedEvent<
  [string, BigNumber, string, BigNumber],
  CollectModuleInitializedEventObject
>;

export type CollectModuleInitializedEventFilter =
  TypedEventFilter<CollectModuleInitializedEvent>;

export interface FeeCollectModule extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: FeeCollectModuleInterface;

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
    COLLECT_ACTION(overrides?: CallOverrides): Promise<[string]>;

    getAssetCollectDetail(
      assetId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[AssetCollectDetailStructOutput]>;

    initializeCollectModule(
      assetId: BytesLike,
      data: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    processCollect(
      assetId: BytesLike,
      collector: string,
      data: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  COLLECT_ACTION(overrides?: CallOverrides): Promise<string>;

  getAssetCollectDetail(
    assetId: BytesLike,
    overrides?: CallOverrides
  ): Promise<AssetCollectDetailStructOutput>;

  initializeCollectModule(
    assetId: BytesLike,
    data: BytesLike,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  processCollect(
    assetId: BytesLike,
    collector: string,
    data: BytesLike,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    COLLECT_ACTION(overrides?: CallOverrides): Promise<string>;

    getAssetCollectDetail(
      assetId: BytesLike,
      overrides?: CallOverrides
    ): Promise<AssetCollectDetailStructOutput>;

    initializeCollectModule(
      assetId: BytesLike,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    processCollect(
      assetId: BytesLike,
      collector: string,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    "CollectModuleCollected(bytes32,address)"(
      assetId?: BytesLike | null,
      collector?: string | null
    ): CollectModuleCollectedEventFilter;
    CollectModuleCollected(
      assetId?: BytesLike | null,
      collector?: string | null
    ): CollectModuleCollectedEventFilter;

    "CollectModuleInitialized(bytes32,uint256,address,uint256)"(
      assetId?: BytesLike | null,
      totalSupply?: null,
      currency?: null,
      amount?: null
    ): CollectModuleInitializedEventFilter;
    CollectModuleInitialized(
      assetId?: BytesLike | null,
      totalSupply?: null,
      currency?: null,
      amount?: null
    ): CollectModuleInitializedEventFilter;
  };

  estimateGas: {
    COLLECT_ACTION(overrides?: CallOverrides): Promise<BigNumber>;

    getAssetCollectDetail(
      assetId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initializeCollectModule(
      assetId: BytesLike,
      data: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    processCollect(
      assetId: BytesLike,
      collector: string,
      data: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    COLLECT_ACTION(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getAssetCollectDetail(
      assetId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initializeCollectModule(
      assetId: BytesLike,
      data: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    processCollect(
      assetId: BytesLike,
      collector: string,
      data: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
