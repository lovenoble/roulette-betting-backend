import { fareAPI, spinAPI } from '../../crypto'

import type { IServiceObj } from '../types'
import { EventNames } from '../constants'
import { StoreQueue } from '../queue'
import { logger } from '../utils'

import createFareTokenListener from './fareToken'
import createSpinGameListener from './spinGame'

export default class SmartContractListener {
	service!: IServiceObj
	listeners!: ReturnType<typeof createFareTokenListener> &
		ReturnType<typeof createSpinGameListener>

	public get listenerCount() {
		return Object.keys(this.listeners).length
	}

	constructor(service: IServiceObj, storeQueue: StoreQueue) {
		this.service = service
		this.listeners = {
			...createFareTokenListener(service, storeQueue),
			...createSpinGameListener(service, storeQueue),
		}
	}

	private async beforeStart() {
		await this.service.gameMode.ensureGameModes()
	}

	private async reconnect() {
		let fareApiListeners = fareAPI.contract.listenerCount()
		let spinApiListeners = spinAPI.contract.listenerCount()
		let reconnectAttempts = 5

		await this.stop()

		while (reconnectAttempts > 0 && fareApiListeners + spinApiListeners < 5) {
			logger.warn('Attempting to reconenct...')

			fareAPI.contract.removeAllListeners()
			spinAPI.contract.removeAllListeners()

			fareAPI.contract.on(EventNames.Transfer, this.listeners.fareTransfer)
			spinAPI.contract.on(EventNames.GameModeUpdated, this.listeners.gameModeUpdated)
			spinAPI.contract.on(EventNames.EntrySubmitted, this.listeners.entrySubmitted)
			spinAPI.contract.on(EventNames.RoundConcluded, this.listeners.roundConcluded)
			spinAPI.contract.on(EventNames.EntrySettled, this.listeners.entrySettled)

			fareApiListeners = fareAPI.contract.listenerCount()
			spinApiListeners = spinAPI.contract.listenerCount()

			reconnectAttempts -= 1
		}
	}

	async start() {
		await this.beforeStart()

		try {
			// Fare
			fareAPI.contract.on(EventNames.Transfer, this.listeners.fareTransfer)

			// Spin
			spinAPI.contract.on(EventNames.GameModeUpdated, this.listeners.gameModeUpdated)
			spinAPI.contract.on(EventNames.EntrySubmitted, this.listeners.entrySubmitted)
			spinAPI.contract.on(EventNames.RoundConcluded, this.listeners.roundConcluded)
			spinAPI.contract.on(EventNames.EntrySettled, this.listeners.entrySettled)

			// @NOTE: Need to implement NFTWon event
			// spinAPI.contract.on(EventNames.NFTWon, this.listeners.nftWon)

			// @NOTE: Perhaps this event won't be needed since we already get the random number from roundConcluded
			// spinAPI.contract.on(EventNames.RandomNumberRequested, (...args) => console.log(args))
		} catch (err) {
			logger.error(err)
			await this.reconnect()
		}
	}

	async stop() {
		fareAPI.contract.removeAllListeners()
		spinAPI.contract.removeAllListeners()
	}
}
