import redisStore from '..'
import { zeroAddress } from '../event/utils'

const { fareTransfer: fareTransferRepo } = redisStore.repo

interface ICreateOptions {
	eventLogId?: string
	from: string
	to: string
	amount: string
	timestamp: number
}

export default abstract class FareTransfer {
	public static repo = fareTransferRepo

	public static getTransferType(from: string, to: string): string {
		let transferType = 'transfer'
		if (from === zeroAddress) {
			transferType = 'mint'
		} else if (to === zeroAddress) {
			transferType = 'burn'
		}

		return transferType
	}

	public static async create({ eventLogId, from, to, amount, timestamp }: ICreateOptions) {
		const transferType = this.getTransferType(from, to)

		return this.repo.createAndSave({
			eventLogId,
			from,
			to,
			amount,
			transferType,
			timestamp,
		})
	}
}
