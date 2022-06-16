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

	/*  

	async function reconnect(){
  // connect w/ services 
	}
	*/

	// look up connect and disconnect logic and abstract into function
	// smart contracts get mounted here, if connection is lost, will not attempt to reconnect
	async start() {
		// should only occur on start, do not call again if reconnect needed
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

			/*
			let isDisconnected = await service0.isDisconnected() || await service1.isDisconnected() || await service2.isDisconnected() || await service3.isDisconnected()
			let reconnectAttempts = 10
			
			if(isDisconnected){
				while(reconnectAttempts > 0 && isDisconnected){
					await setTimeout(10000){
						await reconnect()
					}
				}
				
				reconnectAttempts -= 1

				isDisconnected = await service0.isDisconnected() || await service1.isDisconnected() || await service2.isDisconnected() || await service3.isDisconnected()
			}
			*/
		}
	}

	async stop() {
		fareAPI.contract.removeAllListeners()
		spinAPI.contract.removeAllListeners()
	}
}
