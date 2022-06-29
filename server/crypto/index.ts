import { Wallet, providers, utils as ethUtils } from 'ethers'

import {
	FareItems,
	FareItems__factory,
	FareNFTLootBox,
	FareNFTLootBoxController,
	FareNFTLootBoxController__factory,
	FareNFTLootBox__factory,
	FareSpinGame,
	FareSpinGame__factory,
	FareToken,
	FareToken__factory,
} from './types'
import config from '../config/crypto.config'
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
		this.fare = FareToken__factory.connect(fareTokenAddress, this.signer)
		this.spin = FareSpinGame__factory.connect(fareSpinGameAddress, this.signer)
		this.items = FareItems__factory.connect(fareItemsAddress, this.signer)
		this.lootbox = FareNFTLootBox__factory.connect(fareNftLootboxAddress, this.signer)
		this.lootboxCtrl = FareNFTLootBoxController__factory.connect(
			fareNftLootboxControllerAddress,
			this.signer
		)
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

	public async signMessage(message: string) {
		return this.signer.signMessage(message)
	}
}

const crypto = new Crypto()

// API Instances
export const fareAPI = new FareTokenAPI(crypto.fare)
export const spinAPI = new FareSpinGameAPI(crypto.fare, crypto.spin)

export default crypto
