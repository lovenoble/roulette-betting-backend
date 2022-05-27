import type { BigNumber, Event } from 'ethers'

import redisStore from '..'
import { tokenAPI as _tokenAPI, spinAPI } from '../../pears/crypto/contracts'
import { EventNames, ContractNames, formatBN, formatETH, BNToNumber, toEth } from './utils'
import { Entry, BatchEntry, EventLog, GameMode, Round } from '../service'
import { contractEventQueue } from '../queue'

const { repo } = redisStore

export const _gameModeUpdatedEvent = async (gameModeId: BigNumber, event: Event) => {
	await contractEventQueue.add(EventNames.GameModeUpdated, {
		gameModeId: BNToNumber(gameModeId),
		event: EventLog.parseForQueue(event, ContractNames.FareSpinGame),
	})
}

export const gameModeUpdatedEvent = async (gameModeId: BigNumber, event: Event) => {
	console.log('gameModeUpdated')
	const eventLogId = await EventLog.process(event, ContractNames.FareSpinGame)
	if (!eventLogId) return

	await GameMode.createOrUpdate(gameModeId, eventLogId)
}

// @NOTE: MOVE TO BATCHENTRYSERVICE !!!
export const createBatchEntry = async (
	eventLogId: string,
	roundId: BigNumber,
	batchEntryId: BigNumber,
	entryId: BigNumber,
	player: string
) => {
	// BULLMQ
	await Entry.populateEntriesFromBatchEntryId(entryId, batchEntryId, roundId)

	const [_entryId, _player, _settled, _totalEntryAmount, _totalWinAmount] =
		await spinAPI.contract.batchEntryMap(roundId, batchEntryId)

	await BatchEntry.repo.createAndSave({
		eventLogId,
		roundId: BNToNumber(roundId),
		batchEntryId: BNToNumber(batchEntryId),
		entryId: BNToNumber(entryId),
		settled: _settled,
		player,
		totalEntryAmount: formatETH(_totalEntryAmount),
		totalWinAmount: formatETH(_totalWinAmount),
	})
}

export const _entrySubmittedEvent = async (
	roundId: BigNumber,
	batchEntryId: BigNumber,
	player: string,
	entryId: BigNumber,
	event: Event
) => {
	await contractEventQueue.add(EventNames.EntrySubmitted, {
		roundId,
		batchEntryId,
		player,
		entryId,
		event,
	})
}

export const entrySubmittedEvent = async (
	roundId: BigNumber,
	batchEntryId: BigNumber,
	player: string,
	entryId: BigNumber,
	event: Event
) => {
	console.log('entrySubmittedEvent')
	const eventLogId = await EventLog.process(event, ContractNames.FareSpinGame)
	if (!eventLogId) return

	// BULLMQ
	await createBatchEntry(eventLogId, roundId, batchEntryId, entryId, player)
}

export const _roundConcludedEvent = async (
	roundId: BigNumber,
	vrfRequestId: string,
	randomNum: BigNumber,
	randomEliminator: BigNumber,
	event: Event
) => {
	await contractEventQueue.add(EventNames.EntrySubmitted, {
		roundId,
		vrfRequestId,
		randomNum,
		randomEliminator,
		event,
	})
}

export const roundConcludedEvent = async (
	roundId: BigNumber,
	vrfRequestId: string,
	randomNum: BigNumber,
	randomEliminator: BigNumber,
	event: Event
) => {
	console.log('roundConcluded')
	const eventLogId = await EventLog.process(event, ContractNames.FareSpinGame)
	if (!eventLogId) return

	// BULLMQ
	await Round.updateRoundBatchEntries(roundId, randomNum, randomEliminator)

	await repo.round.createAndSave({
		eventLogId,
		roundId: BNToNumber(roundId),
		randomNum: BNToNumber(randomNum),
		randomEliminator: formatBN(randomEliminator),
		vrfRequestId,
	})
}

export const _entrySettledEvent = async (
	roundId: BigNumber,
	batchEntryId: BigNumber,
	_NUplayer: string,
	_NUentryId: BigNumber,
	hasWon: boolean,
	event: Event
) => {
	await contractEventQueue.add(EventNames.EntrySubmitted, {
		roundId,
		batchEntryId,
		_NUplayer,
		_NUentryId,
		hasWon,
		event,
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
	console.log('entrySettledEvent')
	const eventLogId = await EventLog.process(event, ContractNames.FareSpinGame)
	if (!eventLogId) return

	// BULLMQ
	const batchEntryEntity = await BatchEntry.settle(roundId, batchEntryId)

	const [_entryId, _player, _settled, _totalEntryAmount, _totalWinAmount] =
		await spinAPI.contract.batchEntryMap(roundId, batchEntryId)

	// Ensure blockchain totalWinAmount and calculated Redis totalWinAmount is correct
	if (hasWon && !toEth(batchEntryEntity.totalWinAmount).eq(_totalWinAmount)) {
		batchEntryEntity.totalWinAmount = formatETH(_totalWinAmount)
		await repo.batchEntry.save(batchEntryEntity)
	}
}
