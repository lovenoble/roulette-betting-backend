import { ContractNames, EventNames } from '../../event/utils'
import { FareTransfer, EventLog } from '../../service'
import { IFareTransferQueue } from '../../queue/queue.types'
import { IEventReturnData } from '../worker.types'

export const processFareTransfer = async (queueData: IFareTransferQueue) => {
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
	} as IEventReturnData)
}
