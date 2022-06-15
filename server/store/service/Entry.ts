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

	/** Fetches all entries that are associated with a single batchEntry and saves them to Redis */
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
}
