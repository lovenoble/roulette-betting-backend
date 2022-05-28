import type { BigNumber, Event } from 'ethers'

import { ContractNames, formatETH, EventNames } from './utils'
import { EventLog } from '../service'
import { fareContractEventQueue } from '../queue'
import { IFareTransferQueue } from '../queue/queue.types'

export const fareTransferEvent = async (
	from: string,
	to: string,
	value: BigNumber,
	event: Event
) => {
	const queueData: IFareTransferQueue = {
		from,
		to,
		amount: formatETH(value),
		timestamp: Date.now(),
		event: EventLog.parseForQueue(event, ContractNames.FareToken),
	}

	await fareContractEventQueue.add(EventNames.Transfer, queueData)
}
