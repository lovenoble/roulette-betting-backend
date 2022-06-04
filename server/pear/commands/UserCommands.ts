import { Command } from '@colyseus/command'

import type { SpinRoom } from '../types'
import { WebSocketCloseCode } from '../constants'

import crypto from '../../crypto'
import { logger, findClientBySessionId } from '../utils'
import { User, IUserOptions, GuestUser, IGuestUser } from '../entities'
import store from '../../store'

export class OnGuestUserJoined extends Command<SpinRoom, IGuestUser> {
	async execute({ guestId, sessionId }: IGuestUser) {
		const guestUser = new GuestUser({
			guestId,
			sessionId,
		})

		this.state.guestUsers.set(sessionId, guestUser)
	}
}

export class OnUserJoined extends Command<SpinRoom, IUserOptions> {
	async execute({ publicAddress, sessionId }: { publicAddress: string; sessionId: string }) {
		try {
			// @NOTE: Move this to UserService
			const balance = await crypto.getBalances(publicAddress)

			const {
				username,
				colorTheme,
				sessionId: previousSessionId,
			} = await store.service.user.getUserByAddress(publicAddress)

			// If user sessionId still exists disconnect previous session from Room
			if (previousSessionId) {
				const client = findClientBySessionId(previousSessionId, this.room.clients)
				if (client) {
					logger.info(
						`User already in room. Disconnecting previous client: sessionId(${sessionId}) publicAddress(${publicAddress})`
					)

					// Throw error to client so frontend app can handle redirection and popup message
					client.error(
						WebSocketCloseCode.NEW_CONNECTION_SESSION,
						'Client with same publicAddress connected. Only one client can connect per publicAddress.'
					)

					// Disconnect client from room session
					client.leave(WebSocketCloseCode.NEW_CONNECTION_SESSION)
				}
			}

			await store.service.user.updateUserSessionId(publicAddress, sessionId)
			logger.info(`Updated user(${publicAddress}) sessionId in RedisStore: ${sessionId}`)

			const userOptions: IUserOptions = {
				sessionId,
				publicAddress,
				username,
				colorTheme,
				balance,
			}

			const user = new User(userOptions)

			this.state.users.set(sessionId, user)
		} catch (err) {
			// @NOTE: NEED TO ADD ERROR QUEUE WHEN THIS IS HIT
			logger.error(err)
			throw new Error(err.toString())
		}
	}
}

export class OnBalanceUpdate extends Command<
	SpinRoom,
	{
		playerAddress: string
	}
> {
	async execute({ playerAddress }) {
		try {
			const { eth, fare } = await crypto.getBalances(playerAddress)

			const user = this.state.users.get(playerAddress)

			user.balance.eth = eth
			user.balance.fare = fare
		} catch (err) {
			// @NOTE: NEED TO ADD ERROR QUEUE WHEN THIS IS HIT
			logger.error(err)
			throw new Error(err.toString())
		}
	}
}

export class OnUserLeave extends Command<
	SpinRoom,
	{
		sessionId: string
	}
> {
	async execute({ sessionId }: { sessionId: string }) {
		try {
			// Remove player from state
			if (this.state.users.has(sessionId)) {
				// Clear sessionId on user model for Redis
				await store.service.user.clearOutSessionId(sessionId)
				this.state.users.delete(sessionId)
				logger.info('User has left SpinRoom:', sessionId)
			} else if (this.state.guestUsers.has(sessionId)) {
				this.state.guestUsers.delete(sessionId)
				logger.info('GuestUser has left SpinRoom:', sessionId)
			} else {
				logger.warn(
					"User left room but their sessionId wasn't in state. Look into why that is."
				)
			}
		} catch (err) {
			// @NOTE: NEED TO ADD ERROR QUEUE WHEN THIS IS HIT
			logger.error(err)
			throw new Error(err.toString())
		}
	}
}
