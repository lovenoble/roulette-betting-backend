import { ContractNames } from '../../event/utils'
import { FareTransfer, EventLog } from '../../service'
import { IFareTransferQueue } from '../../queue/queue.types'

export const processFareTransfer = async (queueData: IFareTransferQueue) => {
	const { from, to, amount, timestamp, event } = queueData

	const eventLogId = await EventLog.process(event, ContractNames.FareToken)
	if (!eventLogId) return ''

	await FareTransfer.create({
		eventLogId,
		from,
		to,
		amount,
		timestamp,
	})

	return 'fareTransferWorker'
}
