import { spinAPI } from '../../../pears/crypto/contracts'
import { ContractNames, formatETH, toEth } from '../../event/utils'
import { BatchEntry, EventLog, GameMode, Round } from '../../service'
import {
	IGameModeUpdatedQueue,
	IEntrySubmittedQueue,
	IEntrySettledQueue,
	IRoundConcludedQueue,
} from '../../queue/queue.types'

export const processGameModeUpdated = async (queueData: IGameModeUpdatedQueue) => {
	const { event, gameModeId, timestamp } = queueData

	const eventLogId = await EventLog.process(event, ContractNames.FareSpinGame)
	if (!eventLogId) return ''

	await GameMode.createOrUpdate(gameModeId, timestamp, eventLogId)

	return 'gameModeUpdated'
}

export const processEntrySubmitted = async (queueData: IEntrySubmittedQueue) => {
	const { roundId, batchEntryId, player, entryId, event, timestamp } = queueData

	const eventLogId = await EventLog.process(event, ContractNames.FareSpinGame)
	if (!eventLogId) return ''

	await BatchEntry.create(eventLogId, roundId, batchEntryId, entryId, player, timestamp)

	return 'entrySubmitted'
}

export const processRoundConcluded = async (queueData: IRoundConcludedQueue) => {
	const { roundId, vrfRequestId, randomNum, randomEliminator, event, timestamp } = queueData

	const eventLogId = await EventLog.process(event, ContractNames.FareSpinGame)
	if (!eventLogId) return ''

	await Round.updateRoundBatchEntries(roundId, randomNum, randomEliminator)

	await Round.repo.createAndSave({
		eventLogId,
		roundId,
		randomNum,
		randomEliminator,
		vrfRequestId,
		timestamp,
	})

	return 'roundConcludedWorker'
}

export const processEntrySettled = async (queueData: IEntrySettledQueue) => {
	const {
		roundId,
		batchEntryId,
		player, // eslint-disable-line
		entryId, // eslint-disable-line
		hasWon,
		event,
		timestamp,
	} = queueData

	const eventLogId = await EventLog.process(event, ContractNames.FareSpinGame)
	if (!eventLogId) return ''

	const batchEntryEntity = await BatchEntry.settle(roundId, batchEntryId, timestamp)

	const [_entryId, _player, _settled, _totalEntryAmount, _totalWinAmount] =
		await spinAPI.contract.batchEntryMap(roundId, batchEntryId)

	// @NOTE: Ensure blockchain totalWinAmount and calculated Redis totalWinAmount is correct
	// @NOTE: We need to log to our analytics if these numbers do not match
	if (hasWon && !toEth(batchEntryEntity.totalWinAmount).eq(_totalWinAmount)) {
		console.log('------------------------------------------')
		console.log(
			'!IMPORTANT - Redis totalWinAmount and smart contract totalWinAmount do not match.'
		)
		console.log('If you see this error report steps to reproduce!')
		console.log('Updating to reflect the amount fetched from the blockchain...')
		console.log('------------------------------------------')
		batchEntryEntity.totalWinAmount = formatETH(_totalWinAmount)
		await BatchEntry.repo.save(batchEntryEntity)
	}

	return 'entrySettled'
}
