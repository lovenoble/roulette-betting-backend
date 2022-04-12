import { Contract, utils, providers } from 'ethers'

import PearToken from '../artifacts/PearToken.json'
import PearGame from '../artifacts/PearGame.json'
const {
    REACT_APP_PEAR_TOKEN_ADDRESS,
    REACT_APP_PEAR_GAME_ADDRESS,
} = process.env

export const pearTokenAddress =
    REACT_APP_PEAR_TOKEN_ADDRESS || '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6'
export const pearGameAddress =
    REACT_APP_PEAR_GAME_ADDRESS || '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318'

export const pearDecimals = 18

export function getPearContract(provider: providers.Web3Provider): Contract {
    try {
        return new Contract(pearTokenAddress, PearToken.abi, provider)
    } catch (err: any) {
        throw new Error(err.toString())
    }
}

export async function getGameSignerContract(provider?: providers.Web3Provider): Promise<Contract | undefined> {
    try {
        if (!provider) return
        const signer = await provider.getSigner()
        return new Contract(pearGameAddress, PearGame.abi, signer)
    } catch (err: any) {
        throw new Error(err.toString())
    }
}

export async function getPearSignerContract(provider?: providers.Web3Provider): Promise<Contract | undefined> {
    try {
        if (!provider) return

        const signer = await provider.getSigner()
        return new Contract(pearTokenAddress, PearToken.abi, signer)
    } catch (err: any) {
        throw new Error(err.toString())
    }
}

// @NOTE need to pass `to` param into the function
export async function sendPearToken(
    amount: string,
    to: string,
    pearContract?: Contract,
): Promise<boolean> {
    try {
        const safeAmount = utils.parseUnits(amount, pearDecimals)
        const approveResp = await pearContract?.approve(to, safeAmount)
        console.log(`Approve tx(${approveResp.hash.substring(0, 12)}) was successful to ${to.substring(0, 12)} for ${amount}`)
        const transferResp = await pearContract?.transfer(to, safeAmount)
        console.log(`Approve tx(${transferResp.hash.substring(0, 12)}) was successful to ${to.substring(0, 12)} for ${amount}`)
        return true
    } catch (err: any) {
        throw new Error(err.toString())
    }
}

export async function getPearBalance(addr: string, pearContract?: Contract): Promise<string> {
    try {
        const bnPearBalance = await pearContract?.balanceOf(addr)
        const pearBalance = utils.formatUnits(bnPearBalance, pearDecimals)

        return pearBalance
    } catch (err: any) {
        throw new Error(err.toString())
    }
}
