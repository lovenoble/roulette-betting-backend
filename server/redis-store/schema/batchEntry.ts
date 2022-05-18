import { Entity, Schema } from 'redis-om'

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
}

export class BatchEntry extends Entity {}

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
	},
	{ dataStructure: 'JSON' }
)
