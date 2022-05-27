import type { BigNumber, Event } from 'ethers'

import { EventNames, ContractNames, BNToNumber, formatBN } from './utils'
import { EventLog } from '../service'
import { contractEventQueue } from '../queue'

export const gameModeUpdatedEvent = async (gameModeId: BigNumber, event: Event) => {
	await contractEventQueue.add(EventNames.GameModeUpdated, {
		gameModeId: BNToNumber(gameModeId),
		event: EventLog.parseForQueue(event, ContractNames.FareSpinGame),
	})
}

export const entrySubmittedEvent = async (
	roundId: BigNumber,
	batchEntryId: BigNumber,
	player: string,
	entryId: BigNumber,
	event: Event
) => {
	await contractEventQueue.add(EventNames.EntrySubmitted, {
		roundId: BNToNumber(roundId),
		batchEntryId: BNToNumber(batchEntryId),
		player,
		entryId: BNToNumber(entryId),
		event: EventLog.parseForQueue(event, ContractNames.FareSpinGame),
	})
}

export const roundConcludedEvent = async (
	roundId: BigNumber,
	vrfRequestId: string,
	randomNum: BigNumber,
	randomEliminator: BigNumber,
	event: Event
) => {
	await contractEventQueue.add(EventNames.RoundConcluded, {
		roundId: BNToNumber(roundId),
		vrfRequestId,
		randomNum: BNToNumber(randomNum),
		randomEliminator: formatBN(randomEliminator, 0),
		event: EventLog.parseForQueue(event, ContractNames.FareSpinGame),
	})
}

export const entrySettledEvent = async (
	roundId: BigNumber,
	batchEntryId: BigNumber,
	_NUplayer: string,
	_NUentryId: BigNumber,
	hasWon: boolean,
	event: Event
) => {
	await contractEventQueue.add(EventNames.EntrySettled, {
		roundId: BNToNumber(roundId),
		batchEntryId: BNToNumber(batchEntryId),
		_NUplayer,
		_NUentryId: BNToNumber(_NUentryId),
		hasWon,
		event: EventLog.parseForQueue(event, ContractNames.FareSpinGame),
	})
}
