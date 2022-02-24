import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { utils } from 'ethers'

// Types
import { JWTDecodedData } from '../types/Utils'

// @NOTE: Need an environment variable for salt rounds value
const saltRounds = process.env.SALT_ROUNDS || 10
const jwtSecret = process.env.JWT_SECRET || 'pears-are-yumyum4life'
const jwtExpiration = process.env.JWT_EXPIRATION || '14d'

class PearHash {
    static async hash(password) {
        try {
            const salt = await bcrypt.genSalt(saltRounds)

            return bcrypt.hash(password, salt)
        } catch (err) {
            console.log(err)
            return err
        }
    }

    static async compare(password, hash): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hash, (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }

    static async generateJwt(data: JWTDecodedData): Promise<string> {
        try {
            const authToken = jwt.sign(data, jwtSecret, {
                expiresIn: jwtExpiration,
            })

            return authToken
        } catch (err: any) {
            throw new Error(err.toString())
        }
    }

    static async decodeJwt(token: string): Promise<JWTDecodedData> {
        try {
            const decoded = jwt.verify(token, jwtSecret)

            return decoded
        } catch (err: any) {
            throw new Error(err.toString())
        }
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
