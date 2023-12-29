/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  CollectPaidMw,
  CollectPaidMwInterface,
} from "../../Cyber/CollectPaidMw";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "treasury",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "namespace",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "profileId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "essenceId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalSupply",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "currency",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "subscribeRequired",
        type: "bool",
      },
    ],
    name: "CollectPaidMwSet",
    type: "event",
  },
  {
    inputs: [],
    name: "TREASURY",
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
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "postProcess",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "profileId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "essenceId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "collector",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "preProcess",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "profileId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "essenceId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "setEssenceMwData",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60a060405234801561001057600080fd5b50604051610fc4380380610fc483398101604081905261002f9161009c565b806001600160a01b03811661008a5760405162461bcd60e51b815260206004820152601560248201527f5a45524f5f54524541535552595f414444524553530000000000000000000000604482015260640160405180910390fd5b6001600160a01b0316608052506100cc565b6000602082840312156100ae57600080fd5b81516001600160a01b03811681146100c557600080fd5b9392505050565b608051610ec96100fb60003960008181605601528181610662015281816106d901526108bd0152610ec96000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80632d2c5565146100515780632eae926214610095578063a58d4f0e146100ad578063f2dd081b146100cd575b600080fd5b6100787f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020015b60405180910390f35b6100ab6100a3366004610bf6565b505050505050565b005b6100c06100bb366004610c72565b6100e0565b60405161008c9190610d1d565b6100ab6100db366004610bf6565b610442565b60606000808080806100f487890189610d3e565b94509450945094509450836000036101445760405162461bcd60e51b815260206004820152600e60248201526d1253959053125117d05353d5539560921b60448201526064015b60405180910390fd5b6001600160a01b03831661018c5760405162461bcd60e51b815260206004820152600f60248201526e494e56414c49445f4144445245535360881b604482015260640161013b565b61019582610640565b6101d85760405162461bcd60e51b815260206004820152601460248201527310d55494915390d657d393d517d0531313d5d15160621b604482015260640161013b565b84600080336001600160a01b03166001600160a01b0316815260200190815260200160002060008c815260200190815260200160002060008b81526020019081526020016000206000018190555083600080336001600160a01b03166001600160a01b0316815260200190815260200160002060008c815260200190815260200160002060008b81526020019081526020016000206002018190555082600080336001600160a01b03166001600160a01b0316815260200190815260200160002060008c815260200190815260200160002060008b815260200190815260200160002060030160006101000a8154816001600160a01b0302191690836001600160a01b0316021790555081600080336001600160a01b03166001600160a01b0316815260200190815260200160002060008c815260200190815260200160002060008b815260200190815260200160002060040160006101000a8154816001600160a01b0302191690836001600160a01b0316021790555080600080336001600160a01b03166001600160a01b0316815260200190815260200160002060008c815260200190815260200160002060008b815260200190815260200160002060040160146101000a81548160ff021916908315150217905550888a336001600160a01b03167fe0bed9059cabc761c890d3878a979e2dcada6865df5703a1f09f3363f3c555f9888888888860405161041d95949392919094855260208501939093526001600160a01b0391821660408501521660608301521515608082015260a00190565b60405180910390a4505060408051600081526020810190915298975050505050505050565b3360009081526020818152604080832089845282528083208884529091528120600181015490546104739190610db3565b116104b95760405162461bcd60e51b815260206004820152601660248201527510d3d3131150d517d31253525517d15610d15151115160521b604482015260640161013b565b336000908152602081815260408083208984528252808320888452909152812060048101546002909101546001600160a01b03909116916127106104fb6106d5565b6105059084610dca565b61050f9190610de9565b9050600061051d8284610db3565b336000908152602081815260408083208e845282528083208d8452909152902060040154909150600160a01b900460ff16151560010361059f57610562338b8a61075e565b61059f5760405162461bcd60e51b815260206004820152600e60248201526d1393d517d4d55094d0d49250915160921b604482015260640161013b565b336000908152602081815260408083208d845282528083208c84529091529020600301546105dc906001600160a01b03868116918b911684610859565b811561060057610600886105ee6108b9565b6001600160a01b038716919085610859565b336000908152602081815260408083208d845282528083208c8452909152812060010180549161062f83610e0b565b919050555050505050505050505050565b604051635a195d1960e01b81526001600160a01b0382811660048301526000917f000000000000000000000000000000000000000000000000000000000000000090911690635a195d1990602401602060405180830381865afa1580156106ab573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106cf9190610e24565b92915050565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166329070c6d6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610735573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107599190610e41565b905090565b60405163f4954aef60e01b81526004810183905260009081906001600160a01b0386169063f4954aef90602401602060405180830381865afa1580156107a8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107cc9190610e5a565b90506001600160a01b0381161580159061084e57506040516370a0823160e01b81526001600160a01b0384811660048301528216906370a0823190602401602060405180830381865afa158015610827573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061084b9190610e41565b15155b9150505b9392505050565b604080516001600160a01b0385811660248301528416604482015260648082018490528251808303909101815260849091019091526020810180516001600160e01b03166323b872dd60e01b1790526108b390859061093d565b50505050565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663e00246046040518163ffffffff1660e01b8152600401602060405180830381865afa158015610919573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107599190610e5a565b6000610992826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316610a149092919063ffffffff16565b805190915015610a0f57808060200190518101906109b09190610e24565b610a0f5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b606482015260840161013b565b505050565b6060610a238484600085610a2b565b949350505050565b606082471015610a8c5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b606482015260840161013b565b6001600160a01b0385163b610ae35760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015260640161013b565b600080866001600160a01b03168587604051610aff9190610e77565b60006040518083038185875af1925050503d8060008114610b3c576040519150601f19603f3d011682016040523d82523d6000602084013e610b41565b606091505b5091509150610b51828286610b5c565b979650505050505050565b60608315610b6b575081610852565b825115610b7b5782518084602001fd5b8160405162461bcd60e51b815260040161013b9190610d1d565b6001600160a01b0381168114610baa57600080fd5b50565b60008083601f840112610bbf57600080fd5b50813567ffffffffffffffff811115610bd757600080fd5b602083019150836020828501011115610bef57600080fd5b9250929050565b60008060008060008060a08789031215610c0f57600080fd5b86359550602087013594506040870135610c2881610b95565b93506060870135610c3881610b95565b9250608087013567ffffffffffffffff811115610c5457600080fd5b610c6089828a01610bad565b979a9699509497509295939492505050565b60008060008060608587031215610c8857600080fd5b8435935060208501359250604085013567ffffffffffffffff811115610cad57600080fd5b610cb987828801610bad565b95989497509550505050565b60005b83811015610ce0578181015183820152602001610cc8565b838111156108b35750506000910152565b60008151808452610d09816020860160208601610cc5565b601f01601f19169290920160200192915050565b6020815260006108526020830184610cf1565b8015158114610baa57600080fd5b600080600080600060a08688031215610d5657600080fd5b85359450602086013593506040860135610d6f81610b95565b92506060860135610d7f81610b95565b91506080860135610d8f81610d30565b809150509295509295909350565b634e487b7160e01b600052601160045260246000fd5b600082821015610dc557610dc5610d9d565b500390565b6000816000190483118215151615610de457610de4610d9d565b500290565b600082610e0657634e487b7160e01b600052601260045260246000fd5b500490565b600060018201610e1d57610e1d610d9d565b5060010190565b600060208284031215610e3657600080fd5b815161085281610d30565b600060208284031215610e5357600080fd5b5051919050565b600060208284031215610e6c57600080fd5b815161085281610b95565b60008251610e89818460208701610cc5565b919091019291505056fea2646970667358221220bbd2097ef1f0b2c7b4b14d221075fb32556e2667b3eb59c4ea9e83aa8ea23b2964736f6c634300080e0033";

type CollectPaidMwConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CollectPaidMwConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CollectPaidMw__factory extends ContractFactory {
  constructor(...args: CollectPaidMwConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    treasury: string,
    overrides?: Overrides & { from?: string }
  ): Promise<CollectPaidMw> {
    return super.deploy(treasury, overrides || {}) as Promise<CollectPaidMw>;
  }
  override getDeployTransaction(
    treasury: string,
    overrides?: Overrides & { from?: string }
  ): TransactionRequest {
    return super.getDeployTransaction(treasury, overrides || {});
  }
  override attach(address: string): CollectPaidMw {
    return super.attach(address) as CollectPaidMw;
  }
  override connect(signer: Signer): CollectPaidMw__factory {
    return super.connect(signer) as CollectPaidMw__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CollectPaidMwInterface {
    return new utils.Interface(_abi) as CollectPaidMwInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CollectPaidMw {
    return new Contract(address, _abi, signerOrProvider) as CollectPaidMw;
  }
}