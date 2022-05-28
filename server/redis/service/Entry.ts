import type { BigNumber } from 'ethers'

import redisStore from '..'
import { spinAPI } from '../../pears/crypto/contracts'
import { ensureNumber, formatETH, BNToNumber } from '../event/utils'

const { entry: entryRepo } = redisStore.repo

export default abstract class Entry {
	public static repo = entryRepo

	public static async fetchEntriesByBatchEntryId(
		roundId: BigNumber | number,
		batchEntryId: BigNumber | number
	) {
		return this.repo
			.search()
			.where('batchEntryId')
			.equal(ensureNumber(batchEntryId))
			.where('roundId')
			.equal(ensureNumber(roundId))
			.returnAll()
	}

	// Fetches all entries that are associated with a single batchEntry
	public static async populateEntriesFromBatchEntryId(
		entryId: number,
		batchEntryId: number,
		roundId: number,
		timestamp = Date.now()
	): Promise<any[]> {
		const entryCount = (await spinAPI.contract.getEntryCount(entryId)).toNumber()
		const entryIdxs: number[] = [...Array(entryCount).keys()]

		const promiseList: Promise<any>[] = entryIdxs.map(entryIdx => {
			return new Promise((resolve, reject) => {
				spinAPI.contract
					.entryMap(entryId, entryIdx)
					.then(async ([amount, gameModeId, pickedNumber]) => {
						const entry = {
							amount: formatETH(amount),
							roundId,
							gameModeId: BNToNumber(gameModeId),
							pickedNumber: BNToNumber(pickedNumber),
							batchEntryId,
							entryId,
							winAmount: null,
							settled: false,
							timestamp,
						}
						resolve(await entryRepo.createAndSave(entry))
					})
					.catch(reject)
			})
		})

		return Promise.all(promiseList)
	}
}
