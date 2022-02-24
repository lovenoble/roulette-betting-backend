# Wallet Connect

- Need to find list of compatible WalletConnect wallets and display a component to the user
- https://react-app.walletconnect.com/
- https://react-wallet.walletconnect.com/

- Look into the setup of the Makefile
- Look into the docker setup for both the wallet and client

## Dependencies

- @walletconnect/client
  - Client, { CLIENT_EVENTS }
- @walletconnect/jsonrpc-utils
  - JsonRpcRequest
- @walletconnect/encoding
  - * as encoding
- @walletconnect/legacy-model
  - QRCodeModal
- @walletconnect/types
  -  { PairingTypes, SessionTypes }
- @walletconnect/utils
  - { ERROR, getAppmetadata }

- axios
  - axios, { AxiosInstance }
- ethers
  - Contract, providers, utils, BigNumber, BigNumberish
- caip-api
  - ChainsMap, apiGetChainNamespace
- eth-sig-util
  - { TypedDataUtils }
- ethereumjs-util
  - * as ethUtil


## Internal Helpers

- Custom components
  - QRCodeModal -> Displays the QRCode for wallet connect

- Typescript interfaces (see example codebase)
  - `JsonRpcRequest`, `ChainMetaData`, `ChainRequestRender`, `AssetData`, `GasPrices`, `ParsedTx`
- `convertHexToNumber`
- `convertHexToUtf8`
- constants - Need to create constants file.
  - DEFAULT_MAIN_CHAINS
  - DEFAULT_TEST_CHAINS
  - DEFAULT_CHAINS
  - CHAIN_COLORS
  - PROJECT_ID
  - RELAY_URL
  - EIP155_METHODS
  - REACT_APP_METADATA
  - BLOCKCHAIN_LOGO_BASE_URL
  - LOCALSTORAGE_KEY_TESTNET = "TESTNET"
  - INITIAL_STATE_TESTNET_DEFAULT = true

```js

interface AppState {
  client: Client | undefined;
  session: SessionTypes.Created | undefined;
  testnet: boolean;
  loading: boolean;
  fetching: boolean;
  chains: string[];
  pairings: string[];
  modal: string;
  pending: boolean;
  uri: string;
  accounts: string[];
  result: any | undefined;
  balances: AccountBalances;
  chainData: ChainNamespaces;
}

const INITIAL_STATE: AppState = {
  client: undefined,
  session: undefined,
  testnet: true,
  loading: false,
  fetching: false,
  chains: [],
  pairings: [],
  modal: "",
  pending: false,
  uri: "",
  accounts: [],
  result: undefined,
  balances: {},
  chainData: {},
};

```

---

## Chains

> File path: `src/chains/*`

***Terms***

- EIP - Ethereum Improvement Proposal
- [eip155](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md) - Simple replay attack protection - Mainnet
- [eip712](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md) - Ethereum typed structured data hashing and signing
- [eip1271](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1271.md) - Standard Signature Validation Method for Contracts

- ***ETH(eip155)*** - (mainnet, testnets, side-chains)
  - Optimism
  - Goerli
  - Polygon
  - Celo
  - Gnosis Chain
  - Arbitrum
  - Latest proposal (eip4337)
- Cosmos
- Polkadot

### Code

- Create and make function to return metadata for a given chain
  - `getChainMetadata(chainId: string): ChainMetadata`
- Create hash list with chainId as the key and value being object of the chain metadata
- Create a function that is able to take a `JsonRpcRequest` and create a javascript object with the fields serialized
  - `getChainRequestRender(request: JsonRpcRequest) ChainRequestRender[]`

---

## Helpers

### Files

#### `index.ts` - Entry point to the helper library

#### `api.ts`

- creates `ethereumApi: AxiosInstance => axios.create` -> URL `https://ethereum-api.xyz`
- `apiGetAccountAssets(address: string, chainId: string) => Promise<AssetData[]>` -> Fetches the users assets by ethChainId
- `apiGetAccountTransactions(address: string, chainId: string) => Promise<ParsedTx[]>` -> Users transaction history
- `apiGetACcountNonce(address: string, chainId: string) => Promise<number>` -> Nonce to be signed by user
- `apiGetGasPrices() => Promise<GasPrices>`

#### `eip712.ts`

> Defines example data for eip712 -> Use this for a reference

#### `eip1271.ts`

- Define spec object
- `isValidSignature(address: string, sig: string, data: string, provider: providers.Provider, abi = eip1271.spec.abi.magicValue) => Promise<boolean>`

#### `tx.ts`

- `getGasPrice(chainId: string) => Promise<string>`
- `formatTestTransaction(account: string) => Tx`

#### `types.ts`

> Contains all the types used in the project

#### `utilities.ts`

> Utility functions used in the project. Starts the file with importing eip1271

- `capitalize(string: string) => string`
- `ellipseText(text = "", maxLength = 9999) => string` -> Adds ellipse to a text but doesn't cut off the last word
- `ellipseAddress(address = "", width = 10) => string`
- `getDataString(func: string, arrVals: any[]) => string` -> Turns encoding data into a safe string
- `isMobile() => boolean`
  - `hasTouchEvent() => boolean`
  - `hasMobileUserAgent() => boolean`
- `encodePersonalMessage(msg: string) => string`
- `hashPersonalMessage(msg: string) => string`
- `encodeTypedDataMessage(msg: string) => string`
- `hashTypedDataMessage(msg: string) => string`
- `recoverAddress(sig: string, hash: string) => string`
- `recoverPersonalSignature(sig: string, msg: string) => string`
- `recoverTypedMessage(sig: string, msg: string) => string`
- `verifySignature(address: string, sig: string, hash:string, rpcUrl: string) => Promise<boolean>`
- `convertHexToNumber(hex: string)`
- `convertHexToUtf8(hex: string)`
- `sanitizeDecimals(value: string, decimals = 18) => string`
- `toWad(amount: string, decimals = 18) => BigNumber`
- `fromWad(wad: BigNumberish, decimals = 18) => string`
- `setInitialStateTestnet(value: boolean) => void`
- `getInitialStateTestnet() => boolean`

## Components

### Files

#### index.tsx

> Has an interface Window that has a value of blockies. Look into what blockies is

#### App.tsx

> Entry point into the app. It looks like it needs to be broken up.
