/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  FeeCollectModule,
  FeeCollectModuleInterface,
} from "../FeeCollectModule";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "collectAction",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ExceedTotalSupply",
    type: "error",
  },
  {
    inputs: [],
    name: "InitParamsInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "ModuleDataMismatch",
    type: "error",
  },
  {
    inputs: [],
    name: "NotCollectAction",
    type: "error",
  },
  {
    inputs: [],
    name: "COLLECT_ACTION",
    outputs: [
      {
        internalType: "contract CollectAction",
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
        internalType: "bytes32",
        name: "assetId",
        type: "bytes32",
      },
    ],
    name: "getAssetCollectDetail",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "totalSupply",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "currentCollects",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "currency",
            type: "address",
          },
        ],
        internalType: "struct AssetCollectDetail",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "assetId",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "initializeCollectModule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "assetId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "collector",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "processCollect",
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
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
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

const _bytecode =
  "0x60a060405234801561001057600080fd5b50604051610d9a380380610d9a83398101604081905261002f91610040565b6001600160a01b0316608052610070565b60006020828403121561005257600080fd5b81516001600160a01b038116811461006957600080fd5b9392505050565b608051610ced6100ad60003960008181609e015281816101890152818161027d015281816104b60152818161058101526106570152610ced6000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c806301ffc9a71461005c5780636e12b7fa146100845780636fad60871461009957806385f4220f146100d8578063dd404d79146100f8575b600080fd5b61006f61006a366004610999565b610147565b60405190151581526020015b60405180910390f35b610097610092366004610a13565b61017e565b005b6100c07f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b03909116815260200161007b565b6100eb6100e6366004610a77565b610270565b60405161007b9190610b23565b61010b610106366004610b36565b6103d5565b60405161007b91908151815260208083015190820152604080830151908201526060918201516001600160a01b03169181019190915260800190565b60006001600160e01b0319821663ebe695f560e01b148061017857506301ffc9a760e01b6001600160e01b03198316145b92915050565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146101c757604051636e62be0b60e11b815260040160405180910390fd5b600080806101d784860186610b4f565b92509250925082600014806101ea575080155b15610208576040516348be0eb360e01b815260040160405180910390fd5b60408051608081018252938452600060208086018281528684019485526001600160a01b039586166060880190815299835290829052919020935184555160018401555160028301559351600390910180546001600160a01b03191691909416179092555050565b6060336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146102bb57604051636e62be0b60e11b815260040160405180910390fd5b600085815260208190526040902080546001820154106102ee576040516342053c3d60e11b815260040160405180910390fd5b6003810154600282015461030f91869186916001600160a01b031690610455565b806001016000815461032090610b9d565b90915550600381015460028201546000916103469188916001600160a01b0316906104af565b6003830154600284015491925060009161036d918a918a916001600160a01b03169061057a565b90506000818385600201546103829190610bb6565b61038c9190610bb6565b905080156103b7576103b7886103a18b610653565b60038701546001600160a01b0316919084610747565b5050604080516000815260208101909152925050505b949350505050565b610409604051806080016040528060008152602001600081526020016000815260200160006001600160a01b031681525090565b50600090815260208181526040918290208251608081018452815481526001820154928101929092526002810154928201929092526003909101546001600160a01b0316606082015290565b60008061046485870187610bc9565b9150915082811415806104895750836001600160a01b0316826001600160a01b031614155b156104a7576040516346308bd560e01b815260040160405180910390fd5b505050505050565b60008060007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166320dd9ac26040518163ffffffff1660e01b81526004016040805180830381865afa158015610511573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105359190610bf5565b909250905060006127106105498387610c23565b6105539190610c3a565b90508015610570576105706001600160a01b038716888584610747565b9695505050505050565b60008060007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166395197b51886040518263ffffffff1660e01b81526004016105cd91815260200190565b6040805180830381865afa1580156105e9573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061060d9190610bf5565b909250905060006127106106218387610c23565b61062b9190610c3a565b90508015610648576106486001600160a01b038716888584610747565b979650505050505050565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166379e559366040518163ffffffff1660e01b8152600401602060405180830381865afa1580156106b3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106d79190610c5c565b6001600160a01b03166335d8c2b7836040518263ffffffff1660e01b815260040161070491815260200190565b6020604051808303816000875af1158015610723573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101789190610c5c565b604080516001600160a01b0385811660248301528416604482015260648082018490528251808303909101815260849091019091526020810180516001600160e01b03166323b872dd60e01b1790526107a19085906107a7565b50505050565b60006107fc826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166108869092919063ffffffff16565b905080516000148061081d57508080602001905181019061081d9190610c79565b6108815760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084015b60405180910390fd5b505050565b60606103cd848460008585600080866001600160a01b031685876040516108ad9190610c9b565b60006040518083038185875af1925050503d80600081146108ea576040519150601f19603f3d011682016040523d82523d6000602084013e6108ef565b606091505b5091509150610648878383876060831561096a578251600003610963576001600160a01b0385163b6109635760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610878565b50816103cd565b6103cd838381511561097f5781518083602001fd5b8060405162461bcd60e51b81526004016108789190610b23565b6000602082840312156109ab57600080fd5b81356001600160e01b0319811681146109c357600080fd5b9392505050565b60008083601f8401126109dc57600080fd5b50813567ffffffffffffffff8111156109f457600080fd5b602083019150836020828501011115610a0c57600080fd5b9250929050565b600080600060408486031215610a2857600080fd5b83359250602084013567ffffffffffffffff811115610a4657600080fd5b610a52868287016109ca565b9497909650939450505050565b6001600160a01b0381168114610a7457600080fd5b50565b60008060008060608587031215610a8d57600080fd5b843593506020850135610a9f81610a5f565b9250604085013567ffffffffffffffff811115610abb57600080fd5b610ac7878288016109ca565b95989497509550505050565b60005b83811015610aee578181015183820152602001610ad6565b50506000910152565b60008151808452610b0f816020860160208601610ad3565b601f01601f19169290920160200192915050565b6020815260006109c36020830184610af7565b600060208284031215610b4857600080fd5b5035919050565b600080600060608486031215610b6457600080fd5b833592506020840135610b7681610a5f565b929592945050506040919091013590565b634e487b7160e01b600052601160045260246000fd5b600060018201610baf57610baf610b87565b5060010190565b8181038181111561017857610178610b87565b60008060408385031215610bdc57600080fd5b8235610be781610a5f565b946020939093013593505050565b60008060408385031215610c0857600080fd5b8251610c1381610a5f565b6020939093015192949293505050565b808202811582820484141761017857610178610b87565b600082610c5757634e487b7160e01b600052601260045260246000fd5b500490565b600060208284031215610c6e57600080fd5b81516109c381610a5f565b600060208284031215610c8b57600080fd5b815180151581146109c357600080fd5b60008251610cad818460208701610ad3565b919091019291505056fea2646970667358221220447d48eecdbb560b675e193b2b716d03c34fcb2e8d506172be61513aaa630e3064736f6c63430008150033";

type FeeCollectModuleConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FeeCollectModuleConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class FeeCollectModule__factory extends ContractFactory {
  constructor(...args: FeeCollectModuleConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    collectAction: string,
    overrides?: Overrides & { from?: string }
  ): Promise<FeeCollectModule> {
    return super.deploy(
      collectAction,
      overrides || {}
    ) as Promise<FeeCollectModule>;
  }
  override getDeployTransaction(
    collectAction: string,
    overrides?: Overrides & { from?: string }
  ): TransactionRequest {
    return super.getDeployTransaction(collectAction, overrides || {});
  }
  override attach(address: string): FeeCollectModule {
    return super.attach(address) as FeeCollectModule;
  }
  override connect(signer: Signer): FeeCollectModule__factory {
    return super.connect(signer) as FeeCollectModule__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FeeCollectModuleInterface {
    return new utils.Interface(_abi) as FeeCollectModuleInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FeeCollectModule {
    return new Contract(address, _abi, signerOrProvider) as FeeCollectModule;
  }
}
