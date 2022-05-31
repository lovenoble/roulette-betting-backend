import { Room, ServerError, Delayed } from '@colyseus/core'
import type { Client } from '@colyseus/core'
import { Dispatcher } from '@colyseus/command'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import type { ISpinRoomOptions, ICreateSpinRoomOptions } from '../types'
import { EventNames } from '../../store/constants'
import { HttpStatusCode } from '../constants'
import { SpinEvent, FareEvent } from '../../store/event'
import {
	OnBatchEntry,
	OnBatchEntrySettled,
	OnUserJoined,
	OnGuestUserJoined,
	OnBalanceUpdate,
	OnUserLeave,
} from '../commands'
import SpinState from '../state/SpinState'
import { logger } from '../utils'
import store from '../../store'

dayjs.extend(relativeTime)

// @NOTE: Determine user balancing for room capacity - [spin-room-1: 1800, spin-room-2: 600]
// @NOTE: VIP room rentals for FARE token (smart contract)

const fareEvent = FareEvent()
const spinEvent = SpinEvent()

// spinEvent.on('completed', ({ jobId, returnvalue, prev }, id) => {
// spinEvent.on('completed', ({ returnvalue }) => {
//     try {
//         if (!returnvalue) return

//         const { eventName, data }: IEventReturnData = JSON.parse(returnvalue)

//         console.log(eventName, data)

//         switch (eventName) {
//             case EventNames.GameModeUpdated:
//                 console.log(eventName)
//                 break
//             case EventNames.EntrySubmitted:
//                 console.log(eventName)
//                 break
//             case EventNames.RoundConcluded:
//                 console.log(eventName)
//                 break
//             case EventNames.EntrySettled:
//                 console.log(eventName)
//                 break
//             default:
//                 throw new Error(`[QueueEvent:Spin] Invalid event name ${eventName}`)
//         }
//     } catch (err) {
//         // @NOTE: Need error catching here, most likely error is a JSON parsing issue
//         console.error(err)
//     }
// })

class SpinGame extends Room<SpinState> {
	maxClients = 2500 // @NOTE: Need to determine the number of clients where performance begins to fall off
	dispatcher = new Dispatcher(this)
	#name: string
	#desc: string
	#password: string | null = null

	public delayedInterval!: Delayed

	defineEvents() {
		spinEvent.on('completed', ({ returnvalue }) => {
			try {
				if (!returnvalue) return

				const { eventName, data } = JSON.parse(returnvalue)

				console.log(eventName, data)

				switch (eventName) {
					case EventNames.GameModeUpdated:
						console.log(eventName)
						break
					case EventNames.EntrySubmitted:
						this.dispatcher.dispatch(new OnBatchEntry(), data)
						console.log(eventName)
						break
					case EventNames.RoundConcluded:
						console.log(eventName)
						break
					case EventNames.EntrySettled:
						this.dispatcher.dispatch(new OnBatchEntrySettled(), data)
						console.log(eventName)
						break
					default:
						throw new Error(`[QueueEvent:Spin] Invalid event name ${eventName}`)
				}
			} catch (err) {
				// @NOTE: Need error catching here, most likely error is a JSON parsing issue
				console.error(err)
			}
		})
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

			// @NOTE: Define WebSocket message handling here
			// Define Redis pubsub events
			this.defineEvents()

			this.startTimer()
		} catch (err) {
			// @NOTE: Need better error handling here. If this fails the state doesn't get set
			logger.error(err)
			throw new ServerError(HttpStatusCode.INTERNAL_SERVER_ERROR, err.toString())
		}
	}

	// @NOTE: Create dispatch command
	// @NOTE: Consider sending the elapsedTime initially and just verfying with the client the countdown time
	// @NOTE: Rather to constantly updating the clients with the new time
	startTimer() {
		// @NOTE: Define timer here
		this.clock.start()
		const endTime = dayjs().add(300, 'seconds')
		this.state.timer.runTimeMs = dayjs().add(300, 'seconds').unix()

		this.delayedInterval = this.clock.setInterval(() => {
			const startTime = dayjs()
			const diff = endTime.diff(startTime, 'seconds')
			const display = startTime.to(endTime)
			this.state.timer.timeDisplay = display
			this.state.timer.elapsedTime = diff
		}, 1000)

		this.clock.setTimeout(() => {
			this.delayedInterval.clear()
		}, this.state.timer.runTimeMs)
	}

	async onAuth(_client: Client, options: ISpinRoomOptions = {}) {
		try {
			const { authToken, guestId } = options

			if (authToken) {
				const user = await store.service.user.getUserFromToken(authToken)

				if (!user) {
					logger.error('Invalid user authToken.')
					throw new ServerError(HttpStatusCode.UNAUTHORIZED, 'Invalid user authToken.')
				}

				return user.publicAddress
			}
			if (guestId) {
				logger.info('User logging in as guest with username:', guestId)
				return `guest:${guestId}`
			}

			throw new ServerError(
				HttpStatusCode.UNAUTHORIZED,
				'A valid token is required to connect to room.'
			)
		} catch (err) {
			logger.error(err.toString())
			throw new ServerError(HttpStatusCode.INTERNAL_SERVER_ERROR, err.toString())
		}
	}

	async onJoin(client: Client, _options: ISpinRoomOptions = {}, auth?: string) {
		try {
			/* @ts-ignore */
			const { sessionId } = client
			const [publicAddress, guestId] = auth.split(':')
			logger.info(publicAddress, guestId)

			if (guestId) {
				this.dispatcher.dispatch(new OnGuestUserJoined(), { sessionId, guestId })
			} else if (publicAddress) {
				logger.info('Updated users sessionId:', publicAddress, sessionId)
				this.dispatcher.dispatch(new OnUserJoined(), {
					publicAddress,
					sessionId,
				})
			} else {
				throw new ServerError(
					HttpStatusCode.INTERNAL_SERVER_ERROR,
					'Auth token does not exist.'
				)
			}
		} catch (err) {
			logger.error(err.toString())
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
		this.delayedInterval.clear()
		this.clock.clear()
		this.dispatcher.stop()
		logger.info('Disposing of SpinGame room...')
	}
}

export default SpinGame
