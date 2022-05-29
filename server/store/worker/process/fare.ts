import { ContractNames, EventNames } from '../../constants'
import type { EventReturnData, IFareTransferQueue, IServiceObj } from '../../types'

const createFareJobProcesses = (service: IServiceObj) => {
	async function fareTransfer<T>(queueData: IFareTransferQueue) {
		const { from, to, amount, timestamp, event } = queueData

		const eventLogId = await service.eventLog.process(event, ContractNames.FareToken)
		if (!eventLogId) return null

		const data = (
			await service.fareTransfer.create({
				eventLogId,
				from,
				to,
				amount,
				timestamp,
			})
		).toJSON()

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
