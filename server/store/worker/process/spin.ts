import { ContractNames, EventNames } from '../../constants'
import { spinAPI } from '../../../crypto/contracts'
import { formatETH, toEth, workerLogger as logger } from '../../utils'
import {
	IServiceObj,
	IGameModeUpdatedQueue,
	IEntrySubmittedQueue,
	IEntrySettledQueue,
	IRoundConcludedQueue,
	EventReturnData,
} from '../../types'
import PubSub from '../../../pubsub'

const createSpinJobProcesses = (service: IServiceObj) => {
	async function gameModeUpdated<T>(queueData: IGameModeUpdatedQueue, jobId: string = null) {
		const { event, gameModeId, timestamp } = queueData

		const eventLogId = await service.eventLog.process(event, ContractNames.FareSpinGame)
		if (!eventLogId) return null

		const data = (
			await service.gameMode.createOrUpdate(gameModeId, timestamp, eventLogId, jobId)
		).toJSON()

		// @NOTE: May need to publish here

		return JSON.stringify({
			eventName: EventNames.GameModeUpdated,
			data,
		} as EventReturnData<T>)
	}

	async function entrySubmitted(queueData: IEntrySubmittedQueue, jobId: string = null) {
		const { roundId, batchEntryId, player, entryId, event, timestamp } = queueData
		const eventLogId = await service.eventLog.process(event, ContractNames.FareSpinGame)
		if (!eventLogId) return null

		const data = await service.batchEntry.create(
			eventLogId,
			roundId,
			batchEntryId,
			entryId,
			player,
			jobId,
			timestamp
		)

		PubSub.pub<'batch-entry'>('spin-state', 'batch-entry', {
			batchEntry: data.batchEntry,
			entries: data.entries,
		})

		return JSON.stringify({
			eventName: EventNames.EntrySubmitted,
			data,
		} as EventReturnData<typeof data>)
	}

	async function roundConcluded<T>(queueData: IRoundConcludedQueue, jobId: string = null) {
		const { roundId, vrfRequestId, randomNum, randomEliminator, event, timestamp } = queueData

		const eventLogId = await service.eventLog.process(event, ContractNames.FareSpinGame)
		if (!eventLogId) return null

		const settledData = await service.round.updateRoundBatchEntries(
			roundId,
			randomNum,
			randomEliminator
		)

		PubSub.pub<'round-concluded'>('spin-state', 'round-concluded', {
			roundId,
			randomNum,
			randomEliminator,
			vrfRequestId,
			settledData,
		})

		const data = (
			await service.round.repo.createAndSave({
				eventLogId,
				roundId,
				randomNum,
				randomEliminator,
				vrfRequestId,
				timestamp,
				jobId,
			})
		).toJSON()

		return JSON.stringify({
			eventName: EventNames.RoundConcluded,
			data,
		} as EventReturnData<T>)
	}

	async function entrySettled<T>(queueData: IEntrySettledQueue, jobId: string = null) {
		const {
			roundId,
			batchEntryId,
			player, // eslint-disable-line
			entryId, // eslint-disable-line
			hasWon,
			event,
			timestamp,
		} = queueData

		const eventLogId = await service.eventLog.process(event, ContractNames.FareSpinGame)
		if (!eventLogId) return null

		const batchEntryEntity = await service.batchEntry.settle(
			roundId,
			batchEntryId,
			timestamp,
			jobId
		)

		const [_entryId, _player, _settled, _totalEntryAmount, _totalWinAmount] =
			await spinAPI.contract.batchEntryMap(roundId, batchEntryId)

		// @NOTE: Ensure blockchain totalWinAmount and calculated Redis totalWinAmount is correct
		// @NOTE: We need to log to our analytics if these numbers do not match
		if (hasWon && !toEth(batchEntryEntity.totalWinAmount).eq(_totalWinAmount)) {
			logger.warn('------------------------------------------')
			logger.warn(
				'!IMPORTANT - Redis totalWinAmount and smart contract totalWinAmount do not match.'
			)
			logger.warn('If you see this error report steps to reproduce!')
			logger.warn('Updating to reflect the amount fetched from the blockchain...')
			logger.warn('------------------------------------------')
			batchEntryEntity.totalWinAmount = formatETH(_totalWinAmount)
			await service.batchEntry.repo.save(batchEntryEntity)
		}

		// @NOTE: Need to include updated entry values as well
		return JSON.stringify({
			eventName: EventNames.EntrySettled,
			data: batchEntryEntity.toJSON(),
		} as EventReturnData<T>)
	}

	return {
		gameModeUpdated,
		entrySubmitted,
		entrySettled,
		roundConcluded,
	}
}

export default createSpinJobProcesses
