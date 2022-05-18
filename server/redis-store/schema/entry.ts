import { Entity, Schema } from 'redis-om'

// @NOTE: Need to add roundId, entryId, and settled to this and update on settlement
export interface Entry {
	amount: string
	gameModeId: number
	pickedNumber: number
	batchEntryId: number
	entryId: number
	winAmount: string
	settled: boolean
	timestamp: number
}

export class Entry extends Entity {}

export default new Schema(
	Entry,
	{
		amount: { type: 'string' },
		gameModeId: { type: 'number' },
		pickedNumber: { type: 'number' },
		batchEntryId: { type: 'number' },
		entryId: { type: 'number' },
		winAmount: { type: 'string' },
		settled: { type: 'boolean' },
		timestamp: { type: 'date' },
	},
	{ dataStructure: 'JSON' }
)
