import { BigNumber } from 'ethers'

import { GameModeParams } from '../types/spin.types'

export const {
	FARE_TOKEN_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
	FARE_SPIN_GAME_ADDRESS = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
	FARE_ITEMS_ADDRESS = '0x95401dc811bb5740090279Ba06cfA8fcF6113778',
	FARE_NFT_LOOTBOX_ADDRESS = '0x998abeb3E57409262aE5b751f60747921B33613E',
	FARE_NFT_LOOTBOX_CONTROLLER_ADDRESS = '0x70e0bA845a1A0F2DA3359C97E0285013525FFC49',
	TREASURY_ADDRESS = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
	BLOCKCHAIN_ETH_URL = 'http://localhost:8545',
	PRIVATE_KEY = '',
} = process.env

const toBN = BigNumber.from

export const GameModes: GameModeParams[] = [
	{
		id: toBN(0),
		cardinality: toBN(2),
		mintMultiplier: toBN(2),
		gameEdgeFloor: toBN('980321568627440000'), // 2 out of 102 eliminator ticks
		minAmount: toBN(0),
		maxAmount: toBN(0),
		entryLimit: toBN(1),
		isActive: true,
	},
	{
		id: toBN(1),
		cardinality: toBN(10),
		mintMultiplier: toBN(10),
		gameEdgeFloor: toBN('970873786407767000'), // 3 out of 103 eliminator ticks
		minAmount: toBN(0),
		maxAmount: toBN(0),
		entryLimit: toBN(5),
		isActive: true,
	},
	{
		id: toBN(2),
		cardinality: toBN(100),
		mintMultiplier: toBN(100),
		gameEdgeFloor: toBN('961538461538462000'), // 4 out of 104 eliminator ricks
		minAmount: toBN(0),
		maxAmount: toBN(0),
		entryLimit: toBN(10),
		isActive: true,
	},
]
