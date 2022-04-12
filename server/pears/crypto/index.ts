import ethers, { utils, Contract, providers, Wallet } from 'ethers'
import autoBind from 'auto-bind'
import fs from 'fs'

import PearToken from './artifacts/PearToken.json'
import PearGame from './artifacts/PearGame.json'

import { EntryList, Entry } from '../schemas/ColorGameState'

const {
    BLOCKCHAIN_ETH_URL,
    PEAR_TOKEN_ADDRESS,
    PEAR_GAME_ADDRESS,
    PRIVATE_KEY,
    INFURA_POLY_TESTNET,
    NODE_ENV,
    INFURA_ETH_KOVAN,
} = process.env

export const pearTokenAddress =
    PEAR_TOKEN_ADDRESS || '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6'
export const pearGameAddress =
    PEAR_GAME_ADDRESS || '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318'

const isDev = false

// const FUJI_RPC_URL = 'https://api.avax-test.network/ext/bc/C/rpc'
// const isDev = NODE_ENV === 'development'
// const provider = new ethers.providers.JsonRpcProvider(isDev ? BLOCKCHAIN_ETH_URL : INFURA_POLY_TESTNET)
// const provider = new ethers.providers.JsonRpcProvider(INFURA_POLY_TESTNET)
const provider = new ethers.providers.JsonRpcProvider(BLOCKCHAIN_ETH_URL)

export async function faucetPearMatic(address: string) {
    try {
        const signer = new Wallet(PRIVATE_KEY, provider)
        const _pearTokenContractSigner =  new Contract(pearTokenAddress, PearToken.abi, signer)
        const pearBalance = await _pearTokenContractSigner.balanceOf(address)
        console.log('Current Balance:', utils.formatUnits(pearBalance, 18))

        if (Number(utils.formatUnits(pearBalance, 18)) > 0) {
            return
        }

        const pearAmount = utils.parseUnits('5000000')
        console.log('Approving PEAR amount to ', address)
        const approveResp = await _pearTokenContractSigner.approve(
            address,
            pearAmount
        )
        await provider?.waitForTransaction(approveResp.hash)

        console.log('Transferring PEAR amount to ', address)
        const transferResp = await _pearTokenContractSigner?.transfer(
            address,
            pearAmount
        )

        if (isDev) {
            console.log('Sendinging ETH to ', address)
            const sendTx = await signer.sendTransaction({
                to: address,
                value: utils.parseUnits('10'),
            })
        } else {
            console.log('Sending MATIC to ', address)
            const sendTx = await signer.sendTransaction({
                to: address,
                value: utils.parseUnits('.25'),
            })
        }

        await provider?.waitForTransaction(transferResp.hash)
    } catch (err) {
        console.error(err)
    }
}

class PearCrypto {
    // public provider = ethers.getDefaultProvider(BLOCKCHAIN_ETH_URL)
    public provider = provider
    // public provider = new ethers.providers.JsonRpcProvider(INFURA_POLY_TESTNET)
    // public provider = new ethers.providers.JsonRpcProvider(INFURA_POLY_TESTNET)

    public pearTokenContract!: Contract
    public pearGameContract!: Contract
    public pearDecimals = 18
    public utils = utils
    public fu = utils.formatUnits

    constructor() {
        autoBind(this)
    }

    async init() {
        try {
            this.pearTokenContract = await this.getPearTokenContract()
            this.pearGameContract = await this.getPearGameContract()
        } catch (err: any) {
            console.error(err)
            throw new Error(err)
        }
    }

    async getEthBalance(addr: string) {
        try {
            const ethBalance: any = await this.provider.getBalance(addr)

            return utils.formatUnits(ethBalance)
        } catch (err: any) {
            throw new Error(err)
        }
    }

    async getPearTokenContract(): Promise<Contract> {
        try {
            return new Contract(pearTokenAddress, PearToken.abi, this.provider)
        } catch (err: any) {
            throw new Error(err.toString())
        }
    }

