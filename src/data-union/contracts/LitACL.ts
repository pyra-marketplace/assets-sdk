/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
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

export interface LitACLInterface extends utils.Interface {
  functions: {
    "DATA_UNION()": FunctionFragment;
    "isAccessible(bytes32,address,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "DATA_UNION" | "isAccessible"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "DATA_UNION",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isAccessible",
    values: [BytesLike, string, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "DATA_UNION", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isAccessible",
    data: BytesLike
  ): Result;

  events: {};
}

export interface LitACL extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: LitACLInterface;

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
    DATA_UNION(overrides?: CallOverrides): Promise<[string]>;

    isAccessible(
      dataUnionId: BytesLike,
      subscriber: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  DATA_UNION(overrides?: CallOverrides): Promise<string>;

  isAccessible(
    dataUnionId: BytesLike,
    subscriber: string,
    blockNumber: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    DATA_UNION(overrides?: CallOverrides): Promise<string>;

    isAccessible(
      dataUnionId: BytesLike,
      subscriber: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {};

  estimateGas: {
    DATA_UNION(overrides?: CallOverrides): Promise<BigNumber>;

    isAccessible(
      dataUnionId: BytesLike,
      subscriber: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    DATA_UNION(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    isAccessible(
      dataUnionId: BytesLike,
      subscriber: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
