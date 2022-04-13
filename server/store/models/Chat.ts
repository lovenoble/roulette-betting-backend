import Mongoose from 'mongoose'

import { IPlayer } from './Player'

const { Schema, model } = Mongoose

// @NOTE: Turn to an enum later
export const CHAT_TYPES = {
	GAME: 'game',
	WHEEL: 'wheel',
	METAVERSE: 'metaverse',
	// @NOTE: Implement specific chat types later on
}

export interface IChat {
	_id?: string
	text: string
	player: IPlayer
	type?: string
	createdAt?: Date
	updatedAt?: Date
}

export const ChatSchema = new Schema<IChat>(
	{
		text: { type: String, required: true },
		player: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
		type: {
			type: String,
			enum: Object.values(CHAT_TYPES),
			default: CHAT_TYPES.GAME,
			// required: true, //@NOTE: Require this later on
		},
	},
	{ timestamps: true }
)

const ChatModel = model<IChat>('Chat', ChatSchema)

export default ChatModel
