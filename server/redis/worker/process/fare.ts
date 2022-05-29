import { ContractNames, EventNames } from '../../constants'
import { FareTransfer, EventLog } from '../../service'
import type { EventReturnData, IFareTransferQueue } from '../../types'

export async function processFareTransfer<T>(queueData: IFareTransferQueue) {
	const { from, to, amount, timestamp, event } = queueData

	const eventLogId = await EventLog.process(event, ContractNames.FareToken)
	if (!eventLogId) return null

	const data = (
		await FareTransfer.create({
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
