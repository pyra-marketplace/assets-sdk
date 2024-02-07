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
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export interface SubscribeActionInterface extends utils.Interface {
  functions: {
    "ACTION_CONFIG()": FunctionFragment;
    "COLLECT_ACTION()": FunctionFragment;
    "getDappTreasuryData(bytes32)": FunctionFragment;
    "getProtocolTreasuryData()": FunctionFragment;
    "getSubscribeData(bytes32,uint256)": FunctionFragment;
    "initializeAction(bytes32,bytes)": FunctionFragment;
    "isAccessible(bytes32,uint256,uint256)": FunctionFragment;
    "isAccessible(bytes32,address,uint256)": FunctionFragment;
    "isSubscribeModuleRegistered(address)": FunctionFragment;
    "monetizer()": FunctionFragment;
    "processAction(bytes32,address,bytes)": FunctionFragment;
    "registerSubscribeModule(address)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "ACTION_CONFIG"
      | "COLLECT_ACTION"
      | "getDappTreasuryData"
      | "getProtocolTreasuryData"
      | "getSubscribeData"
      | "initializeAction"
      | "isAccessible(bytes32,uint256,uint256)"
      | "isAccessible(bytes32,address,uint256)"
      | "isSubscribeModuleRegistered"
      | "monetizer"
      | "processAction"
      | "registerSubscribeModule"
      | "supportsInterface"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "ACTION_CONFIG",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "COLLECT_ACTION",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getDappTreasuryData",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getProtocolTreasuryData",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getSubscribeData",
    values: [BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "initializeAction",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isAccessible(bytes32,uint256,uint256)",
    values: [BytesLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isAccessible(bytes32,address,uint256)",
    values: [BytesLike, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isSubscribeModuleRegistered",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "monetizer", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "processAction",
    values: [BytesLike, string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "registerSubscribeModule",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "ACTION_CONFIG",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "COLLECT_ACTION",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getDappTreasuryData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getProtocolTreasuryData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSubscribeData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "initializeAction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isAccessible(bytes32,uint256,uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isAccessible(bytes32,address,uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isSubscribeModuleRegistered",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "monetizer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "processAction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registerSubscribeModule",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;

  events: {};
}

export interface SubscribeAction extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: SubscribeActionInterface;

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
    ACTION_CONFIG(overrides?: CallOverrides): Promise<[string]>;

    COLLECT_ACTION(overrides?: CallOverrides): Promise<[string]>;

    getDappTreasuryData(
      assetId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string, BigNumber]>;

    getProtocolTreasuryData(
      overrides?: CallOverrides
    ): Promise<[string, BigNumber]>;

    getSubscribeData(
      assetId: BytesLike,
      collectionId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[[BigNumber, BigNumber][]]>;

    initializeAction(
      assetId: BytesLike,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<ContractTransaction>;

    "isAccessible(bytes32,uint256,uint256)"(
      assetId: BytesLike,
      collectionId: BigNumberish,
      timestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    "isAccessible(bytes32,address,uint256)"(
      assetId: BytesLike,
      account: string,
      timestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isSubscribeModuleRegistered(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    monetizer(overrides?: CallOverrides): Promise<[string]>;

    processAction(
      assetId: BytesLike,
      subscriber: string,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<ContractTransaction>;

    registerSubscribeModule(
      subscribeModule: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  ACTION_CONFIG(overrides?: CallOverrides): Promise<string>;

  COLLECT_ACTION(overrides?: CallOverrides): Promise<string>;

  getDappTreasuryData(
    assetId: BytesLike,
    overrides?: CallOverrides
  ): Promise<[string, BigNumber]>;

  getProtocolTreasuryData(
    overrides?: CallOverrides
  ): Promise<[string, BigNumber]>;

  getSubscribeData(
    assetId: BytesLike,
    collectionId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber][]>;

  initializeAction(
    assetId: BytesLike,
    data: BytesLike,
    overrides?: PayableOverrides & { from?: string }
  ): Promise<ContractTransaction>;

  "isAccessible(bytes32,uint256,uint256)"(
    assetId: BytesLike,
    collectionId: BigNumberish,
    timestamp: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  "isAccessible(bytes32,address,uint256)"(
    assetId: BytesLike,
    account: string,
    timestamp: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isSubscribeModuleRegistered(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  monetizer(overrides?: CallOverrides): Promise<string>;

  processAction(
    assetId: BytesLike,
    subscriber: string,
    data: BytesLike,
    overrides?: PayableOverrides & { from?: string }
  ): Promise<ContractTransaction>;

  registerSubscribeModule(
    subscribeModule: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    ACTION_CONFIG(overrides?: CallOverrides): Promise<string>;

    COLLECT_ACTION(overrides?: CallOverrides): Promise<string>;

    getDappTreasuryData(
      assetId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string, BigNumber]>;

    getProtocolTreasuryData(
      overrides?: CallOverrides
    ): Promise<[string, BigNumber]>;

    getSubscribeData(
      assetId: BytesLike,
      collectionId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber][]>;

    initializeAction(
      assetId: BytesLike,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "isAccessible(bytes32,uint256,uint256)"(
      assetId: BytesLike,
      collectionId: BigNumberish,
      timestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "isAccessible(bytes32,address,uint256)"(
      assetId: BytesLike,
      account: string,
      timestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isSubscribeModuleRegistered(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    monetizer(overrides?: CallOverrides): Promise<string>;

    processAction(
      assetId: BytesLike,
      subscriber: string,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    registerSubscribeModule(
      subscribeModule: string,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {};

  estimateGas: {
    ACTION_CONFIG(overrides?: CallOverrides): Promise<BigNumber>;

    COLLECT_ACTION(overrides?: CallOverrides): Promise<BigNumber>;

    getDappTreasuryData(
      assetId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getProtocolTreasuryData(overrides?: CallOverrides): Promise<BigNumber>;

    getSubscribeData(
      assetId: BytesLike,
      collectionId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initializeAction(
      assetId: BytesLike,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<BigNumber>;

    "isAccessible(bytes32,uint256,uint256)"(
      assetId: BytesLike,
      collectionId: BigNumberish,
      timestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "isAccessible(bytes32,address,uint256)"(
      assetId: BytesLike,
      account: string,
      timestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isSubscribeModuleRegistered(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    monetizer(overrides?: CallOverrides): Promise<BigNumber>;

    processAction(
      assetId: BytesLike,
      subscriber: string,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<BigNumber>;

    registerSubscribeModule(
      subscribeModule: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    ACTION_CONFIG(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    COLLECT_ACTION(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getDappTreasuryData(
      assetId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getProtocolTreasuryData(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSubscribeData(
      assetId: BytesLike,
      collectionId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initializeAction(
      assetId: BytesLike,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    "isAccessible(bytes32,uint256,uint256)"(
      assetId: BytesLike,
      collectionId: BigNumberish,
      timestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "isAccessible(bytes32,address,uint256)"(
      assetId: BytesLike,
      account: string,
      timestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isSubscribeModuleRegistered(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    monetizer(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    processAction(
      assetId: BytesLike,
      subscriber: string,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    registerSubscribeModule(
      subscribeModule: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
