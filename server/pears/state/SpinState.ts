import { Schema, SetSchema, MapSchema, ArraySchema, type } from '@colyseus/schema'

import { BatchEntry, GuestPlayer, Player, Round } from '../entities'

export class SpinGameState extends Schema {
	// sessionId -> Player, GuestPlayer
	@type({ map: GuestPlayer }) guestPlayer = new MapSchema<GuestPlayer>()
	@type({ map: Player }) players = new MapSchema<Player>()

	// roundId -> BatchEntry, Round
	@type({ map: BatchEntry }) batchEntries = new MapSchema<BatchEntry>()
	@type({ map: Round }) rounds = new MapSchema<Round>()

	@type('string') fareTotalSupply: number
	@type('number') currentRoundId: number

	// 5 mins or (300 players)
	@type('number') countdownTimer: number
}
