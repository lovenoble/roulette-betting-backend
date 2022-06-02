import ServiceBase from './ServiceBase'
import { zeroAddress } from '../utils'
import type { FareTransfer } from '../schema/types'

interface ICreateOptions {
	jobId?: string
	eventLogId?: string
	from: string
	to: string
	amount: string
	timestamp: number
}

export default class FareTransferService extends ServiceBase<FareTransfer> {
	public getTransferType(from: string, to: string): string {
		let transferType = 'transfer'
		if (from === zeroAddress) {
			transferType = 'mint'
		} else if (to === zeroAddress) {
			transferType = 'burn'
		}

		return transferType
	}

	public async create({ jobId = null, eventLogId, from, to, amount, timestamp }: ICreateOptions) {
		const transferType = this.getTransferType(from, to)

		return this.repo.createAndSave({
			jobId,
			eventLogId,
			from,
			to,
			amount,
			transferType,
			timestamp,
		})
	}
}
