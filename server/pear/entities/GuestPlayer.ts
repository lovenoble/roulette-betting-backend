import { Schema, type } from '@colyseus/schema'
import shortId from 'shortid'

// GuestPlayers have access to join a room and spectate but they must authenticate with a wallet to play games
export interface IGuestPlayer {
	guestHashId: string // Unique identifier for players
	// @NOTE: Add properties that will keep track if a guest creates a new player account
}

export class GuestPlayer extends Schema implements IGuestPlayer {
	@type('string') guestHashId = shortId()
}
