/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  BlockSubscribeModule,
  BlockSubscribeModuleInterface,
} from "../BlockSubscribeModule";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "dappTableRegistry",
        type: "address",
      },
      {
        internalType: "address",
        name: "globalConfig",
        type: "address",
      },
      {
        internalType: "address",
        name: "dataUnion",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InvalidInitParams",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidSubscriptionDuration",
    type: "error",
  },
  {
    inputs: [],
    name: "ModuleDataMismatch",
    type: "error",
  },
  {
    inputs: [],
    name: "NotDataUnion",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "dataUnionId",
        type: "bytes32",
      },
    ],
    name: "getUnionData",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "currency",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        internalType: "struct UnionData",
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
        name: "dataUnionId",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "initializeSubscribeModule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "dataUnionId",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "resourceId",
        type: "string",
      },
      {
        internalType: "address",
        name: "subscriber",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "processSubscribe",
    outputs: [
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
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60e060405234801561001057600080fd5b5060405161101738038061101783398101604081905261002f91610068565b6001600160a01b0392831660805290821660a0521660c0526100ab565b80516001600160a01b038116811461006357600080fd5b919050565b60008060006060848603121561007d57600080fd5b6100868461004c565b92506100946020850161004c565b91506100a26040850161004c565b90509250925092565b60805160a05160c051610f216100f66000396000818161010a015281816101d201528181610287015261044501526000818161050001526105d9015260006106c50152610f216000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806369f577d9146100465780638f56a8791461005b578063a982469314610088575b600080fd5b6100596100543660046109cb565b6100ff565b005b61006e610069366004610b35565b6101c4565b604080519283526020830191909152015b60405180910390f35b6100db610096366004610be2565b60408051808201909152600080825260208201525060009081526020818152604091829020825180840190935280546001600160a01b03168352600101549082015290565b6040805182516001600160a01b03168152602092830151928101929092520161007f565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461014857604051630144f50b60e11b815260040160405180910390fd5b60008061015783850185610bfb565b91509150610164826104de565b158061016e575080155b1561018c57604051630a5addd160e21b815260040160405180910390fd5b60009485526020859052604090942080546001600160a01b0319166001600160a01b0392909216919091178155600101929092555050565b600080336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461021057604051630144f50b60e11b815260040160405180910390fd5b600086815260208181526040808320815180830190925280546001600160a01b0316825260010154818301528551909291829182916102559189018101908901610c7b565b92509250925061026e8185600001518660200151610573565b604051633131b3ad60e11b8152600481018b90526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690636263675a90602401600060405180830381865afa1580156102d6573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526102fe9190810190610cef565b9050838310806103115750806020015183115b8061031c5750805184105b8061032657504384115b1561034457604051631020ebb760e11b815260040160405180910390fd5b60006103508585610dd0565b61035b906001610de3565b866020015161036a9190610df6565b90506000806103776105d4565b9092509050600061271061038b8386610df6565b6103959190610e0d565b905080156103c15788516103b4906001600160a01b03168e8584610660565b6103be8185610dd0565b93505b5050506000806103d08d6106c0565b909250905060006127106103e48386610df6565b6103ee9190610e0d565b9050801561041a57885161040d906001600160a01b03168e8584610660565b6104178185610dd0565b93505b5050811590506104cc5760405163b8fd6d5160e01b8152600481018d90526000906001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063b8fd6d5190602401602060405180830381865afa15801561048c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104b09190610e2f565b87519091506104ca906001600160a01b03168c8385610660565b505b50929a91995090975050505050505050565b60405163a192c51d60e01b81526001600160a01b0382811660048301526000917f00000000000000000000000000000000000000000000000000000000000000009091169063a192c51d90602401602060405180830381865afa158015610549573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061056d9190610e4c565b92915050565b6000808480602001905181019061058a9190610e6e565b9150915082811415806105af5750836001600160a01b0316826001600160a01b031614155b156105cd576040516346308bd560e01b815260040160405180910390fd5b5050505050565b6000807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166398f965d16040518163ffffffff1660e01b81526004016040805180830381865afa158015610634573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106589190610e6e565b915091509091565b604080516001600160a01b0385811660248301528416604482015260648082018490528251808303909101815260849091019091526020810180516001600160e01b03166323b872dd60e01b1790526106ba908590610758565b50505050565b6000807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316639d96f1c4846040518263ffffffff1660e01b815260040161070f9190610e9c565b6040805180830381865afa15801561072b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061074f9190610e6e565b91509150915091565b60006107ad826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166108379092919063ffffffff16565b90508051600014806107ce5750808060200190518101906107ce9190610e4c565b6108325760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084015b60405180910390fd5b505050565b60606108468484600085610850565b90505b9392505050565b6060824710156108b15760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b6064820152608401610829565b600080866001600160a01b031685876040516108cd9190610ecf565b60006040518083038185875af1925050503d806000811461090a576040519150601f19603f3d011682016040523d82523d6000602084013e61090f565b606091505b50915091506109208783838761092d565b925050505b949350505050565b6060831561099c578251600003610995576001600160a01b0385163b6109955760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610829565b5081610925565b61092583838151156109b15781518083602001fd5b8060405162461bcd60e51b81526004016108299190610e9c565b6000806000604084860312156109e057600080fd5b83359250602084013567ffffffffffffffff808211156109ff57600080fd5b818601915086601f830112610a1357600080fd5b813581811115610a2257600080fd5b876020828501011115610a3457600080fd5b6020830194508093505050509250925092565b634e487b7160e01b600052604160045260246000fd5b60405160c0810167ffffffffffffffff81118282101715610a8057610a80610a47565b60405290565b604051601f8201601f1916810167ffffffffffffffff81118282101715610aaf57610aaf610a47565b604052919050565b600067ffffffffffffffff821115610ad157610ad1610a47565b50601f01601f191660200190565b6000610af2610aed84610ab7565b610a86565b9050828152838383011115610b0657600080fd5b828260208301376000602084830101529392505050565b6001600160a01b0381168114610b3257600080fd5b50565b60008060008060808587031215610b4b57600080fd5b84359350602085013567ffffffffffffffff80821115610b6a57600080fd5b818701915087601f830112610b7e57600080fd5b610b8d88833560208501610adf565b945060408701359150610b9f82610b1d565b90925060608601359080821115610bb557600080fd5b508501601f81018713610bc757600080fd5b610bd687823560208401610adf565b91505092959194509250565b600060208284031215610bf457600080fd5b5035919050565b60008060408385031215610c0e57600080fd5b8235610c1981610b1d565b946020939093013593505050565b60005b83811015610c42578181015183820152602001610c2a565b50506000910152565b6000610c59610aed84610ab7565b9050828152838383011115610c6d57600080fd5b610849836020830184610c27565b600080600060608486031215610c9057600080fd5b8351925060208401519150604084015167ffffffffffffffff811115610cb557600080fd5b8401601f81018613610cc657600080fd5b610cd586825160208401610c4b565b9150509250925092565b8051610cea81610b1d565b919050565b600060208284031215610d0157600080fd5b815167ffffffffffffffff80821115610d1957600080fd5b9083019060c08286031215610d2d57600080fd5b610d35610a5d565b82518152602083015160208201526040830151610d5181610b1d565b6040820152606083015182811115610d6857600080fd5b83019150601f82018613610d7b57600080fd5b610d8a86835160208501610c4b565b6060820152610d9b60808401610cdf565b6080820152610dac60a08401610cdf565b60a082015295945050505050565b634e487b7160e01b600052601160045260246000fd5b8181038181111561056d5761056d610dba565b8082018082111561056d5761056d610dba565b808202811582820484141761056d5761056d610dba565b600082610e2a57634e487b7160e01b600052601260045260246000fd5b500490565b600060208284031215610e4157600080fd5b815161084981610b1d565b600060208284031215610e5e57600080fd5b8151801515811461084957600080fd5b60008060408385031215610e8157600080fd5b8251610e8c81610b1d565b6020939093015192949293505050565b6020815260008251806020840152610ebb816040850160208701610c27565b601f01601f19169190910160400192915050565b60008251610ee1818460208701610c27565b919091019291505056fea264697066735822122051f1298ed073ff9642d2d30840aa36262f549e7791408793746d2129fb35b23364736f6c63430008150033";

type BlockSubscribeModuleConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: BlockSubscribeModuleConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class BlockSubscribeModule__factory extends ContractFactory {
  constructor(...args: BlockSubscribeModuleConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    dappTableRegistry: string,
    globalConfig: string,
    dataUnion: string,
    overrides?: Overrides & { from?: string }
  ): Promise<BlockSubscribeModule> {
    return super.deploy(
      dappTableRegistry,
      globalConfig,
      dataUnion,
      overrides || {}
    ) as Promise<BlockSubscribeModule>;
  }
  override getDeployTransaction(
    dappTableRegistry: string,
    globalConfig: string,
    dataUnion: string,
    overrides?: Overrides & { from?: string }
  ): TransactionRequest {
    return super.getDeployTransaction(
      dappTableRegistry,
      globalConfig,
      dataUnion,
      overrides || {}
    );
  }
  override attach(address: string): BlockSubscribeModule {
    return super.attach(address) as BlockSubscribeModule;
  }
  override connect(signer: Signer): BlockSubscribeModule__factory {
    return super.connect(signer) as BlockSubscribeModule__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BlockSubscribeModuleInterface {
    return new utils.Interface(_abi) as BlockSubscribeModuleInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BlockSubscribeModule {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as BlockSubscribeModule;
  }
}