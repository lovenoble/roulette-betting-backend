import type { Event } from 'ethers'

import redisStore from '..'
import type { ContractNames } from '../event/utils'

const { eventLog } = redisStore.repo

export default abstract class EventLog {
	public static repo = eventLog

	// If event doesn't exist, eventLog entity will be added to the EventLog repo
	// Returns empty string if eventLog already exists
	public static async process(event: Event, contractName: ContractNames) {
		const doesExist = await eventLog
			.search()
			.where('transactionHash')
			.equals(event.transactionHash)
			.where('logIndex')
			.equals(event.logIndex)
			.returnCount()

		if (doesExist > 0) return ''

		const eventLogEntry = await eventLog.createAndSave({
			contractName,
			transactionHash: event.transactionHash,
			logIndex: event.logIndex,
			event: event.event,
			topics: event.topics,
			timestamp: Date.now(),
		})

		return eventLogEntry.entityId
	}
}
