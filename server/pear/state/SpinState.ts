import {
	Schema,
	MapSchema,
	// SetSchema,
	// ArraySchema,
	type,
} from '@colyseus/schema'

import {
	BatchEntry,
	GuestUser,
	User,
	Round,
	IGuestUser,
	IRound,
	IBatchEntry,
	IUser,
} from '../entities'

export type SpinRoomStatus = 'paused' | 'countdown' | 'wheel-spinning' | 'round-finished'

export interface ISpinState extends Schema {
	guestUsers: MapSchema<IGuestUser>
	users: MapSchema<IUser>
	batchEntries: MapSchema<IBatchEntry>
	round: IRound
	roomStatus: SpinRoomStatus
	fareTotalSupply: string
	currentRoundId: number
}

export default class SpinState extends Schema {
	// sessionId(probably publicAddress?) -> Player, GuestPlayer
	@type({ map: GuestUser }) guestUsers = new MapSchema<GuestUser>()
	@type({ map: User }) users = new MapSchema<User>()

	// publicAddress -> BatchEntry
	@type({ map: BatchEntry }) batchEntries = new MapSchema<BatchEntry>()

	// roundId -> Round
	@type(Round) round = new Round()

	// @NOTE: Ensure that publicAddress can only submit one batchEntry per round (in smart contract)
	// @NOTE: Determine if we should start wheel at 2-5 mins or once 300 players are reached
	@type('string') roomStatus = 'paused'

	@type('string') fareTotalSupply: string
	@type('number') currentRoundId: number
}
