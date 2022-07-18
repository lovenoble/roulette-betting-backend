import { fareAPI, spinAPI } from '../../crypto'

import type { IServiceObj } from '../types'
import { EventNames } from '../constants'
import { StoreQueue } from '../queue'
import { logger, sleep } from '../utils'

import createFareTokenListener from './fareToken'
import createSpinGameListener from './spinGame'

export default class SmartContractListener {
	#reconnectAttempts = 10
	#attemptInterval = 3_000
	#isReconnected = false
	service!: IServiceObj
	listeners!: ReturnType<typeof createFareTokenListener> &
		ReturnType<typeof createSpinGameListener>

	public get listenerCount() {
		return Object.keys(this.listeners).length
	}

	public get mountedListenerCount() {
		return fareAPI.contract.listenerCount() + spinAPI.contract.listenerCount()
	}

	constructor(service: IServiceObj, storeQueue: StoreQueue) {
		this.service = service
		this.listeners = {
			...createFareTokenListener(service, storeQueue),
			...createSpinGameListener(service, storeQueue),
		}
	}

	private async beforeStart() {
		await this.service.round.ensureSpinRoundPaused()
		await this.service.gameMode.ensureGameModes()
		await this.service.fareTransfer.updateTotalSupply()
		await this.service.round.updateCurrentRoundId()
	}

	private async reconnect() {
		const attempts = [...Array(this.#reconnectAttempts).keys()]

		const promiseList = attempts.map(attempt => {
			return async () => {
				try {
					if (this.#isReconnected) return

					this.stop()

					await this.beforeStart()
					this.#mountListeners()
					this.#isReconnected = true
				} catch (err) {
					logger.warn(`Could not connect to blockchain. Retrying: attempt - #${attempt}`)
					await sleep(this.#attemptInterval)
				}
			}
		})

		for (const prom of promiseList) {
			await prom()
		}

		if (!this.#isReconnected) {
			// @NOTE: Need red alert notification here
			logger.error(new Error('Reconnection attempts exceeded. Something is wrong!'))
			return
		}

		logger.info(`Provider has been reconnected successfully`)
		this.#isReconnected = false
	}

	#mountListeners() {
		// Fare
		fareAPI.contract.on(EventNames.Transfer, this.listeners.fareTransfer)

		// Spin
		spinAPI.contract.on(EventNames.GameModeUpdated, this.listeners.gameModeUpdated)
		spinAPI.contract.on(EventNames.EntrySubmitted, this.listeners.entrySubmitted)
		spinAPI.contract.on(EventNames.RoundConcluded, this.listeners.roundConcluded)
		spinAPI.contract.on(EventNames.EntrySettled, this.listeners.entrySettled)
		spinAPI.contract.on(EventNames.RoundPausedChanged, this.listeners.roundPausedChanged)
		// @NOTE: Need to implement NFTWon event
		// spinAPI.contract.on(EventNames.NFTWon, this.listeners.nftWon)

		// @NOTE: Perhaps this event won't be needed since we already get the random number from roundConcluded
		// spinAPI.contract.on(EventNames.RandomNumberRequested, (...args) => console.log(args))
	}

	async start() {
		try {
			await this.beforeStart()

			this.#mountListeners()
		} catch (err) {
			logger.error(new Error(err.toString()))
			this.reconnect()
		}
	}

	stop() {
		fareAPI.contract.removeAllListeners()
		spinAPI.contract.removeAllListeners()
	}
}
