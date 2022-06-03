import { fareAPI, spinAPI } from '../../crypto'

import { EventNames } from '../constants'
import type { IServiceObj } from '../types'
import { StoreQueue } from '../queue'

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

	async start() {
		await this.beforeStart()

		// Fare
		fareAPI.contract.on(EventNames.Transfer, this.listeners.fareTransfer)

		// Spin
		spinAPI.contract.on(EventNames.GameModeUpdated, this.listeners.gameModeUpdated)
		spinAPI.contract.on(EventNames.EntrySubmitted, this.listeners.entrySubmitted)
		spinAPI.contract.on(EventNames.RoundConcluded, this.listeners.roundConcluded)
		spinAPI.contract.on(EventNames.EntrySettled, this.listeners.entrySettled)

		// @NOTE: Perhaps this event won't be needed since we already get the random number from roundConcluded
		// spinAPI.contract.on(EventNames.RandomNumberRequested, (...args) => console.log(args))
	}

	async stop() {
		fareAPI.contract.removeAllListeners()
		spinAPI.contract.removeAllListeners()
	}
}
