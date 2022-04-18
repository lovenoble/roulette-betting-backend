import ethers, { utils, Contract, Wallet } from 'ethers'

import {
	FareToken__factory,
	FareSpinGame__factory,
	FareItems__factory,
	FareNFTLootBox__factory,
	FareNFTLootBoxController__factory,
} from '../typechain-types'

import FareTokenAbi from '../abis/FareToken.json'
import FareSpinAbi from '../abis/FareSpinGame.json'
import FareItemsAbi from '../abis/FareItems.json'
import FareLootBoxAbi from '../abis/FareNFTLootBox.json'
import FareLootBoxControllerAbi from '../abis/FareNFTLootBoxController.json'

import {
	FARE_TOKEN_CONTRACT,
	FARE_GAME_CONTRACT,
	FARE_ITEMS_CONTRACT,
	FARE_LOOTBOX_CONTRACT,
	FARE_LOOTBOX_CONTROLLER_CONTRACT,
	BLOCKCHAIN_ETH_URL,
	PRIVATE_KEY,
} from '../constants'

const provider = new ethers.providers.JsonRpcProvider(BLOCKCHAIN_ETH_URL)

const signer = new Wallet(PRIVATE_KEY, provider)
export const fareToken = FareToken__factory.connect(FARE_TOKEN_CONTRACT, signer)
export const fareSpin = FareSpinGame__factory.connect(FARE_GAME_CONTRACT, signer)
export const fareItems = FareItems__factory.connect(FARE_ITEMS_CONTRACT, signer)
export const fareLootBox = FareNFTLootBox__factory.connect(FARE_LOOTBOX_CONTRACT, signer)
export const fareLootBoxController = FareNFTLootBoxController__factory.connect(FARE_LOOTBOX_CONTROLLER_CONTRACT, signer)

export async function getFareBalance(address: string) {
	try {
		const fareBalance = await fareToken.balanceOf(address)
		console.log('Current Balance:', utils.formatUnits(fareBalance, 18))
		const tokenURI = await fareItems.uri(0)
		console.log(tokenURI)
	} catch (err) {
		console.error(err)
	}
}

getFareBalance('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
