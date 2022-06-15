import type { BigNumber, Event } from 'ethers'

import { BNToNumber, formatBN } from '../utils'
import { EventNames, ContractNames } from '../constants'
import {
	IGameModeUpdatedQueue,
	IEntrySubmittedQueue,
	IEntrySettledQueue,
	IRoundConcludedQueue,
} from '../types'
import type { StoreQueue } from '../queue'
import type { IServiceObj } from '../types'

const createSpinGameListener = (service: IServiceObj, storeQueue: StoreQueue) => {
	const { eventLog } = service

	const gameModeUpdated = async (gameModeId: BigNumber, event: Event) => {
		const queueData: IGameModeUpdatedQueue = {
			gameModeId: BNToNumber(gameModeId),
			event: eventLog.parseForQueue(event, ContractNames.FareSpinGame),
			timestamp: Date.now(),
		}
		await storeQueue.spinContract.add(EventNames.GameModeUpdated, queueData)
	}

	const entrySubmitted = async (
		roundId: BigNumber,
		batchEntryId: BigNumber,
		player: string,
		event: Event
	) => {
		const queueData: IEntrySubmittedQueue = {
			roundId: BNToNumber(roundId),
			batchEntryId: BNToNumber(batchEntryId),
			player,
			// entryId: BNToNumber(entryId), // TBR
			event: eventLog.parseForQueue(event, ContractNames.FareSpinGame),
			timestamp: Date.now(),
		}

		await storeQueue.spinContract.add(EventNames.EntrySubmitted, queueData)
	}

	// @NOTE: Need to pull in vrfNum, eliminators, and players array
	const roundConcluded = async (
		roundId: BigNumber,
		vrfRequestId: string,
		randomNum: BigNumber,
		randomEliminator: BigNumber,
		event: Event
	) => {
		const queueData: IRoundConcludedQueue = {
			roundId: BNToNumber(roundId),
			vrfRequestId,
			randomNum: BNToNumber(randomNum),
			randomEliminator: formatBN(randomEliminator, 0),
			event: eventLog.parseForQueue(event, ContractNames.FareSpinGame),
			timestamp: Date.now(),
		}

		await storeQueue.spinContract.add(EventNames.RoundConcluded, queueData)
	}

	const entrySettled = async (
		roundId: BigNumber,
		player: string,
		hasWon: boolean,
		event: Event
	) => {
		const queueData: IEntrySettledQueue = {
			roundId: BNToNumber(roundId),
			// batchEntryId: BNToNumber(batchEntryId), // TBR
			player,
			// entryId: BNToNumber(_NUentryId), // TBR
			hasWon,
			event: eventLog.parseForQueue(event, ContractNames.FareSpinGame),
			timestamp: Date.now(),
		}

		await storeQueue.spinContract.add(EventNames.EntrySettled, queueData)
	}

	return {
		gameModeUpdated,
		entrySubmitted,
		roundConcluded,
		entrySettled,
	}
}

export default createSpinGameListener
