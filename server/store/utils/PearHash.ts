import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { utils } from 'ethers'

import { SIGNING_MESSAGE_TEXT } from '../constants'
import { saltRounds, jwtSecret, jwtExpiration } from '../../config'

export type JWTDecodedData = {
	publicAddress: string
	nonce: string
}

export default abstract class PearHash {
	static async hash(password: string) {
		const salt = await bcrypt.genSalt(Number(saltRounds))

		return bcrypt.hash(password, salt)
	}

	static async compare(password: string, hash: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, hash, (err: any, res) => {
				if (err) {
					reject(err)
				} else {
					resolve(res)
				}
			})
		})
	}

	static async generateJwt(data: JWTDecodedData) {
		const authToken = jwt.sign(data, jwtSecret, {
			expiresIn: jwtExpiration,
		})

		return authToken
	}

	static async decodeJwt(token: string) {
		const decoded = jwt.verify(token, jwtSecret) as JWTDecodedData

		return decoded
	}

	static fromUtf8ToHex(str: string) {
		return utils.hexlify(utils.toUtf8Bytes(str))
	}

	static generateNonce() {
		return uuidv4()
	}

	static generateNonceHex() {
		return this.fromUtf8ToHex(uuidv4())
	}

	static getSigningMsgText() {
		return SIGNING_MESSAGE_TEXT
	}

	static generateNonceWithSigningMessage() {
		const nonce = this.generateNonceHex()

		return {
			nonce,
			signingMessage: `${SIGNING_MESSAGE_TEXT}${nonce}`,
		}
	}
}
