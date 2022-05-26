import { Schema, MapSchema, type } from '@colyseus/schema'

import { Player, Message } from '../entities'

export class ChatRoomState extends Schema {
	@type({ map: Player }) players = new MapSchema<Player>()
	@type({ map: Message }) messages = new MapSchema<Message>()
}
