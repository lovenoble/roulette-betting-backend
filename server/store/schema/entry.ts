import { Entity, Schema } from 'redis-om'
import type { BigNumber } from 'ethers'

import { bnify } from '../utils'
import type { Overwrite } from '../types'

// @NOTE: Need to add roundId, entryId, and settled to this and update on settlement
export interface Entry {
	jobId: string
	eventLogId: string
	amount: string
	roundId: number
	gameModeId: number
	pickedNumber: number
	batchEntryId: number
	entryId: number
	winAmount: string
	settled: boolean
	timestamp: number
	settledOn: number
}

export interface BNEntry
	extends Overwrite<
		Entry,
		{
			bn: {
				winAmount: BigNumber
			}
		}
	> {}

export class Entry extends Entity {
	ethFields = ['winAmount']

	bnify(): BNEntry & Entity {
		return bnify(this)
	}
}

export default new Schema(
	Entry,
	{
		jobId: { type: 'string' },
		eventLogId: { type: 'string' },
		amount: { type: 'string' },
		roundId: { type: 'number', sortable: true },
		gameModeId: { type: 'number' },
		pickedNumber: { type: 'number' },
		batchEntryId: { type: 'number', sortable: true },
		entryId: { type: 'number', sortable: true },
		winAmount: { type: 'string' },
		settled: { type: 'boolean' },
		timestamp: { type: 'date' },
		settledOn: { type: 'date' },
	},
	{ dataStructure: 'JSON' }
)
