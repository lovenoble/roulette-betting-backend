import type { BigNumber, Event } from 'ethers'

import { EventNames, ContractNames, BNToNumber, formatBN } from './utils'
import { EventLog } from '../service'
import { spinContractEventQueue } from '../queue'
import {
	IGameModeUpdatedQueue,
	IEntrySubmittedQueue,
	IEntrySettledQueue,
	IRoundConcludedQueue,
} from '../queue/queue.types'

export const gameModeUpdatedEvent = async (gameModeId: BigNumber, event: Event) => {
	const queueData: IGameModeUpdatedQueue = {
		gameModeId: BNToNumber(gameModeId),
		event: EventLog.parseForQueue(event, ContractNames.FareSpinGame),
		timestamp: Date.now(),
	}
	await spinContractEventQueue.add(EventNames.GameModeUpdated, queueData)
}

export const entrySubmittedEvent = async (
	roundId: BigNumber,
	batchEntryId: BigNumber,
	player: string,
	entryId: BigNumber,
	event: Event
) => {
	const queueData: IEntrySubmittedQueue = {
		roundId: BNToNumber(roundId),
		batchEntryId: BNToNumber(batchEntryId),
		player,
		entryId: BNToNumber(entryId),
		event: EventLog.parseForQueue(event, ContractNames.FareSpinGame),
		timestamp: Date.now(),
	}

	await spinContractEventQueue.add(EventNames.EntrySubmitted, queueData)
}

export const roundConcludedEvent = async (
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
		event: EventLog.parseForQueue(event, ContractNames.FareSpinGame),
		timestamp: Date.now(),
	}

	await spinContractEventQueue.add(EventNames.RoundConcluded, queueData)
}

export const entrySettledEvent = async (
	roundId: BigNumber,
	batchEntryId: BigNumber,
	_NUplayer: string,
	_NUentryId: BigNumber,
	hasWon: boolean,
	event: Event
) => {
	const queueData: IEntrySettledQueue = {
		roundId: BNToNumber(roundId),
		batchEntryId: BNToNumber(batchEntryId),
		player: _NUplayer,
		entryId: BNToNumber(_NUentryId),
		hasWon,
		event: EventLog.parseForQueue(event, ContractNames.FareSpinGame),
		timestamp: Date.now(),
	}

	await spinContractEventQueue.add(EventNames.EntrySettled, queueData)
}
