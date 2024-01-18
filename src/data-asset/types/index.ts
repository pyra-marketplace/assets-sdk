import { IDataMonetizer } from "../abi/typechain/DataMonetizerBase";

export type PublishParams = IDataMonetizer.PublishParamsStruct;

export type ActParams = IDataMonetizer.ActParamsStruct;

export type AddActionsParams = IDataMonetizer.AddActionsParamsStruct;

export type EIP712Signature = IDataMonetizer.EIP712SignatureStruct;

export type GeneralAccessCondition =
  | {
      conditionType?: "evmBasic";
      contractAddress: string;
      standardContractType:
        | "SIWE"
        | "timestamp"
        | "POAP"
        | "ERC1155"
        | "ERC721"
        | "ERC20"
        | "MolochDAOv2.1"
        | "Creaton"
        | "ProofOfHumanity"
        | "CASK"
        | "LitAction"
        | "";
      chain: string;
      method: string;
      parameters: string[];
      returnValueTest: ReturnValueTest;
    }
  | {
      conditionType: "solRpc";
      method: string;
      params: string[];
      chain: string;
      pdaParams: [];
      pdaInterface: { offset: number; field: object };
      pdaKey: string;
      returnValueTest: ReturnValueTest;
    }
  | {
      conditionType: "cosmos";
      path: string;
      chain: string;
      returnValueTest: ReturnValueTest;
    };

export type GeneralAccessConditions = (
  | GeneralAccessCondition
  | BooleanCondition
  | (GeneralAccessCondition | BooleanCondition)[]
)[];

export type SourceAssetConditionInput = {
  conditionType?: "evmContract";
  contractAddress: string;
  functionName: string;
  functionParams: (string | number)[];
  functionAbi: {
    name: string;
    type?: string;
    constant?: true;
    stateMutability: string;
    outputs: { type: string; name: string; internalType?: string }[];
    inputs: { type: string; name: string; internalType?: string }[];
  };
  chain: string;
  returnValueTest: ReturnValueTest;
};

export interface TimestampCondition {
  contractAddress: "";
  standardContractType: "timestamp";
  chain: string;
  method: "eth_getBlockByNumber";
  parameters: ["latest"];
  returnValueTest: {
    comparator: ">=";
    value: string;
  };
}

export type SourceAssetCondition = (
  | SourceAssetConditionInput
  | AndCondition
  | TimestampCondition
)[];

export interface LinkedAssetConditionInput {
  conditionType?: "evmContract";
  contractAddress: string;
  functionName: string;
  functionParams: string[];
  functionAbi: {
    name: string;
    type?: string;
    constant?: true;
    stateMutability: string;
    outputs: { type: string; name: string; internalType?: string }[];
    inputs: { type: string; name: string; internalType?: string }[];
  };
  chain: string;
  returnValueTest: ReturnValueTest;
  //   standardContractType?: string;
  //   method?: string;
  //   parameters?: string[];
}

export type LinkedAssetConditions = (
  | (LinkedAssetConditionInput | AndCondition | TimestampCondition)[]
  | OrCondition
)[];

// export type DecryptionConditions = (
//   | AccessControlCondition
//   | BooleanCondition
//   | (UnifiedAccessControlCondition | BooleanCondition)[]
// )[];

export interface OrCondition {
  operator: "or";
}

export interface AndCondition {
  operator: "and";
}

export interface BooleanCondition {
  operator: "and" | "or";
}

export interface ReturnValueTest {
  key?: string;
  comparator: "contains" | "=" | ">" | ">=" | "<" | "<=";
  value: string;
}
