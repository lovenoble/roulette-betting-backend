import type { BigNumber, Event } from 'ethers'

import redisStore from '..'
import { ContractNames, checkMintBurn, handleEventLog, formatETH } from './utils'

const { repo } = redisStore

export const fareTransferEvent = async (
	from: string,
	to: string,
	value: BigNumber,
	event: Event
) => {
	console.log('fareTokenEvent')
	const eventLogId = await handleEventLog(event, ContractNames.FareToken)
	if (!eventLogId) return

	const isMintBurn = checkMintBurn(from, to)

	await repo.fareTransfer.createAndSave({
		eventLogId,
		from,
		to,
		amount: formatETH(value),
		isMintBurn,
		timestamp: Date.now(),
	})
}
