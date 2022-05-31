import { Contract, Wallet, providers, utils, BigNumber } from 'ethers'
import numeral from 'numeral'

import {
	FareToken,
	FareSpinGame,
	FareItems,
	FareNFTLootBox,
	FareNFTLootBoxController,
} from '../typechain-types'
import {
	BLOCKCHAIN_ETH_URL,
	PRIVATE_KEY,
	FARE_TOKEN_ADDRESS,
	FARE_SPIN_GAME_ADDRESS,
	FARE_ITEMS_ADDRESS,
	FARE_NFT_LOOTBOX_ADDRESS,
	FARE_NFT_LOOTBOX_CONTROLLER_ADDRESS,
} from '../constants'
import { isDev } from '../../utils'
import * as abis from '../abis'

const { INFURA_POLY_TESTNET } = process.env

// const isDev = NODE_ENV !== 'production'

export const provider = new providers.JsonRpcProvider(
	isDev ? BLOCKCHAIN_ETH_URL : INFURA_POLY_TESTNET
)

export const signer = new Wallet(PRIVATE_KEY, provider)

export const fareTokenContract = new Contract(
	FARE_TOKEN_ADDRESS,
	abis.FareTokenABI,
	signer
) as FareToken
export const fareSpinGameContract = new Contract(
	FARE_SPIN_GAME_ADDRESS,
	abis.FareSpinGameABI,
	signer
) as FareSpinGame
export const fareItemsContract = new Contract(
	FARE_ITEMS_ADDRESS,
	abis.FareItemsABI,
	signer
) as FareItems
export const fareLootBoxContract = new Contract(
	FARE_NFT_LOOTBOX_ADDRESS,
	abis.FareNFTLootBoxABI,
	signer
) as FareNFTLootBox
export const fareLootBoxControllerContract = new Contract(
	FARE_NFT_LOOTBOX_CONTROLLER_ADDRESS,
	abis.FareNFTLootBoxControllerABI,
	signer
) as FareNFTLootBoxController

export async function getUserBalances(publicAddress: string) {
	const eth = utils.formatEther(await provider.getBalance(publicAddress))
	const fare = utils.formatEther(await fareTokenContract.balanceOf(publicAddress))

	return {
		eth,
		fare,
	}
}

export const removeAllContractListener = () => {
	fareTokenContract.removeAllListeners()
	fareSpinGameContract.removeAllListeners()
	fareItemsContract.removeAllListeners()
	fareLootBoxContract.removeAllListeners()
	fareLootBoxControllerContract.removeAllListeners()
}

export const BNToNumber = (bn: BigNumber, decimals = 0) => Number(utils.formatUnits(bn, decimals))

export const prettyNumber = (num: number | string | BigNumber, decimals = 18) => {
	if (num instanceof BigNumber) {
		const _num = utils.formatUnits(num, decimals)
		return numeral(_num).format('(0,0)')
	}

	return numeral(num).format('(0,0)')
}

export const toBN = BigNumber.from
