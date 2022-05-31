import { utils } from 'ethers'
import validator from 'validator'

import { userColorThemeToJSON } from '../../rpc/models/user'
import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from '../constants'
import { Omit } from '../types'
import type { SetUserDataRequest } from '../../rpc/models/user'
import ServiceBase from './ServiceBase'
import type { User } from '../types'
import { PearHash, logger, isValidUsername } from '../utils'

const { isEmail, isEmpty } = validator

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

	public async userAuthed(publicAddress: string) {
		const userEntity = await this.getUserByAddress(publicAddress)
		userEntity.lastAuthed = Date.now()
		return this.repo.save(userEntity)
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

	public async doesUsernameExist(username: string) {
		const userEntity = await this.getUserByUsername(username)

		return !!userEntity
	}

	public async setUserData(
		publicAddress: string,
		{ username: _username, email, colorTheme: _colorTheme }: Omit<SetUserDataRequest, 'token'>
	) {
		const userEntity = await this.getUserByAddress(publicAddress)
		const colorTheme = userColorThemeToJSON(_colorTheme)

		if (!userEntity) throw new Error('User does not exist.')

		if (!isEmpty(email) && !isEmail(email)) throw new Error('Invalid email address')
		if (!isEmpty(_username)) {
			const username = _username.trim()
			if (!isValidUsername(username)) {
				throw new Error(
					`Username is invalid. Valid format: [a-zA-Z0-9_] | Min: ${USERNAME_MIN_LENGTH} | Max: ${USERNAME_MAX_LENGTH}`
				)
			}
			const doesExist = await this.doesUsernameExist(username)
			if (doesExist) throw new Error('Username already exists.')

			userEntity.username = username
		}

		if (colorTheme !== 'UNRECOGNIZED') {
			userEntity.colorTheme = colorTheme
		}

		userEntity.email = email || userEntity.email

		return this.repo.save(userEntity)
	}
}
