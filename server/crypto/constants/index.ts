import { utils } from 'ethers'
import { BN } from '../utils'
import type { GameModeParams } from '../types/spin.types'

// export const INITIAL_COUNTDOWN_SECS = 300 // 5 minutes
export const INITIAL_COUNTDOWN_SECS = 90 // 90 secs

// @NOTE: Need to discuss about these values
export const AVAX_FLOOR = utils.parseEther('0.25')
export const AVAX_FAUCET_AMOUNT = utils.parseEther('1')
export const FARE_FLOOR = utils.parseEther('10000')
export const FARE_FAUCET_AMOUNT = utils.parseEther('500000')
export const DEFAULT_PATCH_RATE = 1000 / 20 // 20fps (50ms)
export const DEFAULT_SIMULATION_INTERVAL = 1000 / 60 // 60fps (16.66ms)

// @NOTE: This object should only be used for testing
// @NOTE: If actually using GameMode, fetch all active GameModes from smart contract
export const GameModes: GameModeParams[] = [
	{
		id: BN(0),
		cardinality: BN(2),
		mintMultiplier: BN(2),
		gameEdgeFloor: BN('980321568627440000'), // 2 out of 102 eliminator ticks
		minAmount: BN(0),
		maxAmount: BN(0),
		entryLimit: BN(1),
		isActive: true,
	},
	{
		id: BN(1),
		cardinality: BN(10),
		mintMultiplier: BN(10),
		gameEdgeFloor: BN('970873786407767000'), // 3 out of 103 eliminator ticks
		minAmount: BN(0),
		maxAmount: BN(0),
		entryLimit: BN(5),
		isActive: true,
	},
	{
		id: BN(2),
		cardinality: BN(100),
		mintMultiplier: BN(100),
		gameEdgeFloor: BN('961538461538462000'), // 4 out of 104 eliminator ricks
		minAmount: BN(0),
		maxAmount: BN(0),
		entryLimit: BN(10),
		isActive: true,
	},
]
