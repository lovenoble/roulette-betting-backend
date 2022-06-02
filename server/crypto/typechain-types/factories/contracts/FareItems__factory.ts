/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { FareItems, FareItemsInterface } from "../../contracts/FareItems";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "baseURL",
        type: "string",
      },
      {
        internalType: "address",
        name: "_controllerAddress",
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
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "URI",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "balanceOf",
    outputs: [
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
        internalType: "address[]",
        name: "accounts",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "burnBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "controllerAddress",
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
        name: "_quantity",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_metadata",
        type: "bytes",
      },
    ],
    name: "createItemToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "exists",
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
    name: "getLatestItemId",
    outputs: [
      {
        internalType: "uint256",
        name: "latestItemId",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
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
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "mintBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "newuri",
        type: "string",
      },
    ],
    name: "setURI",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "totalSupply",
    outputs: [
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
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "uri",
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
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162002ca238038062002ca2833981016040819052620000349162000736565b816200004081620000d2565b506200004c33620000eb565b62000097336200006860056200013d60201b620009651760201c565b60408051808201909152600f81526e47656e65736973204e6f204974656d60881b602082015260019062000141565b600680546001600160a01b0319166001600160a01b038316179055620000ca600562000268602090811b6200096917901c565b505062000a21565b8051620000e790600290602084019062000618565b5050565b600380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b5490565b6001600160a01b038416620001a75760405162461bcd60e51b815260206004820152602160248201527f455243313135353a206d696e7420746f20746865207a65726f206164647265736044820152607360f81b60648201526084015b60405180910390fd5b33620001cd81600087620001bb8862000271565b620001c68862000271565b87620002bf565b6000848152602081815260408083206001600160a01b038916845290915281208054859290620001ff90849062000812565b909155505060408051858152602081018590526001600160a01b0380881692600092918516917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a46200026181600087878787620002e2565b5050505050565b80546001019055565b60408051600180825281830190925260609160009190602080830190803683370190505090508281600081518110620002ae57620002ae6200082d565b602090810291909101015292915050565b620002da868686868686620004c860201b620009721760201c565b505050505050565b62000301846001600160a01b03166200060960201b62000a881760201c565b15620002da5760405163f23a6e6160e01b81526001600160a01b0385169063f23a6e61906200033d908990899088908890889060040162000871565b602060405180830381600087803b1580156200035857600080fd5b505af19250505080156200038b575060408051601f3d908101601f191682019092526200038891810190620008b8565b60015b6200044c576200039a620008eb565b806308c379a01415620003db5750620003b262000908565b80620003bf5750620003dd565b8060405162461bcd60e51b81526004016200019e919062000997565b505b60405162461bcd60e51b815260206004820152603460248201527f455243313135353a207472616e7366657220746f206e6f6e204552433131353560448201527f526563656976657220696d706c656d656e74657200000000000000000000000060648201526084016200019e565b6001600160e01b0319811663f23a6e6160e01b14620004bf5760405162461bcd60e51b815260206004820152602860248201527f455243313135353a204552433131353552656365697665722072656a656374656044820152676420746f6b656e7360c01b60648201526084016200019e565b50505050505050565b620004e3868686868686620002da60201b62000a801760201c565b6001600160a01b038516620005775760005b835181101562000575578281815181106200051457620005146200082d565b6020026020010151600460008684815181106200053557620005356200082d565b6020026020010151815260200190815260200160002060008282546200055c919062000812565b909155506200056d905081620009ac565b9050620004f5565b505b6001600160a01b038416620002da5760005b8351811015620004bf57828181518110620005a857620005a86200082d565b602002602001015160046000868481518110620005c957620005c96200082d565b602002602001015181526020019081526020016000206000828254620005f09190620009ca565b9091555062000601905081620009ac565b905062000589565b6001600160a01b03163b151590565b8280546200062690620009e4565b90600052602060002090601f0160209004810192826200064a576000855562000695565b82601f106200066557805160ff191683800117855562000695565b8280016001018555821562000695579182015b828111156200069557825182559160200191906001019062000678565b50620006a3929150620006a7565b5090565b5b80821115620006a35760008155600101620006a8565b634e487b7160e01b600052604160045260246000fd5b601f8201601f191681016001600160401b0381118282101715620006fc57620006fc620006be565b6040525050565b60005b838110156200072057818101518382015260200162000706565b8381111562000730576000848401525b50505050565b600080604083850312156200074a57600080fd5b82516001600160401b03808211156200076257600080fd5b818501915085601f8301126200077757600080fd5b8151818111156200078c576200078c620006be565b6040519150620007a7601f8201601f191660200183620006d4565b808252866020828501011115620007bd57600080fd5b620007d081602084016020860162000703565b50602085015190935090506001600160a01b0381168114620007f157600080fd5b809150509250929050565b634e487b7160e01b600052601160045260246000fd5b60008219821115620008285762000828620007fc565b500190565b634e487b7160e01b600052603260045260246000fd5b600081518084526200085d81602086016020860162000703565b601f01601f19169290920160200192915050565b6001600160a01b03868116825285166020820152604081018490526060810183905260a060808201819052600090620008ad9083018462000843565b979650505050505050565b600060208284031215620008cb57600080fd5b81516001600160e01b031981168114620008e457600080fd5b9392505050565b600060033d1115620009055760046000803e5060005160e01c5b90565b600060443d1015620009175790565b6040516003193d81016004833e81513d6001600160401b0380831160248401831017156200094757505050505090565b8285019150815181811115620009605750505050505090565b843d87010160208285010111156200097b5750505050505090565b6200098c60208286010187620006d4565b509095945050505050565b602081526000620008e4602083018462000843565b6000600019821415620009c357620009c3620007fc565b5060010190565b600082821015620009df57620009df620007fc565b500390565b600181811c90821680620009f957607f821691505b6020821081141562000a1b57634e487b7160e01b600052602260045260246000fd5b50919050565b6122718062000a316000396000f3fe608060405234801561001057600080fd5b50600436106101365760003560e01c8063715018a6116100b8578063bd85b0391161007c578063bd85b039146102b1578063c1d2d3b7146102d1578063e985e9c5146102d9578063f242432a14610315578063f2fde38b14610328578063f5298aca1461033b57600080fd5b8063715018a61461025f578063731133e91461026757806380e846fe1461027a5780638da5cb5b1461028d578063a22cb4651461029e57600080fd5b80632eb2c2d6116100ff5780632eb2c2d6146101cc5780634b24ea47146101df5780634e1273f41461020a5780634f558e791461022a5780636b20c4541461024c57600080fd5b8062fdd58e1461013b57806301ffc9a71461016157806302fe5305146101845780630e89341c146101995780631f7fdffa146101b9575b600080fd5b61014e610149366004611695565b61034e565b6040519081526020015b60405180910390f35b61017461016f3660046116d5565b6103e5565b6040519015158152602001610158565b610197610192366004611798565b610437565b005b6101ac6101a73660046117e8565b61046d565b604051610158919061184e565b6101976101c7366004611915565b610501565b6101976101da3660046119ad565b610566565b6006546101f2906001600160a01b031681565b6040516001600160a01b039091168152602001610158565b61021d610218366004611a56565b6105fd565b6040516101589190611b5b565b6101746102383660046117e8565b600090815260046020526040902054151590565b61019761025a366004611b6e565b610726565b61019761076e565b610197610275366004611be1565b6107a4565b610197610288366004611c35565b6107da565b6003546001600160a01b03166101f2565b6101976102ac366004611c71565b61082a565b61014e6102bf3660046117e8565b60009081526004602052604090205490565b61014e610835565b6101746102e7366004611cad565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205460ff1690565b610197610323366004611ce0565b610845565b610197610336366004611d44565b61088a565b610197610349366004611d5f565b610922565b60006001600160a01b0383166103bf5760405162461bcd60e51b815260206004820152602b60248201527f455243313135353a2062616c616e636520717565727920666f7220746865207a60448201526a65726f206164647265737360a81b60648201526084015b60405180910390fd5b506000908152602081815260408083206001600160a01b03949094168352929052205490565b60006001600160e01b03198216636cdb3d1360e11b148061041657506001600160e01b031982166303a24d0760e21b145b8061043157506301ffc9a760e01b6001600160e01b03198316145b92915050565b6003546001600160a01b031633146104615760405162461bcd60e51b81526004016103b690611d92565b61046a81610a97565b50565b60606002805461047c90611dc7565b80601f01602080910402602001604051908101604052809291908181526020018280546104a890611dc7565b80156104f55780601f106104ca576101008083540402835291602001916104f5565b820191906000526020600020905b8154815290600101906020018083116104d857829003601f168201915b50505050509050919050565b6006546001600160a01b031633146105545760405162461bcd60e51b81526020600482015260166024820152754e6f7420636f6e74726f6c6c6572206164647265737360501b60448201526064016103b6565b61056084848484610aaa565b50505050565b6001600160a01b038516331480610582575061058285336102e7565b6105e95760405162461bcd60e51b815260206004820152603260248201527f455243313135353a207472616e736665722063616c6c6572206973206e6f74206044820152711bdddb995c881b9bdc88185c1c1c9bdd995960721b60648201526084016103b6565b6105f68585858585610c04565b5050505050565b606081518351146106625760405162461bcd60e51b815260206004820152602960248201527f455243313135353a206163636f756e747320616e6420696473206c656e677468604482015268040dad2e6dac2e8c6d60bb1b60648201526084016103b6565b600083516001600160401b0381111561067d5761067d6116f9565b6040519080825280602002602001820160405280156106a6578160200160208202803683370190505b50905060005b845181101561071e576106f18582815181106106ca576106ca611e02565b60200260200101518583815181106106e4576106e4611e02565b602002602001015161034e565b82828151811061070357610703611e02565b602090810291909101015261071781611e2e565b90506106ac565b509392505050565b6001600160a01b038316331480610742575061074283336102e7565b61075e5760405162461bcd60e51b81526004016103b690611e49565b610769838383610da6565b505050565b6003546001600160a01b031633146107985760405162461bcd60e51b81526004016103b690611d92565b6107a26000610f34565b565b6003546001600160a01b031633146107ce5760405162461bcd60e51b81526004016103b690611d92565b61056084848484610f86565b6003546001600160a01b031633146108045760405162461bcd60e51b81526004016103b690611d92565b6108183361081160055490565b8484610f86565b610826600580546001019055565b5050565b61082633838361105c565b600061084060055490565b905090565b6001600160a01b038516331480610861575061086185336102e7565b61087d5760405162461bcd60e51b81526004016103b690611e49565b6105f6858585858561113d565b6003546001600160a01b031633146108b45760405162461bcd60e51b81526004016103b690611d92565b6001600160a01b0381166109195760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016103b6565b61046a81610f34565b6001600160a01b03831633148061093e575061093e83336102e7565b61095a5760405162461bcd60e51b81526004016103b690611e49565b610769838383611251565b5490565b80546001019055565b6001600160a01b0385166109f95760005b83518110156109f75782818151811061099e5761099e611e02565b6020026020010151600460008684815181106109bc576109bc611e02565b6020026020010151815260200190815260200160002060008282546109e19190611e92565b909155506109f0905081611e2e565b9050610983565b505b6001600160a01b038416610a805760005b8351811015610a7e57828181518110610a2557610a25611e02565b602002602001015160046000868481518110610a4357610a43611e02565b602002602001015181526020019081526020016000206000828254610a689190611eaa565b90915550610a77905081611e2e565b9050610a0a565b505b505050505050565b6001600160a01b03163b151590565b80516108269060029060208401906115e0565b6001600160a01b038416610ad05760405162461bcd60e51b81526004016103b690611ec1565b8151835114610af15760405162461bcd60e51b81526004016103b690611f02565b33610b0181600087878787611352565b60005b8451811015610b9c57838181518110610b1f57610b1f611e02565b6020026020010151600080878481518110610b3c57610b3c611e02565b602002602001015181526020019081526020016000206000886001600160a01b03166001600160a01b031681526020019081526020016000206000828254610b849190611e92565b90915550819050610b9481611e2e565b915050610b04565b50846001600160a01b031660006001600160a01b0316826001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8787604051610bed929190611f4a565b60405180910390a46105f681600087878787611360565b8151835114610c255760405162461bcd60e51b81526004016103b690611f02565b6001600160a01b038416610c4b5760405162461bcd60e51b81526004016103b690611f78565b33610c5a818787878787611352565b60005b8451811015610d40576000858281518110610c7a57610c7a611e02565b602002602001015190506000858381518110610c9857610c98611e02565b602090810291909101810151600084815280835260408082206001600160a01b038e168352909352919091205490915081811015610ce85760405162461bcd60e51b81526004016103b690611fbd565b6000838152602081815260408083206001600160a01b038e8116855292528083208585039055908b16825281208054849290610d25908490611e92565b9250508190555050505080610d3990611e2e565b9050610c5d565b50846001600160a01b0316866001600160a01b0316826001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8787604051610d90929190611f4a565b60405180910390a4610a80818787878787611360565b6001600160a01b038316610dcc5760405162461bcd60e51b81526004016103b690612007565b8051825114610ded5760405162461bcd60e51b81526004016103b690611f02565b6000339050610e1081856000868660405180602001604052806000815250611352565b60005b8351811015610ed5576000848281518110610e3057610e30611e02565b602002602001015190506000848381518110610e4e57610e4e611e02565b602090810291909101810151600084815280835260408082206001600160a01b038c168352909352919091205490915081811015610e9e5760405162461bcd60e51b81526004016103b69061204a565b6000928352602083815260408085206001600160a01b038b1686529091529092209103905580610ecd81611e2e565b915050610e13565b5060006001600160a01b0316846001600160a01b0316826001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8686604051610f26929190611f4a565b60405180910390a450505050565b600380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6001600160a01b038416610fac5760405162461bcd60e51b81526004016103b690611ec1565b33610fcc81600087610fbd886114cb565b610fc6886114cb565b87611352565b6000848152602081815260408083206001600160a01b038916845290915281208054859290610ffc908490611e92565b909155505060408051858152602081018590526001600160a01b0380881692600092918516917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a46105f681600087878787611516565b816001600160a01b0316836001600160a01b031614156110d05760405162461bcd60e51b815260206004820152602960248201527f455243313135353a2073657474696e6720617070726f76616c20737461747573604482015268103337b91039b2b63360b91b60648201526084016103b6565b6001600160a01b03838116600081815260016020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6001600160a01b0384166111635760405162461bcd60e51b81526004016103b690611f78565b33611173818787610fbd886114cb565b6000848152602081815260408083206001600160a01b038a168452909152902054838110156111b45760405162461bcd60e51b81526004016103b690611fbd565b6000858152602081815260408083206001600160a01b038b81168552925280832087850390559088168252812080548692906111f1908490611e92565b909155505060408051868152602081018690526001600160a01b03808916928a821692918616917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a4610a7e828888888888611516565b6001600160a01b0383166112775760405162461bcd60e51b81526004016103b690612007565b336112a681856000611288876114cb565b611291876114cb565b60405180602001604052806000815250611352565b6000838152602081815260408083206001600160a01b0388168452909152902054828110156112e75760405162461bcd60e51b81526004016103b69061204a565b6000848152602081815260408083206001600160a01b03898116808652918452828520888703905582518981529384018890529092908616917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a45050505050565b610a80868686868686610972565b6001600160a01b0384163b15610a805760405163bc197c8160e01b81526001600160a01b0385169063bc197c81906113a4908990899088908890889060040161208e565b602060405180830381600087803b1580156113be57600080fd5b505af19250505080156113ee575060408051601f3d908101601f191682019092526113eb918101906120ec565b60015b61149b576113fa612109565b806308c379a01415611434575061140f612125565b8061141a5750611436565b8060405162461bcd60e51b81526004016103b6919061184e565b505b60405162461bcd60e51b815260206004820152603460248201527f455243313135353a207472616e7366657220746f206e6f6e20455243313135356044820152732932b1b2b4bb32b91034b6b83632b6b2b73a32b960611b60648201526084016103b6565b6001600160e01b0319811663bc197c8160e01b14610a7e5760405162461bcd60e51b81526004016103b6906121ae565b6040805160018082528183019092526060916000919060208083019080368337019050509050828160008151811061150557611505611e02565b602090810291909101015292915050565b6001600160a01b0384163b15610a805760405163f23a6e6160e01b81526001600160a01b0385169063f23a6e619061155a90899089908890889088906004016121f6565b602060405180830381600087803b15801561157457600080fd5b505af19250505080156115a4575060408051601f3d908101601f191682019092526115a1918101906120ec565b60015b6115b0576113fa612109565b6001600160e01b0319811663f23a6e6160e01b14610a7e5760405162461bcd60e51b81526004016103b6906121ae565b8280546115ec90611dc7565b90600052602060002090601f01602090048101928261160e5760008555611654565b82601f1061162757805160ff1916838001178555611654565b82800160010185558215611654579182015b82811115611654578251825591602001919060010190611639565b50611660929150611664565b5090565b5b808211156116605760008155600101611665565b80356001600160a01b038116811461169057600080fd5b919050565b600080604083850312156116a857600080fd5b6116b183611679565b946020939093013593505050565b6001600160e01b03198116811461046a57600080fd5b6000602082840312156116e757600080fd5b81356116f2816116bf565b9392505050565b634e487b7160e01b600052604160045260246000fd5b601f8201601f191681016001600160401b0381118282101715611734576117346116f9565b6040525050565b60006001600160401b03831115611754576117546116f9565b60405161176b601f8501601f19166020018261170f565b80915083815284848401111561178057600080fd5b83836020830137600060208583010152509392505050565b6000602082840312156117aa57600080fd5b81356001600160401b038111156117c057600080fd5b8201601f810184136117d157600080fd5b6117e08482356020840161173b565b949350505050565b6000602082840312156117fa57600080fd5b5035919050565b6000815180845260005b818110156118275760208185018101518683018201520161180b565b81811115611839576000602083870101525b50601f01601f19169290920160200192915050565b6020815260006116f26020830184611801565b60006001600160401b0382111561187a5761187a6116f9565b5060051b60200190565b600082601f83011261189557600080fd5b813560206118a282611861565b6040516118af828261170f565b83815260059390931b85018201928281019150868411156118cf57600080fd5b8286015b848110156118ea57803583529183019183016118d3565b509695505050505050565b600082601f83011261190657600080fd5b6116f28383356020850161173b565b6000806000806080858703121561192b57600080fd5b61193485611679565b935060208501356001600160401b038082111561195057600080fd5b61195c88838901611884565b9450604087013591508082111561197257600080fd5b61197e88838901611884565b9350606087013591508082111561199457600080fd5b506119a1878288016118f5565b91505092959194509250565b600080600080600060a086880312156119c557600080fd5b6119ce86611679565b94506119dc60208701611679565b935060408601356001600160401b03808211156119f857600080fd5b611a0489838a01611884565b94506060880135915080821115611a1a57600080fd5b611a2689838a01611884565b93506080880135915080821115611a3c57600080fd5b50611a49888289016118f5565b9150509295509295909350565b60008060408385031215611a6957600080fd5b82356001600160401b0380821115611a8057600080fd5b818501915085601f830112611a9457600080fd5b81356020611aa182611861565b604051611aae828261170f565b83815260059390931b8501820192828101915089841115611ace57600080fd5b948201945b83861015611af357611ae486611679565b82529482019490820190611ad3565b96505086013592505080821115611b0957600080fd5b50611b1685828601611884565b9150509250929050565b600081518084526020808501945080840160005b83811015611b5057815187529582019590820190600101611b34565b509495945050505050565b6020815260006116f26020830184611b20565b600080600060608486031215611b8357600080fd5b611b8c84611679565b925060208401356001600160401b0380821115611ba857600080fd5b611bb487838801611884565b93506040860135915080821115611bca57600080fd5b50611bd786828701611884565b9150509250925092565b60008060008060808587031215611bf757600080fd5b611c0085611679565b9350602085013592506040850135915060608501356001600160401b03811115611c2957600080fd5b6119a1878288016118f5565b60008060408385031215611c4857600080fd5b8235915060208301356001600160401b03811115611c6557600080fd5b611b16858286016118f5565b60008060408385031215611c8457600080fd5b611c8d83611679565b915060208301358015158114611ca257600080fd5b809150509250929050565b60008060408385031215611cc057600080fd5b611cc983611679565b9150611cd760208401611679565b90509250929050565b600080600080600060a08688031215611cf857600080fd5b611d0186611679565b9450611d0f60208701611679565b9350604086013592506060860135915060808601356001600160401b03811115611d3857600080fd5b611a49888289016118f5565b600060208284031215611d5657600080fd5b6116f282611679565b600080600060608486031215611d7457600080fd5b611d7d84611679565b95602085013595506040909401359392505050565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b600181811c90821680611ddb57607f821691505b60208210811415611dfc57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000600019821415611e4257611e42611e18565b5060010190565b60208082526029908201527f455243313135353a2063616c6c6572206973206e6f74206f776e6572206e6f7260408201526808185c1c1c9bdd995960ba1b606082015260800190565b60008219821115611ea557611ea5611e18565b500190565b600082821015611ebc57611ebc611e18565b500390565b60208082526021908201527f455243313135353a206d696e7420746f20746865207a65726f206164647265736040820152607360f81b606082015260800190565b60208082526028908201527f455243313135353a2069647320616e6420616d6f756e7473206c656e677468206040820152670dad2e6dac2e8c6d60c31b606082015260800190565b604081526000611f5d6040830185611b20565b8281036020840152611f6f8185611b20565b95945050505050565b60208082526025908201527f455243313135353a207472616e7366657220746f20746865207a65726f206164604082015264647265737360d81b606082015260800190565b6020808252602a908201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60408201526939103a3930b739b332b960b11b606082015260800190565b60208082526023908201527f455243313135353a206275726e2066726f6d20746865207a65726f206164647260408201526265737360e81b606082015260800190565b60208082526024908201527f455243313135353a206275726e20616d6f756e7420657863656564732062616c604082015263616e636560e01b606082015260800190565b6001600160a01b0386811682528516602082015260a0604082018190526000906120ba90830186611b20565b82810360608401526120cc8186611b20565b905082810360808401526120e08185611801565b98975050505050505050565b6000602082840312156120fe57600080fd5b81516116f2816116bf565b600060033d11156121225760046000803e5060005160e01c5b90565b600060443d10156121335790565b6040516003193d81016004833e81513d6001600160401b03816024840111818411171561216257505050505090565b828501915081518181111561217a5750505050505090565b843d87010160208285010111156121945750505050505090565b6121a36020828601018761170f565b509095945050505050565b60208082526028908201527f455243313135353a204552433131353552656365697665722072656a656374656040820152676420746f6b656e7360c01b606082015260800190565b6001600160a01b03868116825285166020820152604081018490526060810183905260a06080820181905260009061223090830184611801565b97965050505050505056fea2646970667358221220b877f2b34eff0a2dd2f2b741d4692c6c152dc2c277db3ed57c8009624537d6eb64736f6c63430008090033";

type FareItemsConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FareItemsConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class FareItems__factory extends ContractFactory {
  constructor(...args: FareItemsConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    baseURL: string,
    _controllerAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<FareItems> {
    return super.deploy(
      baseURL,
      _controllerAddress,
      overrides || {}
    ) as Promise<FareItems>;
  }
  override getDeployTransaction(
    baseURL: string,
    _controllerAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      baseURL,
      _controllerAddress,
      overrides || {}
    );
  }
  override attach(address: string): FareItems {
    return super.attach(address) as FareItems;
  }
  override connect(signer: Signer): FareItems__factory {
    return super.connect(signer) as FareItems__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FareItemsInterface {
    return new utils.Interface(_abi) as FareItemsInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FareItems {
    return new Contract(address, _abi, signerOrProvider) as FareItems;
  }
}
