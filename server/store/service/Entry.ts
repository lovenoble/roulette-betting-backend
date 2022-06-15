import type { BigNumber } from 'ethers'

import type { Entry } from '../schema/types'

import ServiceBase from './ServiceBase'
import { spinAPI } from '../../crypto'
import { ensureNumber, formatETH, BNToNumber } from '../utils'

export default class EntryService extends ServiceBase<Entry> {
	public async fetchEntriesByRoundPlayer(roundId: BigNumber | number, player: string) {
		return this.repo
			.search()
			.where('roundId')
			.equal(ensureNumber(roundId))
			.where('player')
			.equal(player)
			.sortAsc('entryIdx')
			.returnAll()
	}

	public async populateEntriesFromBatchEntryId(
		eventLogId: string,
		roundId: number,
		player: string,
		jobId: string = null,
		timestamp = Date.now()
	): Promise<Entry[]> {
		const entries = await spinAPI.contract.getEntriesByRoundPlayer(roundId, player)

		const promiseList: Promise<Entry>[] = entries.map((entry, entryIdx) => {
			return new Promise((resolve, reject) => {
				const [amount, gameModeId, pickedNumber] = entry
				const newEntry = {
					eventLogId,
					amount: formatETH(amount),
					roundId,
					gameModeId: BNToNumber(gameModeId),
					pickedNumber: BNToNumber(pickedNumber),
					player,
					entryIdx,
					winAmount: null,
					settled: false,
					timestamp,
					jobId,
				}

				this.repo.createAndSave(newEntry).then(resolve).catch(reject)
			})
		})

		return Promise.all(promiseList)
	}

	// Fetches all entries that are associated with a single batchEntry
	// public async populateEntriesFromBatchEntryIdOld( // TBR
	// 	// TBR
	// 	eventLogId: string,
	// 	entryId: number,
	// 	batchEntryId: number,
	// 	roundId: number,
	// 	jobId: string = null,
	// 	timestamp = Date.now()
	// ): Promise<Entry[]> {
	// 	const entryCount = (await spinAPI.contract.getEntryCount(entryId)).toNumber()
	// 	const entryIdxs: number[] = [...Array(entryCount).keys()]

	// 	const promiseList: Promise<any>[] = entryIdxs.map(entryIdx => {
	// 		return new Promise((resolve, reject) => {
	// 			spinAPI.contract
	// 				.entryMap(entryId, entryIdx)
	// 				.then(async ([amount, gameModeId, pickedNumber]) => {
	// 					try {
	// 						const entry = {
	// 							eventLogId,
	// 							amount: formatETH(amount),
	// 							roundId,
	// 							gameModeId: BNToNumber(gameModeId),
	// 							pickedNumber: BNToNumber(pickedNumber),
	// 							batchEntryId,
	// 							entryId,
	// 							entryIdx,
	// 							winAmount: null,
	// 							settled: false,
	// 							timestamp,
	// 							jobId,
	// 						}
	// 						const entryJson = await this.repo.createAndSave(entry)
	// 						resolve(entryJson)
	// 					} catch (err) {
	// 						reject(err)
	// 					}
	// 				})
	// 				.catch(reject)
	// 		})
	// 	})

	// 	return Promise.all(promiseList)
	// }
}
