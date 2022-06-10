import { Schema, type } from '@colyseus/schema'
import shortId from 'shortid'

export interface IMessage {
    id: string // Random id (shortId)
    text: string // @NOTE: May need to do parsing to handle emojis
    createdBy: string // User's public address
    username?: string // User's username
    colorTheme?: string // User's colorScheme
    timestamp: number // Unix timestamp
}

export interface IMessageOpts {
    text: string
    createdBy: string
    username?: string
    colorTheme?: string
}

// @NOTE: Need to save message analytics
// - Message count and frequency by user
// - Number of messages with a user tagged
// - Players timed out for spamming messages
// - Timestamp and round ID data occured
export class Message extends Schema implements IMessage {
    @type('string') id: string
    @type('string') text: string
    @type('string') createdBy: string
    @type('string') username?: string
    @type('string') colorTheme?: string
    @type('number') timestamp: number

    constructor({ text, createdBy, username, colorTheme }: IMessageOpts) {
        super()
        this.id = shortId()
        this.text = text
        this.createdBy = createdBy
        this.username = username
        this.colorTheme = colorTheme
        this.timestamp = Date.now()
    }
}
