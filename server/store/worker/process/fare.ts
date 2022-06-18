import { utils } from 'ethers'

import type { EventReturnData, IFareTransferQueue, IServiceObj } from '../../types'

import PubSub from '../../../pubsub'
import { ContractNames, EventNames } from '../../constants'

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

		const transferType = service.fareTransfer.getTransferType(from, to)

		// If transferType is a mint or a burn, update cachedFareTotalSupply and publish new number
		if (transferType === 'mint' || transferType === 'burn') {
			const currentTotalSupply = await service.fareTransfer.getCachedTotalSupply()
			const bnTotalSupply = utils.parseEther(currentTotalSupply)
			const bnAmount = utils.parseEther(amount)
			let newTotalSupply = bnTotalSupply
			if (transferType === 'mint') {
				newTotalSupply = newTotalSupply.add(bnAmount)
			} else {
				newTotalSupply = newTotalSupply.sub(bnAmount)
			}
			const supply = utils.formatEther(newTotalSupply)

			PubSub.pub<'fare-total-supply-updated'>('fare', 'fare-total-supply-updated', {
				totalSupply: supply,
			})
			await service.fareTransfer.updateTotalSupply(supply)
		}

		// Publish to 'fare.fare-transfer' if TransferType is not mint or burn
		if (transferType === 'transfer') {
			PubSub.pub<'fare-transfer'>('fare', 'fare-transfer', {
				to,
				from,
				amount,
				timestamp,
			})
		}

		const data = (await service.fareTransfer.create(fareTransferObj)).toRedisJson()

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
