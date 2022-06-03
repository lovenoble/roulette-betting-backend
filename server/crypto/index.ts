import { Contract, Wallet, providers, utils as ethUtils } from 'ethers'

import {
	FareToken,
	FareSpinGame,
	FareItems,
	FareNFTLootBox,
	FareNFTLootBoxController,
} from './types'
import config from '../config/crypto.config'
import * as abis from './abis'
import * as utils from './utils'
import { FareSpinGameAPI, FareTokenAPI } from './apis'

const {
	fareTokenAddress,
	fareSpinGameAddress,
	fareItemsAddress,
	fareNftLootboxAddress,
	fareNftLootboxControllerAddress,
	treasuryAddress,
	blockchainRpcUrl,
	privateKey,
} = config

export class Crypto {
	provider!: providers.JsonRpcProvider
	signer!: Wallet
	fare!: FareToken
	spin!: FareSpinGame
	items!: FareItems
	lootbox!: FareNFTLootBox
	lootboxCtrl!: FareNFTLootBoxController
	rpcUrl = blockchainRpcUrl
	treasuryAddress = treasuryAddress
	utils = utils

	constructor() {
		this.provider = new providers.JsonRpcProvider(blockchainRpcUrl)
		this.signer = new Wallet(privateKey, this.provider)
		this.fare = new Contract(fareTokenAddress, abis.FareTokenABI, this.signer) as FareToken
		this.spin = new Contract(
			fareSpinGameAddress,
			abis.FareSpinGameABI,
			this.signer
		) as FareSpinGame
		this.items = new Contract(fareItemsAddress, abis.FareItemsABI, this.signer) as FareItems
		this.lootbox = new Contract(
			fareNftLootboxAddress,
			abis.FareNFTLootBoxABI,
			this.signer
		) as FareNFTLootBox
		this.lootboxCtrl = new Contract(
			fareNftLootboxControllerAddress,
			abis.FareNFTLootBoxControllerABI,
			this.signer
		) as FareNFTLootBoxController
	}

	public removeAllContractListeners = () => {
		this.fare.removeAllListeners()
		this.spin.removeAllListeners()
		this.items.removeAllListeners()
		this.lootbox.removeAllListeners()
		this.lootboxCtrl.removeAllListeners()
	}

	public async getETHBalance(publicAddress: string) {
		const eth = ethUtils.formatEther(await this.provider.getBalance(publicAddress))

		return eth
	}

	public async getFareBalance(publicAddress: string) {
		const fare = ethUtils.formatEther(await this.fare.balanceOf(publicAddress))

		return fare
	}

	public async getBalances(publicAddress: string) {
		return {
			eth: await this.getETHBalance(publicAddress),
			fare: await this.getFareBalance(publicAddress),
		}
	}

	public async getTreasuryBalance() {
		return this.getFareBalance(this.treasuryAddress)
	}

	public async getFareTotalSupply() {
		const totalSupply = ethUtils.formatEther(await this.fare.totalSupply())

		return totalSupply
	}
}

const crypto = new Crypto()

// API Instances
export const fareAPI = new FareTokenAPI(crypto.fare)
export const spinAPI = new FareSpinGameAPI(crypto.fare, crypto.spin)

export default crypto
