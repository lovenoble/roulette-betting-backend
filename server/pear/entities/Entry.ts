import { Schema, type } from '@colyseus/schema'

export interface IEntry {
	// entityId: string // Redis hashId to reference in Redis store (emitted from pubsub event)
	amount: string // Amount of FARE token submitted
	roundId: number // Round when this entry was submitted
	gameModeId: number // References the GameMode mapping in the smart contract (0 = 2X, 1 = 10X, 2 = 100X)
	pickedNumber: number // Number picked for the specific gameMode
	batchEntryId: number // References parent batchEntry
	entryId: number // References position in entry array in smart contract
	entryIdx: number // References position in entry array in smart contract
	winAmount?: string // Amount won when round is over
	settled: boolean // Determines if a player has submitted an batchEntrySettled transaction to claim token
	isLoss: boolean
}

// @NOTE: This data should probably be fetched whenever someone clicks on a batchEntry
// @NOTE: We could alternatively push a slimmer data view and you can click for more detail
export class Entry extends Schema implements IEntry {
	@type('string') amount: string
	@type('number') roundId: number
	@type('number') gameModeId: number
	@type('number') pickedNumber: number
	@type('number') batchEntryId: number
	@type('number') entryId: number
	@type('number') entryIdx: number
	@type('string') winAmount?: string // Updates when round is over
	@type('boolean') settled = false // Defaults to false
	@type('boolean') isLoss: boolean // Defaults to false
}
