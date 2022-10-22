import type { Client } from '@colyseus/core'
import { Command } from '@colyseus/command'

import type { SpinRoom } from '../types'
import { WebSocketCloseCode, SpinEvent } from '../constants'

import crypto from '../../crypto'
import { logger, findClientBySessionId } from '../utils'
import { User, IUser, GuestUser, IGuestUser } from '../entities'
import store from '../../store'

export class OnGuestUserJoined extends Command<SpinRoom, IGuestUser & { client: Client }> {
	async execute({ guestId, client }: IGuestUser & { client: Client }) {
		const guestUser = new GuestUser({
			guestId,
			sessionId: client.sessionId,
		})

		// @NOTE: Add this back later
		// client.send(SpinEvent.SendRoomData, {
		// 	guestId,
		// 	countdown: this.room.currentCountdown,
		// 	roomStatus: this.state.roomStatus,
		// 	fareTotalSupply: this.state.fareTotalSupply,
		// 	currentRoundId: this.state.currentRoundId,
		// })

		this.state.guestUsers.set(client.sessionId, guestUser)
	}
}

export class OnUserJoined extends Command<SpinRoom, IUser & { client: Client }> {
	async execute({ publicAddress, client }: { publicAddress: string; client: Client }) {
		try {
			const { sessionId } = client

			const balance = await crypto.getBalances(publicAddress)

			const {
				username,
				colorTheme,
				sessionId: previousSessionId,
			} = await store.service.user.getUserByAddress(publicAddress)

			// If user sessionId still exists disconnect previous session from Room
			if (previousSessionId) {
				const prevClient = findClientBySessionId(previousSessionId, this.room.clients)
				if (prevClient) {
					logger.info(
						`User already in room. Disconnecting previous client: sessionId(${previousSessionId}) publicAddress(${publicAddress})`,
					)

					// Throw error to client so frontend app can handle redirection and popup message
					prevClient.error(
						WebSocketCloseCode.NEW_CONNECTION_SESSION,
						'Client with same publicAddress connected. Only one client can connect per publicAddress.',
					)

					// Disconnect client from room session
					prevClient.leave(WebSocketCloseCode.NEW_CONNECTION_SESSION)
				}
			}

			await store.service.user.updateUserSessionId(publicAddress, sessionId)
			logger.info(`Updated user(${publicAddress}) sessionId in RedisStore: ${sessionId}`)

			const userOptions: IUser = {
				sessionId,
				publicAddress,
				username,
				colorTheme,
				balance,
			}

			const user = new User(userOptions)

			this.state.users.set(sessionId, user)

			client.send(SpinEvent.SendRoomData, {
				countdown: this.room.currentCountdown,
				roomStatus: this.state.roomStatus,
				fareTotalSupply: this.state.fareTotalSupply,
				currentRoundId: this.state.currentRoundId,
			})
		} catch (err) {
			// @NOTE: NEED TO ADD ERROR QUEUE WHEN THIS IS HIT
			logger.error(new Error(err.toString()))
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

			if (!user) return

			user.ethBalance = eth
			user.fareBalance = fare

			user.balance.eth = eth
			user.balance.fare = fare
		} catch (err) {
			// @NOTE: NEED TO ADD ERROR QUEUE WHEN THIS IS HIT
			logger.error(new Error(err.toString()))
			throw new Error(err.toString())
		}
	}
}

type OnUserLeaveOptions = {
	sessionId: string
	client: Client
	consented: boolean
}
export class OnUserLeave extends Command<SpinRoom, OnUserLeaveOptions> {
	async execute({ sessionId, client, consented }: OnUserLeaveOptions) {
		try {
			// @NOTE: Need to add connected property to users and guestUsers
			// this.state.guestUsers.get(client.sessionId).connected = false
			if (consented) {
				const logMessage = `Consented Leave -> ${JSON.stringify(client.userData)}`
				logger.info(logMessage)
				// throw new Error(logMessage)
			}

			if (this.state.users.has(sessionId)) {
				// Clear sessionId on user model for Redis
				await store.service.user.clearOutSessionId(sessionId)
				this.state.users.delete(sessionId)
				logger.info(`User has left SpinRoom: ${sessionId}`)
			} else if (this.state.guestUsers.has(sessionId)) {
				this.state.guestUsers.delete(sessionId)
				logger.info(`GuestUser has left SpinRoom: ${sessionId}`)
			} else {
				logger.warn(
					"User left room but their sessionId wasn't in state. Look into why that is.",
				)
			}

			// await this.room.allowReconnection(client, RECONNECT_TIME_LIMIT)

			// @NOTE: Need to add connected property to users and guestUsers
			// this.state.guestUsers.get(client.sessionId).connected = true
		} catch (err) {
			// @NOTE: NEED TO ADD ERROR QUEUE WHEN THIS IS HIT
			logger.error(new Error(err.toString()))
			throw new Error(err.toString())
		}
	}
}

// const RECONNECT_TIME_LIMIT = 30
// export class OnUserLeave extends Command<SpinRoom, OnUserLeaveOptions> {
// 	async execute({ sessionId, client, consented }: OnUserLeaveOptions) {
// 		try {
// 			// @NOTE: Need to add connected property to users and guestUsers
// 			// this.state.guestUsers.get(client.sessionId).connected = false
// 			if (consented) {
// 				const logMessage = `Consented Leave -> ${JSON.stringify(client.userData)}`
// 				logger.info(logMessage)
// 			}

// 			await this.room.allowReconnection(client, RECONNECT_TIME_LIMIT)

// 			// @NOTE: Need to add connected property to users and guestUsers
// 			// this.state.guestUsers.get(client.sessionId).connected = true
// 		} catch (err) {
// 			try {
// 				// Remove player from state
// 				if (this.state.users.has(sessionId)) {
// 					// Clear sessionId on user model for Redis
// 					await store.service.user.clearOutSessionId(sessionId)
// 					this.state.users.delete(sessionId)
// 					logger.info(`User has left SpinRoom: ${sessionId}`)
// 				} else if (this.state.guestUsers.has(sessionId)) {
// 					this.state.guestUsers.delete(sessionId)
// 					logger.info(`GuestUser has left SpinRoom: ${sessionId}`)
// 				} else {
// 					logger.warn(
// 						"User left room but their sessionId wasn't in state. Look into why that is."
// 					)
// 				}
// 			} catch (err) {
// 				// @NOTE: NEED TO ADD ERROR QUEUE WHEN THIS IS HIT
// 				logger.error(new Error(err.toString()))
// 				throw new Error(err.toString())
// 			}
// 		}
// 	}
// }
