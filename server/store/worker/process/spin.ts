import { ContractNames, EventNames } from '../../constants'
import { spinAPI } from '../../../crypto/contracts'
import { formatETH, toEth } from '../../utils'
import {
	IServiceObj,
	IGameModeUpdatedQueue,
	IEntrySubmittedQueue,
	IEntrySettledQueue,
	IRoundConcludedQueue,
	EventReturnData,
} from '../../types'

const createSpinJobProcesses = (service: IServiceObj) => {
	async function gameModeUpdated<T>(queueData: IGameModeUpdatedQueue) {
		const { event, gameModeId, timestamp } = queueData

		const eventLogId = await service.eventLog.process(event, ContractNames.FareSpinGame)
		if (!eventLogId) return null

		const data = (
			await service.gameMode.createOrUpdate(gameModeId, timestamp, eventLogId)
		).toJSON()

		return JSON.stringify({
			eventName: EventNames.GameModeUpdated,
			data,
		} as EventReturnData<T>)
	}

	async function entrySubmitted(queueData: IEntrySubmittedQueue) {
		const { roundId, batchEntryId, player, entryId, event, timestamp } = queueData

		const eventLogId = await service.eventLog.process(event, ContractNames.FareSpinGame)
		if (!eventLogId) return null

		const data = await service.batchEntry.create(
			eventLogId,
			roundId,
			batchEntryId,
			entryId,
			player,
			timestamp
		)

		return JSON.stringify({
			eventName: EventNames.EntrySubmitted,
			data,
		} as EventReturnData<typeof data>)
	}

	async function roundConcluded<T>(queueData: IRoundConcludedQueue) {
		const { roundId, vrfRequestId, randomNum, randomEliminator, event, timestamp } = queueData

		const eventLogId = await service.eventLog.process(event, ContractNames.FareSpinGame)
		if (!eventLogId) return null

		await service.round.updateRoundBatchEntries(roundId, randomNum, randomEliminator)

		const data = (
			await service.round.repo.createAndSave({
				eventLogId,
				roundId,
				randomNum,
				randomEliminator,
				vrfRequestId,
				timestamp,
			})
		).toJSON()

		return JSON.stringify({
			eventName: EventNames.RoundConcluded,
			data,
		} as EventReturnData<T>)
	}

	async function entrySettled<T>(queueData: IEntrySettledQueue) {
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

		const batchEntryEntity = await service.batchEntry.settle(roundId, batchEntryId, timestamp)

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
