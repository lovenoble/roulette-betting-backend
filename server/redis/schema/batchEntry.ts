import { Entity, Schema } from 'redis-om'
import type { BigNumber } from 'ethers'

import { bnify } from '../utils'
import type { Overwrite } from '../index.types'

export interface BatchEntry {
	eventLogId: string
	roundId: number
	batchEntryId: number
	entryId: number
	player: string
	settled: boolean
	totalEntryAmount: string
	totalWinAmount: string
	timestamp: number
	settledOn: number
}

export interface BNBatchEntry
	extends Overwrite<
		BatchEntry,
		{
			bn: {
				totalEntryAmount: BigNumber
				totalWinAmount: BigNumber
			}
		}
	> {}

export class BatchEntry extends Entity {
	ethFields = ['totalEntryAmount', 'totalWinAmount']

	bnify(): BNBatchEntry & Entity {
		return bnify(this)
	}
}

export default new Schema(
	BatchEntry,
	{
		eventLogId: { type: 'string' },
		roundId: { type: 'number' },
		batchEntryId: { type: 'number' },
		entryId: { type: 'number' },
		player: { type: 'string' },
		settled: { type: 'boolean' },
		totalEntryAmount: { type: 'string' },
		totalWinAmount: { type: 'string' },
		timestamp: { type: 'date' },
		settledOn: { type: 'date' },
	},
	{ dataStructure: 'JSON' }
)
