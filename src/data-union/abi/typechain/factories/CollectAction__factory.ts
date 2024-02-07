/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { CollectAction, CollectActionInterface } from "../CollectAction";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "actionConfig",
        type: "address",
      },
      {
        internalType: "address",
        name: "monetizer",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "CollectModuleAlreadyRegistered",
    type: "error",
  },
  {
    inputs: [],
    name: "CollectModuleNotRegistered",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidMonetizer",
    type: "error",
  },
  {
    inputs: [],
    name: "NotCollectModule",
    type: "error",
  },
  {
    inputs: [],
    name: "ACTION_CONFIG",
    outputs: [
      {
        internalType: "contract ActionConfig",
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
    name: "getAssetCollectData",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "collectModule",
            type: "address",
          },
          {
            internalType: "address",
            name: "collectNFT",
            type: "address",
          },
        ],
        internalType: "struct CollectAction.CollectData",
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
    ],
    name: "getDappTreasuryData",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getProtocolTreasuryData",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
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
    name: "initializeAction",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isCollectModuleRegistered",
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
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "assetId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
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
  {
    inputs: [],
    name: "monetizer",
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
    name: "processAction",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collectModule",
        type: "address",
      },
    ],
    name: "registerCollectModule",
    outputs: [],
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
  "0x608060405234801561001057600080fd5b5060405161282938038061282983398101604081905261002f9161007c565b600080546001600160a01b039384166001600160a01b031991821617909155600180549290931691161790556100af565b80516001600160a01b038116811461007757600080fd5b919050565b6000806040838503121561008f57600080fd5b61009883610060565b91506100a660208401610060565b90509250929050565b61276b806100be6000396000f3fe608060405260043610620000a85760003560e01c80638e8b8c97116200006c5780638e8b8c97146200020f57806395197b511462000236578063ce79d4bd146200025b578063db86aeea1462000281578063dd4c9b4c1462000298578063f32ffcbc14620002bd57600080fd5b8062b2a76b14620000ad57806301ffc9a714620001445780633532d0e5146200017a57806369288f8314620001b257806379e5593614620001ed575b600080fd5b348015620000ba57600080fd5b5062000118620000cc36600462000959565b604080518082019091526000808252602082015250600090815260036020908152604091829020825180840190935280546001600160a01b039081168452600190910154169082015290565b6040805182516001600160a01b0390811682526020938401511692810192909252015b60405180910390f35b3480156200015157600080fd5b50620001696200016336600462000973565b620002f1565b60405190151581526020016200013b565b3480156200018757600080fd5b506200019262000329565b604080516001600160a01b0390931683526020830191909152016200013b565b348015620001bf57600080fd5b50600054620001d4906001600160a01b031681565b6040516001600160a01b0390911681526020016200013b565b348015620001fa57600080fd5b50600154620001d4906001600160a01b031681565b3480156200021c57600080fd5b50620002346200022e366004620009bf565b6200039e565b005b3480156200024357600080fd5b50620001926200025536600462000959565b6200048d565b620002726200026c36600462000a2b565b6200058e565b6040516200013b919062000ae1565b620002346200029236600462000af6565b62000780565b348015620002a557600080fd5b5062000169620002b736600462000b46565b62000887565b348015620002ca57600080fd5b5062000169620002dc366004620009bf565b60026020526000908152604090205460ff1681565b60006001600160e01b03198216631066d55960e11b14806200032357506301ffc9a760e01b6001600160e01b03198316145b92915050565b6000805460408051633532d0e560e01b8152815184936001600160a01b031692633532d0e592600480820193918290030181865afa15801562000370573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062000396919062000b79565b915091509091565b6001600160a01b03811660009081526002602052604090205460ff1615620003d9576040516361f25b1560e11b815260040160405180910390fd5b6040516301ffc9a760e01b815263ebe695f560e01b60048201526001600160a01b038216906301ffc9a790602401602060405180830381865afa15801562000425573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200044b919062000baa565b620004695760405163ceeb1f8f60e01b815260040160405180910390fd5b6001600160a01b03166000908152600260205260409020805460ff19166001179055565b60015460405163570fed0f60e01b815260048101839052600091829182916001600160a01b03169063570fed0f90602401600060405180830381865afa158015620004dc573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405262000506919081019062000d62565b6000548151604080840151905163221dee9160e21b81529394506001600160a01b0390921692638877ba449262000541929160040162000e43565b6040805180830381865afa1580156200055e573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062000584919062000b79565b9250925050915091565b6001546060906001600160a01b03163314620005bd57604051636a429a5960e01b815260040160405180910390fd5b6000858152600360205260409020600101546001600160a01b03166200063957604051620005eb906200094b565b604051809103906000f08015801562000608573d6000803e3d6000fd5b50600086815260036020526040902060010180546001600160a01b0319166001600160a01b03929092169190911790555b600085815260036020526040808220600101549051631f5dd69760e11b81526001600160a01b03878116600483015290911690633ebbad2e906024016020604051808303816000875af115801562000695573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620006bb919062000e67565b6000878152600360205260408082205490516385f4220f60e01b815292935090916001600160a01b03909116906385f4220f9062000704908a908a908a908a9060040162000e81565b6000604051808303816000875af115801562000724573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526200074e919081019062000ec8565b905081816040516020016200076592919062000f1e565b60405160208183030381529060405292505050949350505050565b6001546001600160a01b03163314620007ac57604051636a429a5960e01b815260040160405180910390fd5b600080620007bd8385018562000f39565b6001600160a01b038216600090815260026020526040902054919350915060ff16620007fc5760405163309d38b360e21b815260040160405180910390fd5b6000858152600360205260409081902080546001600160a01b0319166001600160a01b03851690811790915590516337095bfd60e11b8152636e12b7fa906200084c908890859060040162000f1e565b600060405180830381600087803b1580156200086757600080fd5b505af11580156200087c573d6000803e3d6000fd5b505050505050505050565b6000828152600360205260408120600101546001600160a01b0316620008b05750600062000323565b600083815260036020526040908190206001015490516370a0823160e01b81526001600160a01b038481166004830152909116906370a0823190602401602060405180830381865afa1580156200090b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062000931919062000e67565b600003620009425750600062000323565b50600192915050565b6117658062000fd183390190565b6000602082840312156200096c57600080fd5b5035919050565b6000602082840312156200098657600080fd5b81356001600160e01b0319811681146200099f57600080fd5b9392505050565b6001600160a01b0381168114620009bc57600080fd5b50565b600060208284031215620009d257600080fd5b81356200099f81620009a6565b60008083601f840112620009f257600080fd5b50813567ffffffffffffffff81111562000a0b57600080fd5b60208301915083602082850101111562000a2457600080fd5b9250929050565b6000806000806060858703121562000a4257600080fd5b84359350602085013562000a5681620009a6565b9250604085013567ffffffffffffffff81111562000a7357600080fd5b62000a8187828801620009df565b95989497509550505050565b60005b8381101562000aaa57818101518382015260200162000a90565b50506000910152565b6000815180845262000acd81602086016020860162000a8d565b601f01601f19169290920160200192915050565b6020815260006200099f602083018462000ab3565b60008060006040848603121562000b0c57600080fd5b83359250602084013567ffffffffffffffff81111562000b2b57600080fd5b62000b3986828701620009df565b9497909650939450505050565b6000806040838503121562000b5a57600080fd5b82359150602083013562000b6e81620009a6565b809150509250929050565b6000806040838503121562000b8d57600080fd5b825162000b9a81620009a6565b6020939093015192949293505050565b60006020828403121562000bbd57600080fd5b815180151581146200099f57600080fd5b634e487b7160e01b600052604160045260246000fd5b60405160c0810167ffffffffffffffff8111828210171562000c0a5762000c0a62000bce565b60405290565b604051601f8201601f1916810167ffffffffffffffff8111828210171562000c3c5762000c3c62000bce565b604052919050565b600067ffffffffffffffff82111562000c615762000c6162000bce565b50601f01601f191660200190565b600062000c8662000c808462000c44565b62000c10565b905082815283838301111562000c9b57600080fd5b6200099f83602083018462000a8d565b600082601f83011262000cbd57600080fd5b6200099f8383516020850162000c6f565b600082601f83011262000ce057600080fd5b8151602067ffffffffffffffff82111562000cff5762000cff62000bce565b8160051b62000d1082820162000c10565b928352848101820192828101908785111562000d2b57600080fd5b83870192505b8483101562000d5757825162000d4781620009a6565b8252918301919083019062000d31565b979650505050505050565b60006020828403121562000d7557600080fd5b815167ffffffffffffffff8082111562000d8e57600080fd5b9083019060c0828603121562000da357600080fd5b62000dad62000be4565b82518281111562000dbd57600080fd5b62000dcb8782860162000cab565b82525060208301518281111562000de157600080fd5b62000def8782860162000cab565b60208301525060408301516040820152606083015160608201526080830151608082015260a08301518281111562000e2657600080fd5b62000e348782860162000cce565b60a08301525095945050505050565b60408152600062000e58604083018562000ab3565b90508260208301529392505050565b60006020828403121562000e7a57600080fd5b5051919050565b8481526001600160a01b03841660208201526060604082018190528101829052818360808301376000818301608090810191909152601f909201601f191601019392505050565b60006020828403121562000edb57600080fd5b815167ffffffffffffffff81111562000ef357600080fd5b8201601f8101841362000f0557600080fd5b62000f168482516020840162000c6f565b949350505050565b82815260406020820152600062000f16604083018462000ab3565b6000806040838503121562000f4d57600080fd5b823562000f5a81620009a6565b9150602083013567ffffffffffffffff81111562000f7757600080fd5b8301601f8101851362000f8957600080fd5b803562000f9a62000c808262000c44565b81815286602083850101111562000fb057600080fd5b81602084016020830137600060208383010152809350505050925092905056fe60806040526000600b553480156200001657600080fd5b50604080518082018252600b81526a10dbdb1b1958dd0813919560aa1b6020808301919091528251808401909352600283526121a760f11b908301529033806200007a57604051631e4fbdf760e01b81526000600482015260240160405180910390fd5b6200008581620000ac565b506001620000948382620001a1565b506002620000a38282620001a1565b5050506200026d565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b634e487b7160e01b600052604160045260246000fd5b600181811c908216806200012757607f821691505b6020821081036200014857634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200019c57600081815260208120601f850160051c81016020861015620001775750805b601f850160051c820191505b81811015620001985782815560010162000183565b5050505b505050565b81516001600160401b03811115620001bd57620001bd620000fc565b620001d581620001ce845462000112565b846200014e565b602080601f8311600181146200020d5760008415620001f45750858301515b600019600386901b1c1916600185901b17855562000198565b600085815260208120601f198616915b828110156200023e578886015182559484019460019091019084016200021d565b50858210156200025d5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b6114e8806200027d6000396000f3fe608060405234801561001057600080fd5b506004361061012c5760003560e01c80636352211e116100ad578063a22cb46511610071578063a22cb46514610266578063b88d4fde14610279578063c87b56dd1461028c578063e985e9c51461029f578063f2fde38b146102b257600080fd5b80636352211e1461021f57806370a0823114610232578063715018a6146102455780638da5cb5b1461024d57806395d89b411461025e57600080fd5b806323b872dd116100f457806323b872dd146101c05780632f745c59146101d35780633ebbad2e146101e657806342842e0e146101f95780634f6ccce71461020c57600080fd5b806301ffc9a71461013157806306fdde0314610159578063081812fc1461016e578063095ea7b31461019957806318160ddd146101ae575b600080fd5b61014461013f3660046110ef565b6102c5565b60405190151581526020015b60405180910390f35b6101616102f0565b604051610150919061115c565b61018161017c36600461116f565b610382565b6040516001600160a01b039091168152602001610150565b6101ac6101a736600461119f565b6103ab565b005b6009545b604051908152602001610150565b6101ac6101ce3660046111c9565b6103ba565b6101b26101e136600461119f565b61044a565b6101b26101f4366004611205565b6104af565b6101ac6102073660046111c9565b6104e0565b6101b261021a36600461116f565b610500565b61018161022d36600461116f565b610559565b6101b2610240366004611205565b610564565b6101ac6105ac565b6000546001600160a01b0316610181565b6101616105c0565b6101ac610274366004611220565b6105cf565b6101ac610287366004611272565b6105da565b61016161029a36600461116f565b6105f1565b6101446102ad36600461134e565b610666565b6101ac6102c0366004611205565b610694565b60006001600160e01b0319821663780e9d6360e01b14806102ea57506102ea826106d2565b92915050565b6060600180546102ff90611381565b80601f016020809104026020016040519081016040528092919081815260200182805461032b90611381565b80156103785780601f1061034d57610100808354040283529160200191610378565b820191906000526020600020905b81548152906001019060200180831161035b57829003601f168201915b5050505050905090565b600061038d82610722565b506000828152600560205260409020546001600160a01b03166102ea565b6103b682823361075b565b5050565b6001600160a01b0382166103e957604051633250574960e11b8152600060048201526024015b60405180910390fd5b60006103f6838333610768565b9050836001600160a01b0316816001600160a01b031614610444576040516364283d7b60e01b81526001600160a01b03808616600483015260248201849052821660448201526064016103e0565b50505050565b600061045583610564565b82106104865760405163295f44f760e21b81526001600160a01b0384166004820152602481018390526044016103e0565b506001600160a01b03919091166000908152600760209081526040808320938352929052205490565b60006104b961083d565b50600b8054906104db908390839060006104d2836113d1565b9190505561086a565b919050565b6104fb838383604051806020016040528060008152506105da565b505050565b600061050b60095490565b82106105345760405163295f44f760e21b815260006004820152602481018390526044016103e0565b60098281548110610547576105476113ea565b90600052602060002001549050919050565b60006102ea82610722565b60006001600160a01b038216610590576040516322718ad960e21b8152600060048201526024016103e0565b506001600160a01b031660009081526004602052604090205490565b6105b461083d565b6105be6000610884565b565b6060600280546102ff90611381565b6103b63383836108d4565b6105e58484846103ba565b61044484848484610973565b60606105fc82610722565b50600061061460408051602081019091526000815290565b90506000815111610634576040518060200160405280600081525061065f565b8061063e84610a9c565b60405160200161064f929190611400565b6040516020818303038152906040525b9392505050565b6001600160a01b03918216600090815260066020908152604080832093909416825291909152205460ff1690565b61069c61083d565b6001600160a01b0381166106c657604051631e4fbdf760e01b8152600060048201526024016103e0565b6106cf81610884565b50565b60006001600160e01b031982166380ac58cd60e01b148061070357506001600160e01b03198216635b5e139f60e01b145b806102ea57506301ffc9a760e01b6001600160e01b03198316146102ea565b6000818152600360205260408120546001600160a01b0316806102ea57604051637e27328960e01b8152600481018490526024016103e0565b6104fb8383836001610b2f565b600080610776858585610c35565b90506001600160a01b0381166107d3576107ce84600980546000838152600a60205260408120829055600182018355919091527f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af0155565b6107f6565b846001600160a01b0316816001600160a01b0316146107f6576107f68185610d2e565b6001600160a01b0385166108125761080d84610dbf565b610835565b846001600160a01b0316816001600160a01b031614610835576108358585610e6e565b949350505050565b6000546001600160a01b031633146105be5760405163118cdaa760e01b81523360048201526024016103e0565b6103b6828260405180602001604052806000815250610ebe565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b03821661090657604051630b61174360e31b81526001600160a01b03831660048201526024016103e0565b6001600160a01b03838116600081815260066020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6001600160a01b0383163b1561044457604051630a85bd0160e11b81526001600160a01b0384169063150b7a02906109b590339088908790879060040161142f565b6020604051808303816000875af19250505080156109f0575060408051601f3d908101601f191682019092526109ed9181019061146c565b60015b610a59573d808015610a1e576040519150601f19603f3d011682016040523d82523d6000602084013e610a23565b606091505b508051600003610a5157604051633250574960e11b81526001600160a01b03851660048201526024016103e0565b805181602001fd5b6001600160e01b03198116630a85bd0160e11b14610a9557604051633250574960e11b81526001600160a01b03851660048201526024016103e0565b5050505050565b60606000610aa983610ed5565b600101905060008167ffffffffffffffff811115610ac957610ac961125c565b6040519080825280601f01601f191660200182016040528015610af3576020820181803683370190505b5090508181016020015b600019016f181899199a1a9b1b9c1cb0b131b232b360811b600a86061a8153600a8504945084610afd57509392505050565b8080610b4357506001600160a01b03821615155b15610c05576000610b5384610722565b90506001600160a01b03831615801590610b7f5750826001600160a01b0316816001600160a01b031614155b8015610b925750610b908184610666565b155b15610bbb5760405163a9fbf51f60e01b81526001600160a01b03841660048201526024016103e0565b8115610c035783856001600160a01b0316826001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45b505b5050600090815260056020526040902080546001600160a01b0319166001600160a01b0392909216919091179055565b6000828152600360205260408120546001600160a01b0390811690831615610c6257610c62818486610fad565b6001600160a01b03811615610ca057610c7f600085600080610b2f565b6001600160a01b038116600090815260046020526040902080546000190190555b6001600160a01b03851615610ccf576001600160a01b0385166000908152600460205260409020805460010190555b60008481526003602052604080822080546001600160a01b0319166001600160a01b0389811691821790925591518793918516917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4949350505050565b6000610d3983610564565b600083815260086020526040902054909150808214610d8c576001600160a01b03841660009081526007602090815260408083208584528252808320548484528184208190558352600890915290208190555b5060009182526008602090815260408084208490556001600160a01b039094168352600781528383209183525290812055565b600954600090610dd190600190611489565b6000838152600a602052604081205460098054939450909284908110610df957610df96113ea565b906000526020600020015490508060098381548110610e1a57610e1a6113ea565b6000918252602080832090910192909255828152600a90915260408082208490558582528120556009805480610e5257610e5261149c565b6001900381819060005260206000200160009055905550505050565b60006001610e7b84610564565b610e859190611489565b6001600160a01b039093166000908152600760209081526040808320868452825280832085905593825260089052919091209190915550565b610ec88383611011565b6104fb6000848484610973565b60008072184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b8310610f145772184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b830492506040015b6d04ee2d6d415b85acef81000000008310610f40576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc100008310610f5e57662386f26fc10000830492506010015b6305f5e1008310610f76576305f5e100830492506008015b6127108310610f8a57612710830492506004015b60648310610f9c576064830492506002015b600a83106102ea5760010192915050565b610fb8838383611076565b6104fb576001600160a01b038316610fe657604051637e27328960e01b8152600481018290526024016103e0565b60405163177e802f60e01b81526001600160a01b0383166004820152602481018290526044016103e0565b6001600160a01b03821661103b57604051633250574960e11b8152600060048201526024016103e0565b600061104983836000610768565b90506001600160a01b038116156104fb576040516339e3563760e11b8152600060048201526024016103e0565b60006001600160a01b038316158015906108355750826001600160a01b0316846001600160a01b031614806110b057506110b08484610666565b806108355750506000908152600560205260409020546001600160a01b03908116911614919050565b6001600160e01b0319811681146106cf57600080fd5b60006020828403121561110157600080fd5b813561065f816110d9565b60005b8381101561112757818101518382015260200161110f565b50506000910152565b6000815180845261114881602086016020860161110c565b601f01601f19169290920160200192915050565b60208152600061065f6020830184611130565b60006020828403121561118157600080fd5b5035919050565b80356001600160a01b03811681146104db57600080fd5b600080604083850312156111b257600080fd5b6111bb83611188565b946020939093013593505050565b6000806000606084860312156111de57600080fd5b6111e784611188565b92506111f560208501611188565b9150604084013590509250925092565b60006020828403121561121757600080fd5b61065f82611188565b6000806040838503121561123357600080fd5b61123c83611188565b91506020830135801515811461125157600080fd5b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b6000806000806080858703121561128857600080fd5b61129185611188565b935061129f60208601611188565b925060408501359150606085013567ffffffffffffffff808211156112c357600080fd5b818701915087601f8301126112d757600080fd5b8135818111156112e9576112e961125c565b604051601f8201601f19908116603f011681019083821181831017156113115761131161125c565b816040528281528a602084870101111561132a57600080fd5b82602086016020830137600060208483010152809550505050505092959194509250565b6000806040838503121561136157600080fd5b61136a83611188565b915061137860208401611188565b90509250929050565b600181811c9082168061139557607f821691505b6020821081036113b557634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b6000600182016113e3576113e36113bb565b5060010190565b634e487b7160e01b600052603260045260246000fd5b6000835161141281846020880161110c565b83519083019061142681836020880161110c565b01949350505050565b6001600160a01b038581168252841660208201526040810183905260806060820181905260009061146290830184611130565b9695505050505050565b60006020828403121561147e57600080fd5b815161065f816110d9565b818103818111156102ea576102ea6113bb565b634e487b7160e01b600052603160045260246000fdfea26469706673582212205e970228c792325732c4ab9f1f727b332dd1a25e76bb5b4378cd1c6ff6b8226164736f6c63430008150033a264697066735822122035d70c57dcb0066edf195e98fac70a6cbda3286416ef809ef83a5b8370e0cdd964736f6c63430008150033";

type CollectActionConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CollectActionConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CollectAction__factory extends ContractFactory {
  constructor(...args: CollectActionConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    actionConfig: string,
    monetizer: string,
    overrides?: Overrides & { from?: string }
  ): Promise<CollectAction> {
    return super.deploy(
      actionConfig,
      monetizer,
      overrides || {}
    ) as Promise<CollectAction>;
  }
  override getDeployTransaction(
    actionConfig: string,
    monetizer: string,
    overrides?: Overrides & { from?: string }
  ): TransactionRequest {
    return super.getDeployTransaction(actionConfig, monetizer, overrides || {});
  }
  override attach(address: string): CollectAction {
    return super.attach(address) as CollectAction;
  }
  override connect(signer: Signer): CollectAction__factory {
    return super.connect(signer) as CollectAction__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CollectActionInterface {
    return new utils.Interface(_abi) as CollectActionInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CollectAction {
    return new Contract(address, _abi, signerOrProvider) as CollectAction;
  }
}
