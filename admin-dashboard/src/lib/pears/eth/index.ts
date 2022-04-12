import { utils, providers } from 'ethers'

// Types
import { ProviderType } from '../../../contexts/PearProvider'

// Libraries
import rpcClient from '../../rpc'
import constants from '../../../config/constants'

export * from './pearToken'

export async function signMessage(address: string, msg: string) {
    if (!window.ethereum) throw new Error('Metamask is not installed')

    const signature: string = await window.ethereum.request({
        method: 'personal_sign',
        params: [msg, address],
    })

    return signature
}

export async function getSelectedAddress() {
    try {
        return window.ethereum.request({
            method: 'eth_requestAccounts',
        })
    } catch (err) {
        console.error(err)
    }
}

export async function addPolygonTestnetNetwork() {
    try {
        if (!window.ethereum) throw new Error('Metamask is not installed')
        if (window.ethereum.networkVersion === '80001') return

        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13881' }], // Hexadecimal version of 80001, prefixed with 0x
        })
    } catch (error: any) {
        if (error.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: '0x13881', // Hexadecimal version of 80001, prefixed with 0x
                            chainName: 'Polygon Testnet Mumbai',
                            nativeCurrency: {
                                name: 'MATIC',
                                symbol: 'MATIC',
                                decimals: 18,
                            },
                            rpcUrls: [
                                'https://matic-mumbai.chainstacklabs.com',
                            ],
                            blockExplorerUrls: [
                                'https://mumbai.polygonscan.com/',
                            ],
                            iconUrls: [''],
                        },
                    ],
                })
            } catch (addError: any) {
                throw new Error('User canceled Polygon network add.')
            }
        } else {
            throw new Error(error)
        }
    }
}

export async function authenticate(): Promise<[string, string]> {
    try {
        if (!window.ethereum) throw new Error('Metamask is not installed')
        // await addPolygonTestnetNetwork()
        let ethAddress = await getSelectedAddress()

        if (!ethAddress) throw new Error('Selected ETH address does not exist')

        // Get checksum ETH address
        ethAddress = utils.getAddress(ethAddress[0])

        const request = new rpcClient.playerMessage.GenerateNonceRequest()
        request.setPublicaddress(ethAddress)
        const rpcNonceResp: any = await rpcClient.playerClient.generateNonce(
            request,
            null
        )

        const nonceHex = rpcNonceResp.getNonce()

        const signingMessage = constants.signingMsgText + nonceHex

        const signedMessage = await signMessage(
            ethAddress,
            signingMessage
        )
        if (!signedMessage) {
            throw new Error('Problem with signing auth message!')
        }

        const response = new rpcClient.playerMessage.VerifySignatureRequest()
        response.setPublicaddress(ethAddress)
        response.setSignature(signedMessage)
        const rpcVerifyResp = await rpcClient.playerClient.verifySignature(
            response,
            null
        )

        return [rpcVerifyResp.getToken(), ethAddress]
    } catch (err: any) {
        // @NOTE: Need error catching here
        console.error(err)
        throw new Error(err.message)
    }
}

export async function verifyToken(token: string): Promise<any> {
    try {
        const request = new rpcClient.playerMessage.VerifyTokenRequest()
        request.setToken(token)

        const rpcVerifyResp = await rpcClient.playerClient.verifyToken(
            request,
            null
        )

        return rpcVerifyResp.getPublicaddress()
    } catch (err) {
        // @NOTE: Need error catching here
        console.error(err)
        throw new Error('Invalid access token')
    }
}

export function getJsonRpcProvider(rpcUrl: string): providers.JsonRpcProvider {
    return new providers.JsonRpcProvider(rpcUrl)
}

export function getWeb3Provider(): providers.Web3Provider {
    if (!window.ethereum) throw new Error('Metamask is not installed')

    return new providers.Web3Provider(window.ethereum)
}

export function getDefaultProvider(
    rpcUrl: string
): [providers.Web3Provider, ProviderType] {
    // @NOTES: Implement the ability to use the site and get data without Metamask
    // if (!window.ethereum) return [getJsonRpcProvider(rpcUrl), ProviderType.JSONRPC]

    return [getWeb3Provider(), ProviderType.WEB3]
}