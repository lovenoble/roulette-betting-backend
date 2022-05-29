import type { BigNumber } from 'ethers'

import redisStore from '..'
import { spinAPI } from '../../pears/crypto/contracts'
import { ensureNumber, formatETH, BNToNumber } from '../event/utils'
import type { Entry as IEntry } from '../schema/types'

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
		eventLogId: string,
		entryId: number,
		batchEntryId: number,
		roundId: number,
		timestamp = Date.now()
	): Promise<IEntry[]> {
		const entryCount = (await spinAPI.contract.getEntryCount(entryId)).toNumber()
		const entryIdxs: number[] = [...Array(entryCount).keys()]

		const promiseList: Promise<any>[] = entryIdxs.map(entryIdx => {
			return new Promise((resolve, reject) => {
				spinAPI.contract
					.entryMap(entryId, entryIdx)
					.then(async ([amount, gameModeId, pickedNumber]) => {
						try {
							const entry = {
								eventLogId,
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
							const entryJson = (await entryRepo.createAndSave(entry)).toJSON()
							resolve(entryJson)
						} catch (err) {
							reject(err)
						}
					})
					.catch(reject)
			})
		})

		return Promise.all(promiseList)
	}
}
