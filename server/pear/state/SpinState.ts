import {
	Schema,
	MapSchema,
	// SetSchema,
	// ArraySchema,
	type,
} from '@colyseus/schema'

import { BatchEntry, GuestUser, User, Round, Timer } from '../entities'

export default class SpinState extends Schema {
	// sessionId(probably publicAddress?) -> Player, GuestPlayer
	@type({ map: GuestUser }) guestUsers = new MapSchema<GuestUser>()
	@type({ map: User }) users = new MapSchema<User>()

	// publicAddress -> BatchEntry
	@type({ map: BatchEntry }) batchEntries = new MapSchema<BatchEntry>()

	// roundId -> Round
	@type({ map: Round }) rounds = new MapSchema<Round>()

	// @NOTE: Ensure that publicAddress can only submit one batchEntry per round (in smart contract)
	// @NOTE: Determine if we should start wheel at 2-5 mins or once 300 players are reached
	@type(Timer) timer = new Timer()

	@type('string') fareTotalSupply: number
	@type('number') currentRoundId: number
}
