import { Schema, MapSchema } from '@colyseus/schema'

export interface IPlayerOptions {
	publicAddress: string
	username: string
}

export interface IChatMessageOptions {
	id: string
	text: string
	createdBy: string
	createdAt?: number
	isInStore: boolean
}

export interface IChatRoomState extends Schema {
	players: MapSchema<IPlayerOptions>
	messages: MapSchema<IChatMessageOptions>
}

export interface ISpinRoomOptions {
	authToken?: string
	guestId?: string
}

export interface ICreateSpinRoomOptions {
	name?: string
	desc?: string
	password?: string
}
