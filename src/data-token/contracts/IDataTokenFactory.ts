/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
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

export interface IDataTokenFactoryInterface extends utils.Interface {
  functions: {
    "createDataToken(bytes)": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "createDataToken"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "createDataToken",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "createDataToken",
    data: BytesLike
  ): Result;

  events: {
    "DataTokenCreated(address,address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "DataTokenCreated"): EventFragment;
}

export interface DataTokenCreatedEventObject {
  creator: string;
  originalContract: string;
  dataToken: string;
}
export type DataTokenCreatedEvent = TypedEvent<
  [string, string, string],
  DataTokenCreatedEventObject
>;

export type DataTokenCreatedEventFilter =
  TypedEventFilter<DataTokenCreatedEvent>;

export interface IDataTokenFactory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IDataTokenFactoryInterface;

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
    createDataToken(
      initVars: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;
  };

  createDataToken(
    initVars: BytesLike,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  callStatic: {
    createDataToken(
      initVars: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {
    "DataTokenCreated(address,address,address)"(
      creator?: string | null,
      originalContract?: string | null,
      dataToken?: string | null
    ): DataTokenCreatedEventFilter;
    DataTokenCreated(
      creator?: string | null,
      originalContract?: string | null,
      dataToken?: string | null
    ): DataTokenCreatedEventFilter;
  };

  estimateGas: {
    createDataToken(
      initVars: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    createDataToken(
      initVars: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;
  };
}
