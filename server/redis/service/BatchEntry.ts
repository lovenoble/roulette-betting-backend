import type { BigNumber } from 'ethers'

import redisStore from '..'
import { ensureNumber, formatETH } from '../event/utils'
import Entry from './Entry'
import { spinAPI } from '../../pears/crypto/contracts'

const { batchEntry: batchEntryRepo } = redisStore.repo

export default abstract class BatchEntry {
	public static repo = batchEntryRepo

	public static fetch(roundId: BigNumber | number, batchEntryId: BigNumber | number) {
		return this.repo
			.search()
			.where('roundId')
			.equal(ensureNumber(roundId))
			.where('batchEntryId')
			.equal(ensureNumber(batchEntryId))
			.returnFirst()
	}

	public static async create(
		eventLogId: string,
		roundId: number,
		batchEntryId: number,
		entryId: number,
		player: string,
		timestamp = Date.now()
	) {
		await Entry.populateEntriesFromBatchEntryId(entryId, batchEntryId, roundId, timestamp)

		const [_entryId, _player, _settled, _totalEntryAmount, _totalWinAmount] =
			await spinAPI.contract.batchEntryMap(roundId, batchEntryId)

		await BatchEntry.repo.createAndSave({
			eventLogId,
			roundId,
			batchEntryId,
			entryId,
			settled: _settled,
			player,
			totalEntryAmount: formatETH(_totalEntryAmount),
			totalWinAmount: formatETH(_totalWinAmount),
			timestamp,
		})
	}

	public static async settle(roundId: number, batchEntryId: number, settledOn = Date.now()) {
		const batchEntryEntity = await BatchEntry.fetch(roundId, batchEntryId)

		// BULLMQ
		if (!batchEntryEntity) {
			// @NOTE: Push to queue to wait retry again in 10 seconds.
			// @NOTE: Problem occurs because settleBatchEntry and entrySubmitted even are fired off on connection
			console.log(
				'@NOTE: NEED TO RACE CONDITION TO CREATE BATCH ENTRY AND ENTRIES SINCE IT IS NULL!!!'
			)
		}

		batchEntryEntity.settled = true
		batchEntryEntity.settledOn = settledOn

		const entries = await Entry.fetchEntriesByBatchEntryId(roundId, batchEntryId)

		const promiseList = entries.map(entry => {
			return new Promise((resolve, reject) => {
				entry.settled = true
				entry.settledOn = settledOn
				Entry.repo.save(entry).then(resolve).catch(reject)
			})
		})

		await Promise.all(promiseList)
		await this.repo.save(batchEntryEntity)

		return batchEntryEntity
	}
}
