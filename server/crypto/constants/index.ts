import { utils } from 'ethers'
import { BN } from '../utils'
import type { ContractModeParams } from '../types/spin.types'

export const INITIAL_COUNTDOWN_SECS = 120 // 120 secs countdown timer
export const INITIAL_PAUSE_ROUND_MARKER = 10 // Pause round at 10 second mark
export const INITIAL_SPIN_DURATION = 20 // Time wheel spins
export const INITIAL_DISPLAY_RESULT_DURATION = 10 // Mint/Burn screen duration
export const INITIAL_FINISHED_SECS = 30 // Time between wheel finished spinning and new countdown timer
export const SEED_USER_SUBMIT_FEQUENCY = 10 // Amount of secs between seed user batchEntry submits

// @NOTE: Need to discuss about these values
export const AVAX_FLOOR = utils.parseEther('0.25')
export const AVAX_FAUCET_AMOUNT = utils.parseEther('1')
export const FARE_FLOOR = utils.parseEther('50000')
export const FARE_FAUCET_AMOUNT = utils.parseEther('1000000')
export const DEFAULT_PATCH_RATE = 1000 / 20 // 20fps (50ms)
export const DEFAULT_SIMULATION_INTERVAL = 1000 / 60 // 60fps (16.66ms)

// @NOTE: This object should only be used for testing
// @NOTE: If actually using ContractMode, fetch all active ContractModes from smart contract
export const ContractModes: ContractModeParams[] = [
	{
		id: BN(0),
		cardinality: BN(2),
		mintMultiplier: BN(2),
		contractExpectedValueFloor: BN('980321568627440000'), // 2 out of 102 eliminator ticks
		minAmount: BN(0),
		maxAmount: BN(0),
		entryLimit: BN(1),
		isActive: true,
	},
	{
		id: BN(1),
		cardinality: BN(10),
		mintMultiplier: BN(10),
		contractExpectedValueFloor: BN('970873786407767000'), // 3 out of 103 eliminator ticks
		minAmount: BN(0),
		maxAmount: BN(0),
		entryLimit: BN(5),
		isActive: true,
	},
	{
		id: BN(2),
		cardinality: BN(100),
		mintMultiplier: BN(100),
		contractExpectedValueFloor: BN('961538461538462000'), // 4 out of 104 eliminator ricks
		minAmount: BN(0),
		maxAmount: BN(0),
		entryLimit: BN(10),
		isActive: true,
	},
]
