import type { Client } from '@colyseus/core'
import { Room, ServerError, Delayed } from '@colyseus/core'
import { Dispatcher } from '@colyseus/command'
import shortId from 'shortid'

import type { IDefaultRoomOptions, ICreateSpinRoomOptions } from '../types'
import { HttpStatusCode, SpinEvent, MAX_SPIN_CLIENTS, WebSocketCloseCode } from '../constants'
import {
	OnBatchEntry,
	OnUserJoined,
	OnGuestUserJoined,
	OnUserLeave,
	OnFareTotalSupplyUpdated,
	OnInitSpinRoom,
	OnRoundConcluded,
	OnNewChatMessage,
	OnFareTransfer,
	OnResetRound,
	// OnBalanceUpdate,
	// OnBatchEntrySettled,
} from '../commands'
import { SpinState } from '../state/SpinState'
import { logger } from '../utils'
import store from '../../store'
import PubSub from '../../pubsub'

class SpinContract extends Room<SpinState> {
	#name: string
	#desc: string
	#password: string | null = null

	maxClients = MAX_SPIN_CLIENTS // @NOTE: Need to determine the number of clients where performance begins to fall off
	dispatcher = new Dispatcher(this)
	/**
	 * Using @gamestdio/timer (this.clock, Delayed)
	 * Once built-in setTimeout and setInterval relies on CPU load, functions may delay an unexpected amount of time to execute.
	 * Having it tied to a clock's time is guaranteed to execute in a precise way.
	 */
	delayedInterval?: Delayed

	get name() {
		return this.#name
	}

	get desc() {
		return this.#desc
	}

	get password() {
		// @NOTE: Ensure password, if set, is hashed
		return this.#password
	}

	async onCreate(options: ICreateSpinRoomOptions) {
		try {
			const { name, desc, password } = options
			logger.info(`Creating new SpinRoom: name --> ${name} description --> ${desc}`)

			this.#name = name
			this.#desc = desc
			this.#password = password

			let hasPassword = false
			if (password) {
				// @NOTE: Handle hashing password before setting the metadata
				logger.info(`Password was set ${password}`)
				hasPassword = true
			}

			this.setMetadata({
				name,
				desc,
				hasPassword,
			})

			this.setState(new SpinState())

			// Initialize SpinRoom state
			await this.dispatcher.dispatch(new OnInitSpinRoom())

			// #region Client action events

			this.onMessage('*', (client, type, message) => {
				logger.info(`New client action from ${client.sessionId} - ${type} - ${message}`)
			})

			this.onMessage('heartbeat', client => {
				console.log('Heartbeat', client.sessionId)
			})

			this.delayedInterval = this.clock.setInterval(() => {
				this.broadcast('heartbeat', 'heartbeat')
			}, 3000)

			this.onMessage(SpinEvent.NewChatMessage, (client, text: string) => {
				this.dispatcher.dispatch(new OnNewChatMessage(), { text, client })
			})

			// #endregion

			// #region PubSub

			// FareTransfer event (update player balances that apply)
			PubSub.sub('fare', 'fare-transfer').listen<'fare-transfer'>(transfer => {
				this.dispatcher.dispatch(new OnFareTransfer(), transfer)
			})

			// FareTotalSupply updated
			PubSub.sub('fare', 'fare-total-supply-updated').listen<'fare-total-supply-updated'>(
				({ totalSupply }) => {
					this.dispatcher.dispatch(new OnFareTotalSupplyUpdated(), totalSupply)
				}
			)

			// New BatchEntry + Entry[]
			PubSub.sub('spin-state', 'batch-entry').listen<'batch-entry'>(data => {
				console.log('batchEntry',data)
				this.dispatcher.dispatch(new OnBatchEntry(), data)
			})

			// Spin Round has concluded (increment round)
			PubSub.sub('spin-state', 'round-concluded').listen<'round-concluded'>(data => {
				console.log('round',this.state.round)
				this.dispatcher.dispatch(new OnRoundConcluded(), data)
			})

			PubSub.sub('spin-state', 'spin-round-pause').listen<'spin-round-pause'>(opt => {
				this.state.isRoundPaused = opt.isPaused
				this.broadcast(SpinEvent.TimerUpdated, opt.countdown)
			})

			PubSub.sub('spin-state', 'spin-room-status').listen<'spin-room-status'>(opt => {
				this.state.roomStatus = opt.status
			})

			PubSub.sub('spin-state', 'countdown-updated').listen<'countdown-updated'>(time => {
				this.broadcast(SpinEvent.TimerUpdated, time)
			})

			PubSub.sub('spin-state', 'reset-spin-round').listen<'reset-spin-round'>(_message => {
				this.dispatcher.dispatch(new OnResetRound())
			})

			// #endregion
		} catch (err) {
			// @NOTE: Need better error handling here. If this fails the state doesn't get set
			logger.error(err)
			throw new ServerError(HttpStatusCode.INTERNAL_SERVER_ERROR, err.toString())
		}
	}

	async onAuth(client: Client, options: IDefaultRoomOptions = {}) {
		try {
			const { authToken, networkUsername, networkActorNumber } = options
			// Handle authenticated user
			if (authToken) {
				const user = await store.service.user.getUserFromToken(authToken)

				if (!user) {
					logger.error(
						new Error('Invalid authToken. Please reauthenticate and try again.')
					)
					throw new ServerError(
						HttpStatusCode.UNAUTHORIZED,
						'Invalid authToken. Please reauthenticate and try again.'
					)
				}

				// @NOTE: Implement setting user data here
				client.userData = {
					authToken,
					publicAddress: user.publicAddress,
					networkUsername,
					networkActorNumber,
				}
				return user.publicAddress
			}

			// Handle guest user
			const guestId = shortId() // Generate guestId

			// @NOTE: Moved this to onGuestJoined dispatch
			// @NOTE: Implement setting user data here
			client.userData = { authToken, guestId, networkUsername, networkActorNumber }

			return `guest:${guestId}`
		} catch (err: any) {
			logger.error(err)

			setTimeout(
				() => client.leave(WebSocketCloseCode.POLICY_VIOLATION, (err as Error).message),
				0
			)
			if (err instanceof Error) {
				throw new ServerError(HttpStatusCode.INTERNAL_SERVER_ERROR, err.message)
			}
		}
	}

	onJoin(client: Client, _options: IDefaultRoomOptions = {}, auth?: string) {
		try {
			const [publicAddress, guestId] = auth.split(':')

			if (guestId) {
				this.dispatcher.dispatch(new OnGuestUserJoined(), { client, guestId })
			} else if (publicAddress) {
				this.dispatcher.dispatch(new OnUserJoined(), {
					client,
					publicAddress,
				})
			} else {
				throw new ServerError(
					HttpStatusCode.INTERNAL_SERVER_ERROR,
					'Auth token does not exist.'
				)
			}
		} catch (err) {
			logger.error(err)
			setTimeout(
				() => client.leave(WebSocketCloseCode.POLICY_VIOLATION, (err as Error).message),
				0
			)

			if (err instanceof Error) {
				throw new ServerError(HttpStatusCode.INTERNAL_SERVER_ERROR, err.message)
			}
		}
	}

	onLeave(client: Client, consented: boolean) {
		const { sessionId } = client

		this.dispatcher.dispatch(new OnUserLeave(), {
			sessionId,
			client,
			consented,
		})
	}

	onDispose() {
		this.dispatcher.stop()
		logger.info('Disposing of SpinContract room...')
	}
}

export default SpinContract
