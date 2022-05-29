import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { utils } from 'ethers'

import { saltRounds, jwtSecret, jwtExpiration } from '../../config/pear.config'
import { JWTDecodedData } from '../types/utils.types'

class PearHash {
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
}

export default PearHash
