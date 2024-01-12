/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  TimeSegmentSubscribeModule,
  TimeSegmentSubscribeModuleInterface,
} from "../TimeSegmentSubscribeModule";

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
          {
            internalType: "uint256",
            name: "segment",
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
  "0x60e060405234801561001057600080fd5b5060405161107238038061107283398101604081905261002f91610068565b6001600160a01b0392831660805290821660a0521660c0526100ab565b80516001600160a01b038116811461006357600080fd5b919050565b60008060006060848603121561007d57600080fd5b6100868461004c565b92506100946020850161004c565b91506100a26040850161004c565b90509250925092565b60805160a05160c051610f7d6100f56000396000818160d1015281816101aa0152818161026d015261042a015260008181610553015261062c015260006107180152610f7d6000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806369f577d9146100465780638f56a8791461005b578063a982469314610088575b600080fd5b610059610054366004610a1e565b6100c6565b005b61006e610069366004610b88565b61019c565b604080519283526020830191909152015b60405180910390f35b61009b610096366004610c35565b6104c4565b6040805182516001600160a01b0316815260208084015190820152918101519082015260600161007f565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461010f57604051630144f50b60e11b815260040160405180910390fd5b6000808061011f84860186610c4e565b92509250925061012e83610531565b1580610138575081155b80610141575080155b1561015f57604051630a5addd160e21b815260040160405180910390fd5b60009586526020869052604090952080546001600160a01b0319166001600160a01b03939093169290921782556001820155600201929092555050565b600080336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146101e857604051630144f50b60e11b815260040160405180910390fd5b600086815260208181526040808320815160608101835281546001600160a01b031681526001820154818501526002909101549181019190915285519092918291829161023b9189018101908901610cd7565b92509250925061025481856000015186602001516105c6565b604051633131b3ad60e11b8152600481018b90526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690636263675a90602401600060405180830381865afa1580156102bc573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526102e49190810190610d4b565b905060008560400151846102f89190610e2c565b6103029086610e43565b90508315806103145750816020015181115b8061031f5750815185105b1561033d57604051631020ebb760e11b815260040160405180910390fd5b600084876020015161034f9190610e2c565b905060008061035c610627565b909250905060006127106103708386610e2c565b61037a9190610e56565b905080156103a6578951610399906001600160a01b03168f85846106b3565b6103a38185610e78565b93505b5050506000806103b58e610713565b909250905060006127106103c98386610e2c565b6103d39190610e56565b905080156103ff5789516103f2906001600160a01b03168f85846106b3565b6103fc8185610e78565b93505b5050811590506104b15760405163b8fd6d5160e01b8152600481018e90526000906001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063b8fd6d5190602401602060405180830381865afa158015610471573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104959190610e8b565b88519091506104af906001600160a01b03168d83856106b3565b505b50939b939a509298505050505050505050565b6104f1604051806060016040528060006001600160a01b0316815260200160008152602001600081525090565b5060009081526020818152604091829020825160608101845281546001600160a01b03168152600182015492810192909252600201549181019190915290565b60405163a192c51d60e01b81526001600160a01b0382811660048301526000917f00000000000000000000000000000000000000000000000000000000000000009091169063a192c51d90602401602060405180830381865afa15801561059c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105c09190610ea8565b92915050565b600080848060200190518101906105dd9190610eca565b9150915082811415806106025750836001600160a01b0316826001600160a01b031614155b15610620576040516346308bd560e01b815260040160405180910390fd5b5050505050565b6000807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166398f965d16040518163ffffffff1660e01b81526004016040805180830381865afa158015610687573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106ab9190610eca565b915091509091565b604080516001600160a01b0385811660248301528416604482015260648082018490528251808303909101815260849091019091526020810180516001600160e01b03166323b872dd60e01b17905261070d9085906107ab565b50505050565b6000807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316639d96f1c4846040518263ffffffff1660e01b81526004016107629190610ef8565b6040805180830381865afa15801561077e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107a29190610eca565b91509150915091565b6000610800826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b031661088a9092919063ffffffff16565b90508051600014806108215750808060200190518101906108219190610ea8565b6108855760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084015b60405180910390fd5b505050565b606061089984846000856108a3565b90505b9392505050565b6060824710156109045760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b606482015260840161087c565b600080866001600160a01b031685876040516109209190610f2b565b60006040518083038185875af1925050503d806000811461095d576040519150601f19603f3d011682016040523d82523d6000602084013e610962565b606091505b509150915061097387838387610980565b925050505b949350505050565b606083156109ef5782516000036109e8576001600160a01b0385163b6109e85760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015260640161087c565b5081610978565b6109788383815115610a045781518083602001fd5b8060405162461bcd60e51b815260040161087c9190610ef8565b600080600060408486031215610a3357600080fd5b83359250602084013567ffffffffffffffff80821115610a5257600080fd5b818601915086601f830112610a6657600080fd5b813581811115610a7557600080fd5b876020828501011115610a8757600080fd5b6020830194508093505050509250925092565b634e487b7160e01b600052604160045260246000fd5b60405160c0810167ffffffffffffffff81118282101715610ad357610ad3610a9a565b60405290565b604051601f8201601f1916810167ffffffffffffffff81118282101715610b0257610b02610a9a565b604052919050565b600067ffffffffffffffff821115610b2457610b24610a9a565b50601f01601f191660200190565b6000610b45610b4084610b0a565b610ad9565b9050828152838383011115610b5957600080fd5b828260208301376000602084830101529392505050565b6001600160a01b0381168114610b8557600080fd5b50565b60008060008060808587031215610b9e57600080fd5b84359350602085013567ffffffffffffffff80821115610bbd57600080fd5b818701915087601f830112610bd157600080fd5b610be088833560208501610b32565b945060408701359150610bf282610b70565b90925060608601359080821115610c0857600080fd5b508501601f81018713610c1a57600080fd5b610c2987823560208401610b32565b91505092959194509250565b600060208284031215610c4757600080fd5b5035919050565b600080600060608486031215610c6357600080fd5b8335610c6e81610b70565b95602085013595506040909401359392505050565b60005b83811015610c9e578181015183820152602001610c86565b50506000910152565b6000610cb5610b4084610b0a565b9050828152838383011115610cc957600080fd5b61089c836020830184610c83565b600080600060608486031215610cec57600080fd5b8351925060208401519150604084015167ffffffffffffffff811115610d1157600080fd5b8401601f81018613610d2257600080fd5b610d3186825160208401610ca7565b9150509250925092565b8051610d4681610b70565b919050565b600060208284031215610d5d57600080fd5b815167ffffffffffffffff80821115610d7557600080fd5b9083019060c08286031215610d8957600080fd5b610d91610ab0565b82518152602083015160208201526040830151610dad81610b70565b6040820152606083015182811115610dc457600080fd5b83019150601f82018613610dd757600080fd5b610de686835160208501610ca7565b6060820152610df760808401610d3b565b6080820152610e0860a08401610d3b565b60a082015295945050505050565b634e487b7160e01b600052601160045260246000fd5b80820281158282048414176105c0576105c0610e16565b808201808211156105c0576105c0610e16565b600082610e7357634e487b7160e01b600052601260045260246000fd5b500490565b818103818111156105c0576105c0610e16565b600060208284031215610e9d57600080fd5b815161089c81610b70565b600060208284031215610eba57600080fd5b8151801515811461089c57600080fd5b60008060408385031215610edd57600080fd5b8251610ee881610b70565b6020939093015192949293505050565b6020815260008251806020840152610f17816040850160208701610c83565b601f01601f19169190910160400192915050565b60008251610f3d818460208701610c83565b919091019291505056fea264697066735822122082cb1595ce1e405c5f7317a7f258a23393cc23b41e25a1a5a8a47e948501e7ae64736f6c63430008150033";

type TimeSegmentSubscribeModuleConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TimeSegmentSubscribeModuleConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TimeSegmentSubscribeModule__factory extends ContractFactory {
  constructor(...args: TimeSegmentSubscribeModuleConstructorParams) {
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
  ): Promise<TimeSegmentSubscribeModule> {
    return super.deploy(
      dappTableRegistry,
      globalConfig,
      dataUnion,
      overrides || {}
    ) as Promise<TimeSegmentSubscribeModule>;
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
  override attach(address: string): TimeSegmentSubscribeModule {
    return super.attach(address) as TimeSegmentSubscribeModule;
  }
  override connect(signer: Signer): TimeSegmentSubscribeModule__factory {
    return super.connect(signer) as TimeSegmentSubscribeModule__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TimeSegmentSubscribeModuleInterface {
    return new utils.Interface(_abi) as TimeSegmentSubscribeModuleInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TimeSegmentSubscribeModule {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as TimeSegmentSubscribeModule;
  }
}
