import { Worker } from 'bullmq'
import type { Job } from 'bullmq'

import { spinAPI } from 'pears/crypto/contracts'
import { EventNames, ContractNames, formatBN, formatETH, BNToNumber, toEth } from '../event/utils'
import { BatchEntry, EventLog, GameMode, Round } from '../service'

export const gameModeUpdatedWorker = new Worker(EventNames.GameModeUpdated, async (job: Job) => {
	const { event, gameModeId } = job.data

	const eventLogId = await EventLog.process(event, ContractNames.FareSpinGame)

	if (!eventLogId) return

	await GameMode.createOrUpdate(gameModeId, eventLogId)
})

export const entrySubmittedWorker = new Worker(EventNames.EntrySubmitted, async (job: Job) => {
	const { roundId, batchEntryId, player, entryId, event } = job.data

	const eventLogId = await EventLog.process(event, ContractNames.FareSpinGame)

	if (!eventLogId) return

	await BatchEntry.create(eventLogId, roundId, batchEntryId, entryId, player)
})

export const roundConcludedWorker = new Worker(EventNames.RoundConcluded, async (job: Job) => {
	const { roundId, vrfRequestId, randomNum, randomEliminator, event } = job.data

	const eventLogId = await EventLog.process(event, ContractNames.FareSpinGame)
	if (!eventLogId) return

	await Round.updateRoundBatchEntries(roundId, randomNum, randomEliminator)

	await Round.repo.createAndSave({
		eventLogId,
		roundId: BNToNumber(roundId),
		randomNum: BNToNumber(randomNum),
		randomEliminator: formatBN(randomEliminator),
		vrfRequestId,
	})
})

export const entrySettledWorker = new Worker(EventNames.EntrySettled, async (job: Job) => {
	const { roundId, batchEntryId, _NUplayer, _NUentryId, hasWon, event } = job.data

	const eventLogId = await EventLog.process(event, ContractNames.FareSpinGame)
	if (!eventLogId) return

	// BULLMQ
	const batchEntryEntity = await BatchEntry.settle(roundId, batchEntryId)

	const [_entryId, _player, _settled, _totalEntryAmount, _totalWinAmount] =
		await spinAPI.contract.batchEntryMap(roundId, batchEntryId)

	// Ensure blockchain totalWinAmount and calculated Redis totalWinAmount is correct
	if (hasWon && !toEth(batchEntryEntity.totalWinAmount).eq(_totalWinAmount)) {
		batchEntryEntity.totalWinAmount = formatETH(_totalWinAmount)
		await BatchEntry.repo.save(batchEntryEntity)
	}
})
