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
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export type UnionDataStruct = { currency: string; amount: BigNumberish };

export type UnionDataStructOutput = [string, BigNumber] & {
  currency: string;
  amount: BigNumber;
};

export interface BlockSubscribeModuleInterface extends utils.Interface {
  functions: {
    "getUnionData(bytes32)": FunctionFragment;
    "initializeSubscribeModule(bytes32,bytes)": FunctionFragment;
    "processSubscribe(bytes32,string,address,bytes)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "getUnionData"
      | "initializeSubscribeModule"
      | "processSubscribe"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getUnionData",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "initializeSubscribeModule",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "processSubscribe",
    values: [BytesLike, string, string, BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "getUnionData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "initializeSubscribeModule",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "processSubscribe",
    data: BytesLike
  ): Result;

  events: {};
}

export interface BlockSubscribeModule extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: BlockSubscribeModuleInterface;

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
    getUnionData(
      dataUnionId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[UnionDataStructOutput]>;

    initializeSubscribeModule(
      dataUnionId: BytesLike,
      data: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    processSubscribe(
      dataUnionId: BytesLike,
      resourceId: string,
      subscriber: string,
      data: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;
  };

  getUnionData(
    dataUnionId: BytesLike,
    overrides?: CallOverrides
  ): Promise<UnionDataStructOutput>;

  initializeSubscribeModule(
    dataUnionId: BytesLike,
    data: BytesLike,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  processSubscribe(
    dataUnionId: BytesLike,
    resourceId: string,
    subscriber: string,
    data: BytesLike,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  callStatic: {
    getUnionData(
      dataUnionId: BytesLike,
      overrides?: CallOverrides
    ): Promise<UnionDataStructOutput>;

    initializeSubscribeModule(
      dataUnionId: BytesLike,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    processSubscribe(
      dataUnionId: BytesLike,
      resourceId: string,
      subscriber: string,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;
  };

  filters: {};

  estimateGas: {
    getUnionData(
      dataUnionId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initializeSubscribeModule(
      dataUnionId: BytesLike,
      data: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    processSubscribe(
      dataUnionId: BytesLike,
      resourceId: string,
      subscriber: string,
      data: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getUnionData(
      dataUnionId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initializeSubscribeModule(
      dataUnionId: BytesLike,
      data: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    processSubscribe(
      dataUnionId: BytesLike,
      resourceId: string,
      subscriber: string,
      data: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;
  };
}
