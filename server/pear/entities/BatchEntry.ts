import { Schema, ArraySchema, type } from '@colyseus/schema'

import { Entry } from './Entry'

export interface IBatchEntry {
	// entityId: string // Redis hashId to reference in Redis store (emitted from pubsub event)
	roundId: number // Round when batchEntry was submitted
	batchEntryId: number // References the position of batchEntry array in smart contract
	// entryId: number // References entry array index in smart contract // TBR
	player: string // Public address of player
	settled: boolean // Determines if a player has submitted an batchEntrySettled transaction to claim token
	totalEntryAmount: string // Amount(sum of all entries) won when round is over
	totalWinAmount?: string // Amount(sum of all winning entries) won when round is over
	timestamp: number
	entries: ArraySchema<Entry>
	isLoss: boolean // Defaults to false
}

// @NOTE: This data should probably be fetched whenever someone clicks on a batchEntry
// @NOTE: We could alternatively push a slimmer data view and you can click for more detail
export class BatchEntry extends Schema implements IBatchEntry {
	@type('number') roundId: number
	@type('number') batchEntryId: number
	// @type('number') entryId: number // TBR
	@type('string') player: string
	@type('boolean') settled = false
	@type('string') totalEntryAmount: string
	@type('string') totalWinAmount?: string // Updated when round is over
	@type('number') timestamp: number
	@type([Entry]) entries = new ArraySchema<Entry>()
	@type('boolean') isLoss: boolean // Defaults to false
}
