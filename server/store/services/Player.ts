import { utils } from 'ethers'

import PlayerModel from '../models/Player'
import PearHash from '../../pears/utils/PearHash'
import { createLog } from '../../pears/utils'

const LOG_PATH = '[db/services/PlayerService.authPublicAddress]:'

const [logInfo, logError] = createLog(LOG_PATH)

abstract class PlayerService {
    public static model = PlayerModel

    public static saveState() {
        logInfo('Implement saveState() in your service.')
    }

    // Check if publicAddress exists.
    // If true, generate a new nonce, update the player record, and return the nonce
    // If false, generate a new nonce, create a new player record, and return the none
    public static async authPublicAddress(
        publicAddress: string
    ): Promise<string> {
        try {
            if (!utils.isAddress(publicAddress)) throw new Error('Public address is not valid')
            const nonceHex = PearHash.generateNonceHex()
            let player = await this.model.findOne(
                {
                    publicAddress,
                },
                '_id publicAddress nonce'
            )

            // If player doesn't exist, create a new player record
            if (!player) {
                player = await this.model.create({
                    publicAddress,
                    nonce: nonceHex,
                })
                logInfo(
                    'Generated new player record for:',
                    publicAddress
                )
            } else {
                console.log(nonceHex)
                await player.updateOne({
                    nonce: nonceHex
                })
                logInfo('Updated nonce for player:', publicAddress)
            }

            return nonceHex
        } catch (err) {
            logError(err.toString())
            throw new Error(err.toString())
        }
    }

    public static async getPlayerNonce(publicAddress: string): Promise<string> {
        try {
            if (!utils.isAddress(publicAddress)) throw new Error('Public address is not valid')

            const player = await this.model.findOne(
                {
                    publicAddress,
                },
                '_id publicAddress nonce'
            )

            logInfo('Found user:', publicAddress)

            if (!player) {
                throw new Error(
                    `User does not exist with publicAddress: ${publicAddress}`
                )
            }

            return player.nonce
        } catch (err) {
            logError(err.toString())
            throw new Error(err.toString())
        }
    }

    public static async playerExists(publicAddress) {
        try {
            const count = await this.model.countDocuments({ publicAddress })

            return count > 0
        } catch (err) {
            logError(err.toString())
            throw new Error(err.toString())
        }
    }
}

export default PlayerService
