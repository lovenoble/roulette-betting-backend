import { Schema, MapSchema, type } from '@colyseus/schema'
import { IPlayerOptions, IChatMessageOptions } from '../types/chatRoom.types'

export class Player extends Schema implements IPlayerOptions {
	@type('string')
	username = ''
	@type('string')
	publicAddress = ''

	constructor(player: IPlayerOptions) {
		super(player)
		this.username = player.username
		this.publicAddress = player.publicAddress
	}
}

export class ChatMessage extends Schema implements IChatMessageOptions {
	@type('string')
	id = ''
	@type('string')
	text = ''
	@type('string')
	createdBy = ''
	@type('number')
	createdAt?: number
	@type('boolean')
	isInStore = false

	constructor(chatMessage: IChatMessageOptions) {
		super(chatMessage)
		this.id = chatMessage.id
		this.text = chatMessage.text
		this.createdBy = chatMessage.createdBy
		this.createdAt = chatMessage.createdAt || new Date().getTime()
		this.isInStore = chatMessage.isInStore
	}
}

export class ChatRoomState extends Schema {
	@type({ map: Player })
	players = new MapSchema<Player>()
	@type({ map: ChatMessage })
	messages = new MapSchema<ChatMessage>()
}