    async getPearGameContract(): Promise<Contract | undefined> {
        try {
            return new Contract(pearGameAddress, PearGame.abi, this.provider)
        } catch (err: any) {
            throw new Error(err.toString())
        }
    }

    async getPearBalance(addr: string): Promise<string> {
        try {
            const bnPearBalance = await this.pearTokenContract.balanceOf(addr)
            const pearBalance = utils.formatUnits(
                bnPearBalance,
                this.pearDecimals
            )

            return pearBalance
        } catch (err: any) {
            throw new Error(err)
        }
    }

    async getPearTotalSupply(): Promise<string> {
        try {
            const pearTotalSupply: any =
                await this.pearTokenContract.totalSupply()
            return utils.formatUnits(pearTotalSupply)
        } catch (err: any) {
            throw new Error(err)
        }
    }

    async getPearEscrowValues(addr: string): Promise<{
        queueBalance: string
        prizeBalance: string
        depositBalance: string
    }> {
        try {
            const _prizes: any = await this.pearTokenContract.getClaimsPrize(
                addr
            )

            let _depositBalance = _prizes.depositAmount.add(_prizes.prizeAmount)

            return {
                queueBalance: utils.formatUnits(_prizes.queueAmount),
                depositBalance: utils.formatUnits(_depositBalance),
                prizeBalance: utils.formatUnits(_prizes.prizeAmount),
            }
        } catch (err: any) {
            throw new Error(err)
        }
    }

    async getAllPearBalances(addr: string): Promise<{
        ethBalance: string
        pearBalance: string
        depositBalance: string
        queueBalance: string
        prizeBalance: string
    }> {
        try {
            const ethBalance = await this.getEthBalance(addr)
            const pearBalance = await this.getPearBalance(addr)
            const { queueBalance, prizeBalance, depositBalance } =
                await this.getPearEscrowValues(addr)

            return {
                ethBalance,
                pearBalance,
                depositBalance,
                queueBalance,
                prizeBalance,
            }
        } catch (err: any) {
            throw new Error(err)
        }
    }

    async getInitialGameEntries(state: any, currentRoundId: string) {
        try {
            // const randomNum = await this.pearGameContract.randomMap("0")
            // console.log('RANDOM NUMBER', utils.formatUnits(randomNum))
            // const json = []
            for (let idx = 0; idx <= Number(currentRoundId); idx++) {
                const entries = await this.pearGameContract.getRoundEntries(
                    idx.toString()
                )
                state.entries.set(idx.toString(), new EntryList())


                for await (const entry of entries) {
                    const newEntry = new Entry({
                        publicAddress: entry.player,
                        roundId: idx.toString(),
                        amount: this.fu(entry.amount),
                        pickedColor: entry.pickedNumber.toString(),
                        isSettled: entry.isSettled,
                        result: this.fu(entry.result, 0),
                        winAmount: this.fu(entry.winAmount),
                    })

                    // if (this.fu(entry.result, 0) === '1') {
                    //     console.log('--------------------------')
                    //     console.log('Address', entry.player)
                    //     console.log('GameMode:', entry.gameMode.toString())
                    //     console.log('Picked Number:', entry.pickedNumber.toString())
                    //     console.log('--------------------------')
                    // }

                    // json.push({
                    //     publicAddress: entry.player,
                    //     roundId: idx.toString(),
                    //     amount: this.fu(entry.amount),
                    //     pickedColor: entry.pickedNumber.toString(),
                    //     isSettled: entry.isSettled,
                    //     result: this.fu(entry.result, 0),
                    //     gameMode: this.fu(entry.gameMode, 0),
                    //     winAmount: this.fu(entry.winAmount),
                    // })

                    state.entries.get(idx.toString()).list.push(newEntry)
                }
            }

            // fs.writeFileSync('./random.json', JSON.stringify(json), 'utf-8')
        } catch (err: any) {
            throw new Error(err)
        }
    }
}

export default PearCrypto