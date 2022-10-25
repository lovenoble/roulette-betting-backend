import type {
	IServiceObj,
	IContractModeUpdatedQueue,
	IEntrySubmittedQueue,
	IEntrySettledQueue,
	IRoundConcludedQueue,
	EventReturnData,
} from '../../types'

import PubSub from '../../../pubsub'
import type { IRoundEliminators } from '../../../pubsub/types'
import { ContractNames, EventNames } from '../../constants'
import { spinAPI } from '../../../crypto'
import { formatETH, toEth, workerLogger as logger } from '../../utils'

const createSpinJobProcesses = (service: IServiceObj) => {
	async function contractModeUpdated<T>(
		queueData: IContractModeUpdatedQueue,
		jobId: string = null,
	) {
		const { event, contractModeId, timestamp } = queueData

		const eventLogId = await service.eventLog.process(event, ContractNames.FareSpin)
		if (!eventLogId) return null

		const data = (
			await service.contractMode.createOrUpdate(contractModeId, timestamp, eventLogId, jobId)
		).toRedisJson()

		// @NOTE: May need to publish here

		return JSON.stringify({
			eventName: EventNames.ContractModeUpdated,
			data,
		} as EventReturnData<T>)
	}

	async function entrySubmitted(queueData: IEntrySubmittedQueue, jobId: string = null) {
		const { roundId, batchEntryId, player, event, timestamp } = queueData
		const eventLogId = await service.eventLog.process(event, ContractNames.FareSpin)
		if (!eventLogId) return null

		const data = await service.batchEntry.create(
			eventLogId,
			roundId,
			batchEntryId,
			player,
			jobId,
			timestamp,
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

		const eventLogId = await service.eventLog.process(event, ContractNames.FareSpin)
		if (!eventLogId) return null

		const settledData = await service.round.updateRoundBatchEntries(
			roundId,
			randomNum,
			randomEliminator,
		)

		// Get and set eliminator data from blockchain
		const roundEliminators = await service.eliminator.createEliminatorsByRoundId(
			jobId,
			eventLogId,
			roundId,
			timestamp,
		)

		const eliminators: IRoundEliminators = {
			isTwoXElim: false,
			isTenXElim: false,
			isHundoXElim: false,
		}

		roundEliminators.forEach(({ contractModeId, isEliminator }) => {
			switch (contractModeId) {
				case 0:
					eliminators.isTwoXElim = isEliminator
					break
				case 1:
					eliminators.isTenXElim = isEliminator
					break
				case 2:
					eliminators.isHundoXElim = isEliminator
					break

				default:
					break
			}
			eliminators[contractModeId] = isEliminator
		})

		PubSub.pub<'round-concluded'>('spin-state', 'round-concluded', {
			roundId,
			randomNum,
			randomEliminator,
			vrfRequestId,
			settledData,
			...eliminators,
		})

		// Increment cached roundId in Redis
		await service.round.updateCurrentRoundId((roundId + 1).toString())

		const vrfNum = await spinAPI.getVRF(roundId)

		const data = (
			await service.round.repo.createAndSave({
				eventLogId,
				roundId,
				randomNum,
				randomEliminator,
				vrfNum,
				vrfRequestId,
				timestamp,
				jobId,
			})
		).toRedisJson()

		return JSON.stringify({
			eventName: EventNames.RoundConcluded,
			data,
		} as EventReturnData<T>)
	}

	async function entrySettled<T>(queueData: IEntrySettledQueue, jobId: string = null) {
		const { roundId, player, hasWon, event, timestamp } = queueData

		const eventLogId = await service.eventLog.process(event, ContractNames.FareSpin)
		if (!eventLogId) return null

		const batchEntryEntity = await service.batchEntry.settle(roundId, player, timestamp, jobId)

		const [_entryId, _player, _settled, _totalEntryAmount, _totalMintAmount] =
			await spinAPI.contract.batchEntryMap(roundId, player)

		// @NOTE: Ensure blockchain totalMintAmount and calculated Redis totalMintAmount is correct
		// @NOTE: We need to log to our analytics if these numbers do not match
		if (hasWon && !toEth(batchEntryEntity.totalMintAmount).eq(_totalMintAmount)) {
			logger.warn('------------------------------------------')
			logger.warn(
				'!IMPORTANT - Redis totalMintAmount and smart contract totalMintAmount do not match.',
			)
			logger.warn('If you see this error report steps to reproduce!')
			logger.warn('Updating to reflect the amount fetched from the blockchain...')
			logger.warn('------------------------------------------')
			batchEntryEntity.totalMintAmount = formatETH(_totalMintAmount)
			await service.batchEntry.repo.save(batchEntryEntity)
		}

		// @NOTE: Need to include updated entry values as well
		return JSON.stringify({
			eventName: EventNames.EntrySettled,
			data: batchEntryEntity.toRedisJson(),
		} as EventReturnData<T>)
	}

	return {
		contractModeUpdated,
		entrySubmitted,
		entrySettled,
		roundConcluded,
	}
}

export default createSpinJobProcesses
