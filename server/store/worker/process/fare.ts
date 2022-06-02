import { ContractNames, EventNames } from '../../constants'
import type { EventReturnData, IFareTransferQueue, IServiceObj } from '../../types'
import PubSub from '../../../pubsub'

const createFareJobProcesses = (service: IServiceObj) => {
	async function fareTransfer<T>(queueData: IFareTransferQueue, jobId: string = null) {
		const { from, to, amount, timestamp, event } = queueData

		const eventLogId = await service.eventLog.process(event, ContractNames.FareToken)
		if (!eventLogId) return null

		const fareTransferObj = {
			jobId,
			eventLogId,
			from,
			to,
			amount,
			timestamp,
		}

		// Publish to 'fare' channel
		PubSub.pub<'fare-transfer'>('fare', 'fare-transfer', {
			to,
			from,
			amount,
			timestamp,
		})

		const data = (await service.fareTransfer.create(fareTransferObj)).toJSON()

		return JSON.stringify({
			eventName: EventNames.Transfer,
			data,
		} as EventReturnData<T>)
	}

	return {
		fareTransfer,
	}
}

export default createFareJobProcesses
