import { Schema, MapSchema } from '@colyseus/schema'

export interface IPlayer extends Schema {
	publicAddress: string
	username: string
}

export interface IChatMessage extends Schema {
	id: string
	text: string
	createdBy: string
	createdAt: number
	isInStore: boolean
}

export interface IChatRoomState extends Schema {
	players: MapSchema<IPlayer>
	messages: MapSchema<IChatMessage>
}
