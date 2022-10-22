import { Schema, Context } from '@colyseus/schema'
import { Balance, IBalance } from './Balance'

const type = Context.create()

export interface IUser {
	// entityId: string // Redis hashId to reference in Redis store (emitted from pubsub event)
	publicAddress: string // Unique identifier for players
	username?: string // Optional username set by player
	colorTheme?: string // @NOTE: Create colorTheme enum - Optional color theme set by players
	sessionId?: string
	fareBalance?: string
	ethBalance?: string
}

export interface IUserOptions extends IUser {
	balance?: IBalance
}

export class User extends Schema implements IUser {
	@type('string') publicAddress: string
	@type('string') username?: string
	@type('string') colorTheme?: string
	@type('string') ethBalance?: string
	@type('string') fareBalance?: string
	@type(Balance) balance = new Balance()

	constructor({ publicAddress, username, colorTheme, balance: { fare, eth } }: IUserOptions) {
		super()
		this.publicAddress = publicAddress
		this.username = username
		this.colorTheme = colorTheme
		this.ethBalance = eth
		this.fareBalance = fare
		this.balance.fare = fare
		this.balance.eth = eth
	}
}
