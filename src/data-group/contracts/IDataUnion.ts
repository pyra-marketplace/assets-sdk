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

export declare namespace IDataUnionDefinitions {
  export type UnionStruct = {
    startBlockNumber: BigNumberish;
    endBlockNumber: BigNumberish;
    publisher: string;
    resourceId: string;
    dataToken: string;
    subscribeModule: string;
  };

  export type UnionStructOutput = [
    BigNumber,
    BigNumber,
    string,
    string,
    string,
    string
  ] & {
    startBlockNumber: BigNumber;
    endBlockNumber: BigNumber;
    publisher: string;
    resourceId: string;
    dataToken: string;
    subscribeModule: string;
  };
}

export declare namespace IDataBaseDefinitions {
  export type SubscriptionDataStruct = {
    startAt: BigNumberish;
    endAt: BigNumberish;
  };

  export type SubscriptionDataStructOutput = [BigNumber, BigNumber] & {
    startAt: BigNumber;
    endAt: BigNumber;
  };
}

export interface IDataUnionInterface extends utils.Interface {
  functions: {
    "close(bytes32)": FunctionFragment;
    "collect(bytes32,bytes)": FunctionFragment;
    "getDataUnionById(bytes32)": FunctionFragment;
    "getDataUnionOwner(bytes32)": FunctionFragment;
    "getSubscriptionData(bytes32,uint256)": FunctionFragment;
    "initialize(address,address)": FunctionFragment;
    "isAccessible(bytes32,uint256,uint256)": FunctionFragment;
    "isCollected(bytes32,address)": FunctionFragment;
    "publish(address,bytes,string,address,bytes)": FunctionFragment;
    "subscribe(bytes32,bytes,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "close"
      | "collect"
      | "getDataUnionById"
      | "getDataUnionOwner"
      | "getSubscriptionData"
      | "initialize"
      | "isAccessible"
      | "isCollected"
      | "publish"
      | "subscribe"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "close", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "collect",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getDataUnionById",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getDataUnionOwner",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getSubscriptionData",
    values: [BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "isAccessible",
    values: [BytesLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isCollected",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "publish",
    values: [string, BytesLike, string, string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "subscribe",
    values: [BytesLike, BytesLike, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "close", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "collect", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getDataUnionById",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getDataUnionOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSubscriptionData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isAccessible",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isCollected",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "publish", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "subscribe", data: BytesLike): Result;

  events: {
    "Closed(bytes32,address,uint256)": EventFragment;
    "Collected(bytes32,address,uint256)": EventFragment;
    "Published(bytes32,address,string,address,address,uint256)": EventFragment;
    "Subscribed(bytes32,uint256,address,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Closed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Collected"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Published"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Subscribed"): EventFragment;
}

export interface ClosedEventObject {
  dataUnionId: string;
  operator: string;
  endBlockNumber: BigNumber;
}
export type ClosedEvent = TypedEvent<
  [string, string, BigNumber],
  ClosedEventObject
>;

export type ClosedEventFilter = TypedEventFilter<ClosedEvent>;

export interface CollectedEventObject {
  dataBaseId: string;
  dataToken: string;
  collectTokenId: BigNumber;
}
export type CollectedEvent = TypedEvent<
  [string, string, BigNumber],
  CollectedEventObject
>;

export type CollectedEventFilter = TypedEventFilter<CollectedEvent>;

export interface PublishedEventObject {
  dataUnionId: string;
  publisher: string;
  resourceId: string;
  dataToken: string;
  subscribeModule: string;
  startBlockNumber: BigNumber;
}
export type PublishedEvent = TypedEvent<
  [string, string, string, string, string, BigNumber],
  PublishedEventObject
>;

export type PublishedEventFilter = TypedEventFilter<PublishedEvent>;

export interface SubscribedEventObject {
  dataBaseId: string;
  collectTokenId: BigNumber;
  subscribeModule: string;
  startAt: BigNumber;
  endAt: BigNumber;
}
export type SubscribedEvent = TypedEvent<
  [string, BigNumber, string, BigNumber, BigNumber],
  SubscribedEventObject
>;

export type SubscribedEventFilter = TypedEventFilter<SubscribedEvent>;

export interface IDataUnion extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IDataUnionInterface;

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
    close(
      dataUnionId: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    collect(
      dataBaseId: BytesLike,
      data: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    getDataUnionById(
      dataUnionId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[IDataUnionDefinitions.UnionStructOutput]>;

    getDataUnionOwner(
      dataUnionId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getSubscriptionData(
      dataUnionId: BytesLike,
      collectTokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[IDataBaseDefinitions.SubscriptionDataStructOutput[]]>;

    initialize(
      dataTokenHub: string,
      dappTableRegistry: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    isAccessible(
      dataUnionId: BytesLike,
      collectTokenId: BigNumberish,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isCollected(
      dataBaseId: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    publish(
      dataTokenFactory: string,
      data: BytesLike,
      resourceId: string,
      subscribeModule: string,
      subscribeModuleInitData: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    subscribe(
      dataBaseId: BytesLike,
      data: BytesLike,
      collectTokenId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;
  };

  close(
    dataUnionId: BytesLike,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  collect(
    dataBaseId: BytesLike,
    data: BytesLike,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  getDataUnionById(
    dataUnionId: BytesLike,
    overrides?: CallOverrides
  ): Promise<IDataUnionDefinitions.UnionStructOutput>;

  getDataUnionOwner(
    dataUnionId: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  getSubscriptionData(
    dataUnionId: BytesLike,
    collectTokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<IDataBaseDefinitions.SubscriptionDataStructOutput[]>;

  initialize(
    dataTokenHub: string,
    dappTableRegistry: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  isAccessible(
    dataUnionId: BytesLike,
    collectTokenId: BigNumberish,
    blockNumber: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isCollected(
    dataBaseId: BytesLike,
    account: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  publish(
    dataTokenFactory: string,
    data: BytesLike,
    resourceId: string,
    subscribeModule: string,
    subscribeModuleInitData: BytesLike,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  subscribe(
    dataBaseId: BytesLike,
    data: BytesLike,
    collectTokenId: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  callStatic: {
    close(
      dataUnionId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    collect(
      dataBaseId: BytesLike,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getDataUnionById(
      dataUnionId: BytesLike,
      overrides?: CallOverrides
    ): Promise<IDataUnionDefinitions.UnionStructOutput>;

    getDataUnionOwner(
      dataUnionId: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    getSubscriptionData(
      dataUnionId: BytesLike,
      collectTokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<IDataBaseDefinitions.SubscriptionDataStructOutput[]>;

    initialize(
      dataTokenHub: string,
      dappTableRegistry: string,
      overrides?: CallOverrides
    ): Promise<void>;

    isAccessible(
      dataUnionId: BytesLike,
      collectTokenId: BigNumberish,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isCollected(
      dataBaseId: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    publish(
      dataTokenFactory: string,
      data: BytesLike,
      resourceId: string,
      subscribeModule: string,
      subscribeModuleInitData: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    subscribe(
      dataBaseId: BytesLike,
      data: BytesLike,
      collectTokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;
  };

  filters: {
    "Closed(bytes32,address,uint256)"(
      dataUnionId?: BytesLike | null,
      operator?: null,
      endBlockNumber?: null
    ): ClosedEventFilter;
    Closed(
      dataUnionId?: BytesLike | null,
      operator?: null,
      endBlockNumber?: null
    ): ClosedEventFilter;

    "Collected(bytes32,address,uint256)"(
      dataBaseId?: BytesLike | null,
      dataToken?: string | null,
      collectTokenId?: null
    ): CollectedEventFilter;
    Collected(
      dataBaseId?: BytesLike | null,
      dataToken?: string | null,
      collectTokenId?: null
    ): CollectedEventFilter;

    "Published(bytes32,address,string,address,address,uint256)"(
      dataUnionId?: BytesLike | null,
      publisher?: string | null,
      resourceId?: null,
      dataToken?: null,
      subscribeModule?: null,
      startBlockNumber?: null
    ): PublishedEventFilter;
    Published(
      dataUnionId?: BytesLike | null,
      publisher?: string | null,
      resourceId?: null,
      dataToken?: null,
      subscribeModule?: null,
      startBlockNumber?: null
    ): PublishedEventFilter;

    "Subscribed(bytes32,uint256,address,uint256,uint256)"(
      dataBaseId?: BytesLike | null,
      collectTokenId?: BigNumberish | null,
      subscribeModule?: string | null,
      startAt?: null,
      endAt?: null
    ): SubscribedEventFilter;
    Subscribed(
      dataBaseId?: BytesLike | null,
      collectTokenId?: BigNumberish | null,
      subscribeModule?: string | null,
      startAt?: null,
      endAt?: null
    ): SubscribedEventFilter;
  };

  estimateGas: {
    close(
      dataUnionId: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    collect(
      dataBaseId: BytesLike,
      data: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    getDataUnionById(
      dataUnionId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getDataUnionOwner(
      dataUnionId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getSubscriptionData(
      dataUnionId: BytesLike,
      collectTokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      dataTokenHub: string,
      dappTableRegistry: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    isAccessible(
      dataUnionId: BytesLike,
      collectTokenId: BigNumberish,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isCollected(
      dataBaseId: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    publish(
      dataTokenFactory: string,
      data: BytesLike,
      resourceId: string,
      subscribeModule: string,
      subscribeModuleInitData: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    subscribe(
      dataBaseId: BytesLike,
      data: BytesLike,
      collectTokenId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    close(
      dataUnionId: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    collect(
      dataBaseId: BytesLike,
      data: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    getDataUnionById(
      dataUnionId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getDataUnionOwner(
      dataUnionId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSubscriptionData(
      dataUnionId: BytesLike,
      collectTokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      dataTokenHub: string,
      dappTableRegistry: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    isAccessible(
      dataUnionId: BytesLike,
      collectTokenId: BigNumberish,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isCollected(
      dataBaseId: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    publish(
      dataTokenFactory: string,
      data: BytesLike,
      resourceId: string,
      subscribeModule: string,
      subscribeModuleInitData: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    subscribe(
      dataBaseId: BytesLike,
      data: BytesLike,
      collectTokenId: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;
  };
}
