import type { BigNumber } from 'ethers'

import type { Entry } from '../schema/types'

import ServiceBase from './ServiceBase'
import { spinAPI } from '../../crypto'
import { ensureNumber, formatETH, BNToNumber } from '../utils'

export default class EntryService extends ServiceBase<Entry> {
	public async fetchEntriesByBatchEntryId(
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
	public async populateEntriesFromBatchEntryId(
		eventLogId: string,
		entryId: number,
		batchEntryId: number,
		roundId: number,
		jobId: string = null,
		timestamp = Date.now()
	): Promise<Entry[]> {
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
								jobId,
							}
							const entryJson = await this.repo.createAndSave(entry)
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
