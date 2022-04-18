/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  FareNFTLootBox,
  FareNFTLootBoxInterface,
} from "../../contracts/FareNFTLootBox";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_nftURI",
        type: "string",
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
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
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
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
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
        internalType: "uint256",
        name: "tokenId",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
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
    name: "getLatestNftId",
    outputs: [
      {
        internalType: "uint256",
        name: "latestNftId",
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
        name: "owner",
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
        name: "",
        type: "address",
      },
    ],
    name: "minterWhitelist",
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
    name: "name",
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
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
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
        name: "to",
        type: "address",
      },
    ],
    name: "safeMint",
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
        name: "tokenId",
        type: "uint256",
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
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
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
        name: "_nftURI",
        type: "string",
      },
    ],
    name: "setBaseURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "minter",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
    ],
    name: "setWhitelistAddress",
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
    inputs: [],
    name: "symbol",
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
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
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
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
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
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162001c9038038062001c908339810160408190526200003491620001e9565b604080518082018252600d81526c08cc2e4ca4098dedee84084def609b1b6020808301918252835180850190945260068452652320a922a62160d11b90840152815191929162000087916000916200012d565b5080516200009d9060019060208401906200012d565b505050620000ba620000b4620000d760201b60201c565b620000db565b8051620000cf9060089060208401906200012d565b505062000302565b3390565b600680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b8280546200013b90620002c5565b90600052602060002090601f0160209004810192826200015f5760008555620001aa565b82601f106200017a57805160ff1916838001178555620001aa565b82800160010185558215620001aa579182015b82811115620001aa5782518255916020019190600101906200018d565b50620001b8929150620001bc565b5090565b5b80821115620001b85760008155600101620001bd565b634e487b7160e01b600052604160045260246000fd5b60006020808385031215620001fd57600080fd5b82516001600160401b03808211156200021557600080fd5b818501915085601f8301126200022a57600080fd5b8151818111156200023f576200023f620001d3565b604051601f8201601f19908116603f011681019083821181831017156200026a576200026a620001d3565b8160405282815288868487010111156200028357600080fd5b600093505b82841015620002a7578484018601518185018701529285019262000288565b82841115620002b95760008684830101525b98975050505050505050565b600181811c90821680620002da57607f821691505b60208210811415620002fc57634e487b7160e01b600052602260045260246000fd5b50919050565b61197e80620003126000396000f3fe608060405234801561001057600080fd5b50600436106101425760003560e01c806370a08231116100b8578063a22cb4651161007c578063a22cb46514610293578063b88d4fde146102a6578063c87b56dd146102b9578063dda8c6a1146102cc578063e985e9c5146102ef578063f2fde38b1461032b57600080fd5b806370a0823114610257578063715018a61461026a5780637f378657146102725780638da5cb5b1461027a57806395d89b411461028b57600080fd5b80633f914aef1161010a5780633f914aef146101d757806340d097c3146101ea57806342842e0e1461020b57806342966c681461021e57806355f804b3146102315780636352211e1461024457600080fd5b806301ffc9a71461014757806306fdde031461016f578063081812fc14610184578063095ea7b3146101af57806323b872dd146101c4575b600080fd5b61015a6101553660046113ff565b61033e565b60405190151581526020015b60405180910390f35b610177610390565b6040516101669190611474565b610197610192366004611487565b610422565b6040516001600160a01b039091168152602001610166565b6101c26101bd3660046114b7565b6104bc565b005b6101c26101d23660046114e1565b6105d2565b6101c26101e536600461151d565b610604565b6101fd6101f8366004611559565b610659565b604051908152602001610166565b6101c26102193660046114e1565b6106d8565b6101c261022c366004611487565b6106f3565b6101c261023f366004611600565b61076d565b610197610252366004611487565b6107ae565b6101fd610265366004611559565b610825565b6101c26108ac565b6101fd6108e2565b6006546001600160a01b0316610197565b6101776108f2565b6101c26102a136600461151d565b610901565b6101c26102b4366004611649565b61090c565b6101776102c7366004611487565b610944565b61015a6102da366004611559565b60096020526000908152604090205460ff1681565b61015a6102fd3660046116c5565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b6101c2610339366004611559565b610a1f565b60006001600160e01b031982166380ac58cd60e01b148061036f57506001600160e01b03198216635b5e139f60e01b145b8061038a57506301ffc9a760e01b6001600160e01b03198316145b92915050565b60606000805461039f906116f8565b80601f01602080910402602001604051908101604052809291908181526020018280546103cb906116f8565b80156104185780601f106103ed57610100808354040283529160200191610418565b820191906000526020600020905b8154815290600101906020018083116103fb57829003601f168201915b5050505050905090565b6000818152600260205260408120546001600160a01b03166104a05760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b506000908152600460205260409020546001600160a01b031690565b60006104c7826107ae565b9050806001600160a01b0316836001600160a01b031614156105355760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610497565b336001600160a01b0382161480610551575061055181336102fd565b6105c35760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610497565b6105cd8383610ab7565b505050565b6105dd335b82610b25565b6105f95760405162461bcd60e51b815260040161049790611733565b6105cd838383610c1c565b6006546001600160a01b0316331461062e5760405162461bcd60e51b815260040161049790611784565b6001600160a01b03919091166000908152600960205260409020805460ff1916911515919091179055565b3360009081526009602052604081205460ff166106ab5760405162461bcd60e51b815260206004820152601060248201526f139bdd081bdb881dda1a5d195b1a5cdd60821b6044820152606401610497565b60006106b660075490565b90506106c6600780546001019055565b6106d08382610db8565b90505b919050565b6105cd8383836040518060200160405280600081525061090c565b6106fc336105d7565b6107615760405162461bcd60e51b815260206004820152603060248201527f4552433732314275726e61626c653a2063616c6c6572206973206e6f74206f7760448201526f1b995c881b9bdc88185c1c1c9bdd995960821b6064820152608401610497565b61076a81610dd2565b50565b6006546001600160a01b031633146107975760405162461bcd60e51b815260040161049790611784565b80516107aa906008906020840190611350565b5050565b6000818152600260205260408120546001600160a01b0316806106d05760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610497565b60006001600160a01b0382166108905760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610497565b506001600160a01b031660009081526003602052604090205490565b6006546001600160a01b031633146108d65760405162461bcd60e51b815260040161049790611784565b6108e06000610e6d565b565b60006108ed60075490565b905090565b60606001805461039f906116f8565b6107aa338383610ebf565b6109163383610b25565b6109325760405162461bcd60e51b815260040161049790611733565b61093e84848484610f8e565b50505050565b6000818152600260205260409020546060906001600160a01b03166109c35760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b6064820152608401610497565b60006109cd610fc1565b905060008151116109ed5760405180602001604052806000815250610a18565b806109f784610fd0565b604051602001610a089291906117b9565b6040516020818303038152906040525b9392505050565b6006546001600160a01b03163314610a495760405162461bcd60e51b815260040161049790611784565b6001600160a01b038116610aae5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610497565b61076a81610e6d565b600081815260046020526040902080546001600160a01b0319166001600160a01b0384169081179091558190610aec826107ae565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000818152600260205260408120546001600160a01b0316610b9e5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610497565b6000610ba9836107ae565b9050806001600160a01b0316846001600160a01b03161480610be45750836001600160a01b0316610bd984610422565b6001600160a01b0316145b80610c1457506001600160a01b0380821660009081526005602090815260408083209388168352929052205460ff165b949350505050565b826001600160a01b0316610c2f826107ae565b6001600160a01b031614610c935760405162461bcd60e51b815260206004820152602560248201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060448201526437bbb732b960d91b6064820152608401610497565b6001600160a01b038216610cf55760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610497565b610d00600082610ab7565b6001600160a01b0383166000908152600360205260408120805460019290610d299084906117fe565b90915550506001600160a01b0382166000908152600360205260408120805460019290610d57908490611815565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b6107aa8282604051806020016040528060008152506110ce565b6000610ddd826107ae565b9050610dea600083610ab7565b6001600160a01b0381166000908152600360205260408120805460019290610e139084906117fe565b909155505060008281526002602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b600680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b816001600160a01b0316836001600160a01b03161415610f215760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610497565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b610f99848484610c1c565b610fa584848484611101565b61093e5760405162461bcd60e51b81526004016104979061182d565b60606008805461039f906116f8565b606081610ff45750506040805180820190915260018152600360fc1b602082015290565b8160005b811561101e57806110088161187f565b91506110179050600a836118b0565b9150610ff8565b60008167ffffffffffffffff81111561103957611039611574565b6040519080825280601f01601f191660200182016040528015611063576020820181803683370190505b5090505b8415610c14576110786001836117fe565b9150611085600a866118c4565b611090906030611815565b60f81b8183815181106110a5576110a56118d8565b60200101906001600160f81b031916908160001a9053506110c7600a866118b0565b9450611067565b6110d8838361120e565b6110e56000848484611101565b6105cd5760405162461bcd60e51b81526004016104979061182d565b60006001600160a01b0384163b1561120357604051630a85bd0160e11b81526001600160a01b0385169063150b7a02906111459033908990889088906004016118ee565b602060405180830381600087803b15801561115f57600080fd5b505af192505050801561118f575060408051601f3d908101601f1916820190925261118c9181019061192b565b60015b6111e9573d8080156111bd576040519150601f19603f3d011682016040523d82523d6000602084013e6111c2565b606091505b5080516111e15760405162461bcd60e51b81526004016104979061182d565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610c14565b506001949350505050565b6001600160a01b0382166112645760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610497565b6000818152600260205260409020546001600160a01b0316156112c95760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610497565b6001600160a01b03821660009081526003602052604081208054600192906112f2908490611815565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b82805461135c906116f8565b90600052602060002090601f01602090048101928261137e57600085556113c4565b82601f1061139757805160ff19168380011785556113c4565b828001600101855582156113c4579182015b828111156113c45782518255916020019190600101906113a9565b506113d09291506113d4565b5090565b5b808211156113d057600081556001016113d5565b6001600160e01b03198116811461076a57600080fd5b60006020828403121561141157600080fd5b8135610a18816113e9565b60005b8381101561143757818101518382015260200161141f565b8381111561093e5750506000910152565b6000815180845261146081602086016020860161141c565b601f01601f19169290920160200192915050565b602081526000610a186020830184611448565b60006020828403121561149957600080fd5b5035919050565b80356001600160a01b03811681146106d357600080fd5b600080604083850312156114ca57600080fd5b6114d3836114a0565b946020939093013593505050565b6000806000606084860312156114f657600080fd5b6114ff846114a0565b925061150d602085016114a0565b9150604084013590509250925092565b6000806040838503121561153057600080fd5b611539836114a0565b91506020830135801515811461154e57600080fd5b809150509250929050565b60006020828403121561156b57600080fd5b610a18826114a0565b634e487b7160e01b600052604160045260246000fd5b600067ffffffffffffffff808411156115a5576115a5611574565b604051601f8501601f19908116603f011681019082821181831017156115cd576115cd611574565b816040528093508581528686860111156115e657600080fd5b858560208301376000602087830101525050509392505050565b60006020828403121561161257600080fd5b813567ffffffffffffffff81111561162957600080fd5b8201601f8101841361163a57600080fd5b610c148482356020840161158a565b6000806000806080858703121561165f57600080fd5b611668856114a0565b9350611676602086016114a0565b925060408501359150606085013567ffffffffffffffff81111561169957600080fd5b8501601f810187136116aa57600080fd5b6116b98782356020840161158a565b91505092959194509250565b600080604083850312156116d857600080fd5b6116e1836114a0565b91506116ef602084016114a0565b90509250929050565b600181811c9082168061170c57607f821691505b6020821081141561172d57634e487b7160e01b600052602260045260246000fd5b50919050565b60208082526031908201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f6040820152701ddb995c881b9bdc88185c1c1c9bdd9959607a1b606082015260800190565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b600083516117cb81846020880161141c565b8351908301906117df81836020880161141c565b01949350505050565b634e487b7160e01b600052601160045260246000fd5b600082821015611810576118106117e8565b500390565b60008219821115611828576118286117e8565b500190565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6000600019821415611893576118936117e8565b5060010190565b634e487b7160e01b600052601260045260246000fd5b6000826118bf576118bf61189a565b500490565b6000826118d3576118d361189a565b500690565b634e487b7160e01b600052603260045260246000fd5b6001600160a01b038581168252841660208201526040810183905260806060820181905260009061192190830184611448565b9695505050505050565b60006020828403121561193d57600080fd5b8151610a18816113e956fea264697066735822122059bd1201850dfb8a169ce7141b41a9b6aa62a24ef94e025dd7ea92f52b24b95f64736f6c63430008090033";

type FareNFTLootBoxConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FareNFTLootBoxConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class FareNFTLootBox__factory extends ContractFactory {
  constructor(...args: FareNFTLootBoxConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _nftURI: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<FareNFTLootBox> {
    return super.deploy(_nftURI, overrides || {}) as Promise<FareNFTLootBox>;
  }
  override getDeployTransaction(
    _nftURI: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_nftURI, overrides || {});
  }
  override attach(address: string): FareNFTLootBox {
    return super.attach(address) as FareNFTLootBox;
  }
  override connect(signer: Signer): FareNFTLootBox__factory {
    return super.connect(signer) as FareNFTLootBox__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FareNFTLootBoxInterface {
    return new utils.Interface(_abi) as FareNFTLootBoxInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FareNFTLootBox {
    return new Contract(address, _abi, signerOrProvider) as FareNFTLootBox;
  }
}
