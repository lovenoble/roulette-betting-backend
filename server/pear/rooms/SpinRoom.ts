import type { Client } from '@colyseus/core'
import { Room, ServerError, Delayed } from '@colyseus/core'
import { Dispatcher } from '@colyseus/command'
import shortId from 'shortid'

import type { IDefaultRoomOptions, ICreateSpinRoomOptions } from '../types'
import { HttpStatusCode, SpinEvent, MAX_SPIN_CLIENTS } from '../constants'
import { INITIAL_COUNTDOWN_SECS } from '../../crypto/constants'
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
	// OnBalanceUpdate,
	// OnBatchEntrySettled,
} from '../commands'
import SpinState from '../state/SpinState'
import { logger } from '../utils'
import store from '../../store'
import PubSub from '../../pubsub'

class SpinGame extends Room<SpinState> {
	#name: string
	#desc: string
	#password: string | null = null
	#currentCountdown = INITIAL_COUNTDOWN_SECS

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

	get currentCountdown() {
		return this.#currentCountdown
	}

	async onCreate(options: ICreateSpinRoomOptions) {
		try {
			const { name, desc, password } = options
			logger.info('Creating new SpinRoom', name, desc)

			this.#name = name
			this.#desc = desc
			this.#password = password

			let hasPassword = false
			if (password) {
				// @NOTE: Handle hashing password before setting the metadata
				logger.info('Password was set', password)
				hasPassword = true
			}

			this.setMetadata({
				name,
				desc,
				hasPassword,
			})

			this.setState(new SpinState())

			// @NOTE: This should be initialized by smart contract events
			// this.startCountdown()

			// Initialize SpinRoom state
			await this.dispatcher.dispatch(new OnInitSpinRoom())

			// #region Client action events

			this.onMessage('*', (client, type, message) => {
				logger.info(`New client action from ${client.sessionId} - ${type} - ${message}`)
			})

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
				this.dispatcher.dispatch(new OnBatchEntry(), data)
			})

			// Spin Round has concluded (increment round)
			PubSub.sub('spin-state', 'round-concluded').listen<'round-concluded'>(data => {
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

			// #endregion
		} catch (err) {
			// @NOTE: Need better error handling here. If this fails the state doesn't get set
			logger.error(err)
			throw new ServerError(HttpStatusCode.INTERNAL_SERVER_ERROR, err.toString())
		}
	}

	startCountdownOld() {
		// OLD
		try {
			if (this.clock.running || this.delayedInterval?.active) this.resetCountdown()
			this.#currentCountdown = INITIAL_COUNTDOWN_SECS // Set initial countdown value

			this.clock.start()
			this.state.roomStatus = 'countdown'

			// export type SpinRoomStatus = 'paused' | 'countdown' | 'wheel-spinning' | 'round-finished'
			this.delayedInterval = this.clock.setInterval(() => {
				logger.info(
					`countdown(${this.currentCountdown} secs), deltaTime(${
						this.clock.deltaTime
					} ms), elaspedTime(${this.clock.elapsedTime / 1000} secs)`
				)
				this.#currentCountdown -= 1

				// If countdown has already hit 0 interval should be existed
				if (this.currentCountdown < 0) {
					this.state.roomStatus = 'wheel-spinning'
					this.delayedInterval.clear()
					this.clock.clear()

					this.#currentCountdown = 30
					this.broadcast(SpinEvent.TimerUpdated, this.currentCountdown)
					this.delayedInterval = this.clock.setInterval(() => {
						this.#currentCountdown -= 1

						if (this.currentCountdown < 0) {
							this.delayedInterval.clear()
							this.clock.clear()
							this.state.roomStatus = 'round-finished'
							this.#currentCountdown = 0
						} else {
							this.broadcast(SpinEvent.TimerUpdated, this.currentCountdown)
						}
					}, 1000)

					logger.info('Clock has finished ticking')
					return
				}

				this.broadcast(SpinEvent.TimerUpdated, this.currentCountdown)
			}, 1000)
		} catch (err) {
			logger.error(err)
		}
	}

	pauseCountdown() {
		if (this.delayedInterval) this.delayedInterval.pause()
		this.clock.stop()
	}

	resumeCountdown() {
		if (this.delayedInterval && this.delayedInterval.paused) this.delayedInterval.resume()
		this.clock.start()
	}

	resetCountdown() {
		this.stopCountdown()
		this.#currentCountdown = INITIAL_COUNTDOWN_SECS
		console.log('reset')
	}

	stopCountdown() {
		if (this.delayedInterval) this.delayedInterval.clear()
		this.clock.clear()
		this.clock.stop()
	}

	async onAuth(client: Client, options: IDefaultRoomOptions = {}) {
		try {
			const { authToken } = options
			// Handle authenticated user
			if (authToken) {
				const user = await store.service.user.getUserFromToken(authToken)

				if (!user) {
					logger.error('Invalid user authToken.')
					throw new ServerError(HttpStatusCode.UNAUTHORIZED, 'Invalid user authToken.')
				}

				// @NOTE: Implement setting user data here
				client.userData = { authToken, publicAddress: user.publicAddress }
				return user.publicAddress
			}

			// Handle guest user
			const guestId = shortId() // Generate guestId

			// @NOTE: Moved this to onGuestJoined dispatch
			// logger.info(`User logging in as guest with username: ${guestId}`)
			// client.send(SpinEvent.GuestUserJoined, guestId)

			// @NOTE: Implement setting user data here
			client.userData = { authToken, guestId }

			return `guest:${guestId}`
		} catch (err: any) {
			logger.error(err)
			throw new ServerError(HttpStatusCode.INTERNAL_SERVER_ERROR, err.toString())
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
			throw new ServerError(HttpStatusCode.INTERNAL_SERVER_ERROR, err.toString())
		}
	}

	onLeave(client: Client) {
		const { sessionId } = client

		this.dispatcher.dispatch(new OnUserLeave(), {
			sessionId,
		})
	}

	onDispose() {
		// @NOTE: Need to clear garbage here

		// if (this.pear.pearTokenContract && this.pear.pearGameContract) {
		// 	this.pear.pearTokenContract.removeAllListeners()
		// 	this.pear.pearGameContract.removeAllListeners()
		// }
		this.stopCountdown()
		this.dispatcher.stop()
		logger.info('Disposing of SpinGame room...')
	}
}

export default SpinGame
