import { utils } from 'ethers'
import type { ContractModeParams } from '../types/spin.types'
import { BN } from '../utils'

export const ENTRIES_OPEN_COUNTDOWN_DURATION = 30_000
export const PRE_SPIN_DURATION = 5_000
export const WHEEL_SPINNING_DURATION = 10_000
export const RESULT_SCREEN_DURATION = 3_000
export const SEC_MS = 1000
export const SEED_USER_SUBMIT_FEQUENCY = 4_000 // Amount of secs between seed user batchEntry submits
export const SEED_AVAX_FAUCET_AMOUNT = utils.parseEther('35')
export const SEED_FARE_FAUCET_AMOUNT = utils.parseEther('10000000')

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
