import {
	Schema,
	MapSchema,
	// SetSchema,
	// ArraySchema,
	type,
} from '@colyseus/schema'

import { BatchEntry, GuestPlayer, Player, Round } from '../entities'

export class SpinState extends Schema {
	// sessionId -> Player, GuestPlayer
	@type({ map: GuestPlayer }) guestPlayer = new MapSchema<GuestPlayer>()
	@type({ map: Player }) players = new MapSchema<Player>()

	// roundId -> BatchEntry, Round
	@type({ map: BatchEntry }) batchEntries = new MapSchema<BatchEntry>()
	@type({ map: Round }) rounds = new MapSchema<Round>()

	@type('string') fareTotalSupply: number
	@type('number') currentRoundId: number

	// @NOTE: Ensure that publicAddress can only submit one batchEntry per round (in smart contract)
	// @NOTE: Determine if we should start wheel at 2-5 mins or once 300 players are reached
	@type('number') countdownTimer: number
}
