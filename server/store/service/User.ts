import { utils } from 'ethers'

import ServiceBase from './ServiceBase'
import type { User } from '../schema/types'
import { PearHash } from '../utils'

export default class UserService extends ServiceBase<User> {
	// Fetch userEntity by publicAddress
	public async getUserEntity(publicAddress: string) {
		return this.repo.search().where('publicAddress').eq(publicAddress).returnFirst()
	}

	// Check if publicAddress exists.
	// If true, generate a new nonce, update the player record, and return the nonce
	// If false, generate a new nonce, create a new player record, and return the none
	public async authPublicAddress(publicAddress: string) {
		if (!utils.isAddress(publicAddress)) throw new Error('Public address is not valid')
		const nonceHex = PearHash.generateNonceHex()

		let userEntity = await this.getUserEntity(publicAddress)

		// If userEntity doesn't exist, create a new user entity and pass in generated nonce
		if (!userEntity) {
			await this.repo.createAndSave({
				publicAddress,
				nonce: nonceHex,
				createdAt: Date.now(),
			})

			console.log('Generated new player record for:', publicAddress)

			// else update nonce for current user
		} else {
			userEntity.nonce = nonceHex
			await this.repo.save(userEntity)

			console.log('Updated nonce for player:', publicAddress)
		}

		return nonceHex
	}

	// Fetch userEntity nonce by publicAddress
	public async getUserNonce(publicAddress: string) {
		if (!utils.isAddress(publicAddress)) throw new Error('Public address is not valid')

		const userEntity = await this.getUserEntity(publicAddress)

		if (!userEntity) {
			throw new Error(`User does not exist with publicAddress: ${publicAddress}`)
		}

		return userEntity.nonce
	}

	// Checks if user exists by publicAddress
	public async playerExists(publicAddress: string) {
		const count = await this.repo
			.search()
			.where('publicAddress')
			.eq(publicAddress)
			.returnCount()

		return count > 0
	}
}
