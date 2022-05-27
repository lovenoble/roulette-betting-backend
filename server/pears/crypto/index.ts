import ethers, { utils, Contract, Wallet } from 'ethers'
import autoBind from 'auto-bind'

import PearToken from './artifacts/PearToken.json'
import PearGame from './artifacts/PearGame.json'

import { EntryList, Entry } from '../state/SpinGameState'
import './contracts'

import defineEvents from '../../redis/event'

defineEvents()

const {
	BLOCKCHAIN_ETH_URL,
	PEAR_TOKEN_ADDRESS,
	PEAR_GAME_ADDRESS,
	PRIVATE_KEY,
	INFURA_POLY_TESTNET,
	NODE_ENV,
} = process.env

export const pearTokenAddress = PEAR_TOKEN_ADDRESS
export const pearGameAddress = PEAR_GAME_ADDRESS

const isDev = NODE_ENV !== 'production'

const provider = new ethers.providers.JsonRpcProvider(
	isDev ? BLOCKCHAIN_ETH_URL : INFURA_POLY_TESTNET
)

export async function faucetFareMatic(address: string) {
	try {
		const signer = new Wallet(PRIVATE_KEY, provider)
		const fareTokenContract = new Contract(pearTokenAddress, PearToken.abi, signer)
		const pearBalance = await fareTokenContract.balanceOf(address)
		console.log('Current Balance:', utils.formatUnits(pearBalance, 18))

		if (Number(utils.formatUnits(pearBalance, 18)) > 0) {
			return
		}

		const pearAmount = utils.parseUnits('5000000')
		console.log('Approving PEAR amount to ', address)
		const approveResp = await fareTokenContract.approve(address, pearAmount)
		await provider?.waitForTransaction(approveResp.hash)

		console.log('Transferring PEAR amount to ', address)
		const transferResp = await fareTokenContract?.transfer(address, pearAmount)

		if (isDev) {
			console.log('Sending ETH to ', address)
			await signer.sendTransaction({
				to: address,
				value: utils.parseUnits('10'),
			})
		} else {
			console.log('Sending MATIC to ', address)
			await signer.sendTransaction({
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
	public provider = provider

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
			const pearBalance = utils.formatUnits(bnPearBalance, this.pearDecimals)

			return pearBalance
		} catch (err: any) {
			throw new Error(err)
		}
	}

	async getPearTotalSupply(): Promise<string> {
		try {
			const pearTotalSupply: any = await this.pearTokenContract.totalSupply()
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
			const _prizes: any = await this.pearTokenContract.getClaimsPrize(addr)

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
			const { queueBalance, prizeBalance, depositBalance } = await this.getPearEscrowValues(
				addr
			)

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
		const promiseList = [...Array(currentRoundId).keys()].map(idx => {
			return new Promise((resolve, reject) => {
				this.pearGameContract
					.getRoundEntries(idx)
					.then((entries: any[]) => {
						state.entries.set(idx.toString(), new EntryList())

						entries.forEach(entry => {
							const newEntry = new Entry({
								publicAddress: entry.player,
								roundId: idx.toString(),
								amount: this.fu(entry.amount),
								pickedColor: entry.pickedNumber.toString(),
								isSettled: entry.isSettled,
								result: this.fu(entry.result, 0),
								winAmount: this.fu(entry.winAmount),
							})

							state.entries.get(idx.toString()).list.push(newEntry)
						})

						resolve(null)
					})
					.catch(reject)
			})
		})

		return Promise.all(promiseList)
	}
}

export default PearCrypto
