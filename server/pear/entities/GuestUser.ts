import { Schema, type } from '@colyseus/schema'

// GuestPlayers have access to join a room and spectate but they must authenticate with a wallet to play games
export interface IGuestUser {
	guestToken: string // Unique identifier for players
	sessionId?: string
	// @NOTE: Add properties that will keep track if a guest creates a new player account
}

export class GuestUser extends Schema implements IGuestUser {
	@type('string') guestToken: string
	@type('string') sessionId: string

	constructor({ guestToken, sessionId }: IGuestUser) {
		super()
		this.guestToken = guestToken
		this.sessionId = sessionId
	}
}
