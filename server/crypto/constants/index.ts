import { BN } from '../utils'
import type { GameModeParams } from '../types/spin.types'

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
