import { Schema, MapSchema, type } from '@colyseus/schema'
import { IPlayer, IChatMessage, IChatRoomState } from '../types/IChatRoomState'

export class Player extends Schema implements IPlayer {
	@type('string')
	username = ''
	@type('string')
	publicAddress = ''

	constructor(player: { username: string; publicAddress: string }) {
		super(player)
		this.username = player.username
		this.publicAddress = player.publicAddress
	}
}

export class ChatMessage extends Schema implements IChatMessage {
	@type('string')
	id = ''
	@type('string')
	text = ''
	@type('string')
	createdBy = ''
	@type('number')
	createdAt: number
	@type('boolean')
	isInStore = false

	constructor(chatMessage: {
		id: string
		text: string
		createdBy: string
		createdAt?: number
		isInStore: boolean
	}) {
		super(chatMessage)
		this.id = chatMessage.id
		this.text = chatMessage.text
		this.createdBy = chatMessage.createdBy
		this.createdAt = chatMessage.createdAt || new Date().getTime()
		this.isInStore = chatMessage.isInStore
	}
}

export class ChatRoomState extends Schema implements IChatRoomState {
	@type({ map: ChatMessage })
	messages = new MapSchema<ChatMessage>()
	@type({ map: Player })
	players = new MapSchema<Player>()
}
