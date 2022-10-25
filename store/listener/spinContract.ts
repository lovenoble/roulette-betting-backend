import type { BigNumber, Event } from 'ethers'

import { BNToNumber, formatBN } from '../utils'
import { EventNames, ContractNames } from '../constants'
import {
	IContractModeUpdatedQueue,
	IEntrySubmittedQueue,
	IEntrySettledQueue,
	IRoundConcludedQueue,
} from '../types'
import type { StoreQueue } from '../queue'
import type { IServiceObj } from '../types'
import PubSub from '../../pubsub'

const createSpinContractListener = (service: IServiceObj, storeQueue: StoreQueue) => {
	const { eventLog } = service

	const contractModeUpdated = async (contractModeId: BigNumber, event: Event) => {
		const queueData: IContractModeUpdatedQueue = {
			contractModeId: BNToNumber(contractModeId),
			event: eventLog.parseForQueue(event, ContractNames.FareSpin),
			timestamp: Date.now(),
		}
		await storeQueue.spinContract.add(EventNames.ContractModeUpdated, queueData)
	}

	const entrySubmitted = async (
		roundId: BigNumber,
		batchEntryId: BigNumber,
		player: string,
		event: Event,
	) => {
		const queueData: IEntrySubmittedQueue = {
			roundId: BNToNumber(roundId),
			batchEntryId: BNToNumber(batchEntryId),
			player,
			event: eventLog.parseForQueue(event, ContractNames.FareSpin),
			timestamp: Date.now(),
		}

		await storeQueue.spinContract.add(EventNames.EntrySubmitted, queueData)
	}

	const roundConcluded = async (
		roundId: BigNumber,
		vrfRequestId: string,
		randomNum: BigNumber,
		randomEliminator: BigNumber,
		event: Event,
	) => {
		const queueData: IRoundConcludedQueue = {
			roundId: BNToNumber(roundId),
			vrfRequestId,
			randomNum: BNToNumber(randomNum),
			randomEliminator: formatBN(randomEliminator, 0),
			event: eventLog.parseForQueue(event, ContractNames.FareSpin),
			timestamp: Date.now(),
		}

		await storeQueue.spinContract.add(EventNames.RoundConcluded, queueData)
	}

	const entrySettled = async (
		roundId: BigNumber,
		player: string,
		hasWon: boolean,
		event: Event,
	) => {
		const queueData: IEntrySettledQueue = {
			roundId: BNToNumber(roundId),
			player,
			hasWon,
			event: eventLog.parseForQueue(event, ContractNames.FareSpin),
			timestamp: Date.now(),
		}

		await storeQueue.spinContract.add(EventNames.EntrySettled, queueData)
	}

	// @NOTE: Probably don't need to send this to a worker since it's less frequently called
	const roundPausedChanged = async (isPaused: boolean) => {
		await PubSub.pub<'spin-round-pause'>('spin-state', 'spin-round-pause', {
			isPaused,
			countdown: await service.round.getSpinCountdownTimer(),
		})
		await service.round.setSpinRoundPaused(isPaused)
	}

	return {
		contractModeUpdated,
		entrySubmitted,
		roundConcluded,
		entrySettled,
		roundPausedChanged,
	}
}

export default createSpinContractListener
