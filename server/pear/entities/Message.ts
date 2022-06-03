import { Schema, type } from '@colyseus/schema'
import shortId from 'shortid'

export interface IMessage {
	id: string // Random id (shortId)
	text: string // @NOTE: May need to do parsing to handle emojis
	createdBy: string // Players public address
	timestamp: number // Unix timestamp
}

// @NOTE: Need to save message analytics
// - Message count and frequency by user
// - Number of messages with a user tagged
// - Players timed out for spamming messages
// - Timestamp and round ID data occured
export class Message extends Schema implements IMessage {
	@type('string') id = shortId()
	@type('string') text: string
	@type('string') createdBy: string
	@type('number') timestamp = Date.now()
	constructor({ id, text, createdBy, timestamp }: IMessage) {
		super()
		this.id = id
		this.text = text
		this.createdBy = createdBy
		this.timestamp = timestamp
	}
}
