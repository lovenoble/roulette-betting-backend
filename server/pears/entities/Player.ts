import { Schema, type } from '@colyseus/schema'

import { Balance } from './Balance'

export interface IPlayer {
	// entityId: string // Redis hashId to reference in Redis store (emitted from pubsub event)
	publicAddress: string // Unique identifier for players
	username?: string // Optional username set by player
	colorTheme?: string // @NOTE: Create colorTheme enum - Optional color theme set by players
}

export class Player extends Schema implements IPlayer {
	@type('string') publicAddress: string
	@type('string') username?: string
	@type('string') colorTheme?: string
	@type(Balance) balance = new Balance()
}
