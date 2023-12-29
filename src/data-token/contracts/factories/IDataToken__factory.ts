/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IDataToken, IDataTokenInterface } from "../IDataToken";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "dataToken",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "collector",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "collectNFT",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Collected",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "collect",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getCollectNFT",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getContentURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getDataTokenOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMetadata",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "originalContract",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "profileId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "pubId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "collectMiddleware",
            type: "address",
          },
        ],
        internalType: "struct DataTypes.Metadata",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "graphType",
    outputs: [
      {
        internalType: "enum DataTypes.GraphType",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "isCollected",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class IDataToken__factory {
  static readonly abi = _abi;
  static createInterface(): IDataTokenInterface {
    return new utils.Interface(_abi) as IDataTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IDataToken {
    return new Contract(address, _abi, signerOrProvider) as IDataToken;
  }
}
