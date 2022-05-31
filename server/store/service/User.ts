import { utils } from 'ethers'

import ServiceBase from './ServiceBase'
import type { User } from '../types'
import { PearHash, logger } from '../utils'

export default class UserService extends ServiceBase<User> {
    // Fetch userEntity by publicAddress
    public async getUserByAddress(publicAddress: string) {
        return this.repo.search().where('publicAddress').eq(publicAddress).returnFirst()
    }

    public async getUserByUsername(username: string) {
        return this.repo.search().where('username').eq(username).returnFirst()
    }

    // Check if publicAddress exists.
    // If true, generate a new nonce, update the player record, and return the nonce
    // If false, generate a new nonce, create a new player record, and return the none
    public async authPublicAddress(publicAddress: string) {
        if (!utils.isAddress(publicAddress)) throw new Error('Public address is not valid')
        const { nonce, signingMessage } = PearHash.generateNonceWithSigningMessage()

        const userEntity = await this.getUserByAddress(publicAddress)

        // If userEntity doesn't exist, create a new user entity and pass in generated nonce
        if (!userEntity) {
            await this.repo.createAndSave({
                publicAddress,
                nonce,
                isDisabled: false,
                createdAt: Date.now(),
            })

            logger.info('Generated new player record for:', publicAddress)

            // else update nonce for current user
        } else {
            userEntity.nonce = nonce
            await this.repo.save(userEntity)

            logger.info('Updated nonce for player:', publicAddress)
        }

        return { nonce, signingMessage }
    }

    // Fetch userEntity nonce by publicAddress
    public async getUserNonce(publicAddress: string) {
        if (!utils.isAddress(publicAddress)) throw new Error('Public address is not valid')

        const userEntity = await this.getUserByAddress(publicAddress)

        if (!userEntity) {
            throw new Error(`User does not exist with publicAddress: ${publicAddress}`)
        }

        return {
            nonce: userEntity.nonce,
            signingMessage: `${PearHash.getSigningMsgText()}${userEntity.nonce}`,
        }
    }

    // Checks if user exists by publicAddress
    public async exists(publicAddress: string) {
        const count = await this.repo
            .search()
            .where('publicAddress')
            .eq(publicAddress)
            .returnCount()

        return count > 0
    }

    public async logout(publicAddress: string) {
        const userEntity = await this.getUserByAddress(publicAddress)

        userEntity.sessionId = ''

        return this.repo.save(userEntity)
    }
}
