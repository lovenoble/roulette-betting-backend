const environment = process.env.NODE_ENV as string || 'development'

// Interfaces
export interface IChainMetadata {
    id: number
    name?: string
    logo: string
    rgb: string
    symbol: string
    infura: {
        https: string
        wss?: string
    }
}

export interface IChainsMetadata {
    eth: {
        main: IChainMetadata
        test: IChainMetadata
    }
    polygon: {
        main: IChainMetadata
        test: IChainMetadata
    }
}

export interface IConstantObj {
    ws: string
    rpc: {
        protocol: string
        host: string
        port: string
    }
    signingMsgText: string

}

export interface IConstants {
    development: IConstantObj
    test: IConstantObj
    production: IConstantObj
}

// String constants
export const BLOCKCHAIN_LOGO_BASE_URL = 'https://blockchain-api.xyz/logos/'

// Ethereum
export const INFURA_ETH_MAINNET_HTTPS =
    'https://mainnet.infura.io/v3/31aadaed31984e0e865701e3c96cb93b'
export const INFURA_ETH_MAINNET_WSS =
    'wss://mainnet.infura.io/ws/v3/31aadaed31984e0e865701e3c96cb93b'
export const INFURA_ETH_KOVAN_HTTPS =
    'https://kovan.infura.io/v3/31aadaed31984e0e865701e3c96cb93b'
export const INFURA_ETH_KOVAN_WSS =
    'wss://kovan.infura.io/ws/v3/31aadaed31984e0e865701e3c96cb93b'

// Polygon
export const INFURA_POLY_MAINNET_HTTPS =
    'https://polygon-mainnet.infura.io/v3/31aadaed31984e0e865701e3c96cb93b'
export const INFURA_POLY_MUMBAI_HTTPS =
    'https://polygon-mumbai.infura.io/v3/31aadaed31984e0e865701e3c96cb93b'


export const EIP155Colors = {
    ethereum: '99, 125, 234',
    polygon: '130, 71, 229',
    // celo: '60, 203, 132',
    // arbitrum: '44, 55, 75',
    // optimism: '233, 1, 1',
    // goerli: '189, 174, 155',
    // xdai: '73, 169, 166',
}

export const chains: IChainsMetadata = {
    eth: {
        main: {
            id: 1,
            name: 'Ethereum Mainnet',
            logo: BLOCKCHAIN_LOGO_BASE_URL + 'eip155:1.png',
            rgb: EIP155Colors.ethereum,
            symbol: 'ETH',
            infura: {
                https: INFURA_ETH_MAINNET_HTTPS,
                wss: INFURA_ETH_MAINNET_WSS,
            },
        },
        test: {
            id: 42,
            name: 'Ethereum Kovan Testnet',
            logo: BLOCKCHAIN_LOGO_BASE_URL + 'eip155:42.png',
            rgb: EIP155Colors.ethereum,
            symbol: 'ETH',
            infura: {
                https: INFURA_ETH_KOVAN_HTTPS,
                wss: INFURA_ETH_KOVAN_WSS,
            },
        },
    },
    polygon: {
        main: {
            id: 137,
            name: 'Polygon Mainnet',
            logo: BLOCKCHAIN_LOGO_BASE_URL + 'eip155:137.png',
            rgb: EIP155Colors.polygon,
            symbol: 'MATIC',
            infura: {
                https: INFURA_POLY_MAINNET_HTTPS,
            },
        },
        test: {
            id: 80001,
            name: 'Polygon Testnet Mumbai',
            logo: BLOCKCHAIN_LOGO_BASE_URL + 'eip155:80001.png',
            rgb: EIP155Colors.polygon,
            symbol: 'MATIC',
            infura: {
                https: INFURA_POLY_MUMBAI_HTTPS,
            },
        },
    },
}

const staticConstants = {
    signingMsgText:
        'Pear connects would like to authenticate your account. Please sign the following: ',
    chains,
}

const constants: IConstants = {
    development: {
        ws: 'ws://localhost:3100',
        rpc: {
            protocol: 'http',
            host: 'localhost',
            port: '8080',
        },
        ...staticConstants,
    },
    test: {
        ws: 'ws://localhost:3100',
        rpc: {
            protocol: 'https',
            host: 'localhost',
            port: '7979',
        },
        ...staticConstants,
    },
    production: {
        ws: 'wss://pear-connect.io/pear',
        rpc: {
            protocol: 'https',
            host: 'pear-connect.io',
            port: '7979',
        },
        ...staticConstants,
    },
}

export default constants[environment as keyof IConstants] || constants.development

