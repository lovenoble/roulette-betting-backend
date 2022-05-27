import type { BigNumber } from 'ethers'

import redisStore from '..'
import { ensureNumber, BNToNumber, formatETH } from '../event/utils'
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
		roundId: BigNumber,
		batchEntryId: BigNumber,
		entryId: BigNumber,
		player: string
	) {
		// BULLMQ
		await Entry.populateEntriesFromBatchEntryId(entryId, batchEntryId, roundId)

		const [_entryId, _player, _settled, _totalEntryAmount, _totalWinAmount] =
			await spinAPI.contract.batchEntryMap(roundId, batchEntryId)

		await BatchEntry.repo.createAndSave({
			eventLogId,
			roundId: BNToNumber(roundId),
			batchEntryId: BNToNumber(batchEntryId),
			entryId: BNToNumber(entryId),
			settled: _settled,
			player,
			totalEntryAmount: formatETH(_totalEntryAmount),
			totalWinAmount: formatETH(_totalWinAmount),
		})
	}

	public static async settle(roundId: BigNumber, batchEntryId: BigNumber) {
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

		const entries = await Entry.fetchEntriesByBatchEntryId(roundId, batchEntryId)

		const promiseList = entries.map(entry => {
			return new Promise((resolve, reject) => {
				entry.settled = true
				Entry.repo.save(entry).then(resolve).catch(reject)
			})
		})

		await Promise.all(promiseList)

		return batchEntryEntity
	}
}
