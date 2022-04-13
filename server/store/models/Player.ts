import Mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

import PearHash from '../../pears/utils/PearHash'

const { Schema, model } = Mongoose

export interface IPlayer {
	_id?: string
	sessionId?: string[] // @NOTE: Need to pass a custom pear-connect sessionId instead of colyseus sessionId
	username?: string
	publicAddress: string
	nonce: string
	password?: string // Optional password for user to further secure their account
	createdAt?: Date
	updatedAt?: Date
}

export const PlayerSchema = new Schema<IPlayer>(
	{
		sessionId: { type: [String], default: [] },
		username: { type: String }, // @NOTE: Need to add nullable unique constraint here
		publicAddress: { type: String, required: true, unique: true },
		nonce: { type: String, required: true, unique: true },
		password: { type: String },
	},
	{
		timestamps: true,
	}
)

PlayerSchema.plugin(uniqueValidator)

PlayerSchema.pre('save', async function hashPasswordCb(next) {
	try {
		this.updatedAt = new Date()

		if (!this.isModified('password')) {
			return next()
		}

		const hashedPassword = await PearHash.hash(this.password)

		this.password = hashedPassword
		return next()
	} catch (err) {
		return next(new Error(err.toString()))
	}
})

const PlayerModel = model<IPlayer>('Player', PlayerSchema)

export default PlayerModel
