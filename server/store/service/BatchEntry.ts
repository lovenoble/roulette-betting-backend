import type { BigNumber } from 'ethers'

import type EntryService from './Entry'
import type { BatchEntry } from '../schema/types'
import type { IBatchEntry, IEntry } from '../../pear/entities'

import ServiceBase from './ServiceBase'
import { ensureNumber, formatETH, logger } from '../utils'
import { spinAPI } from '../../crypto'

interface ICurrentBatchEntries {
	batchEntry: IBatchEntry
	entries: IEntry[]
}

export default class BatchEntryService extends ServiceBase<BatchEntry> {
	entryService!: EntryService

	constructor(entryService: EntryService) {
		super()

		this.entryService = entryService
	}

	public fetch(roundId: BigNumber | number, batchEntryId: BigNumber | number) {
		return this.repo
			.search()
			.where('roundId')
			.equal(ensureNumber(roundId))
			.where('batchEntryId')
			.equal(ensureNumber(batchEntryId))
			.returnFirst()
	}

	public fetchBatchEntriesByRoundId(roundId: number) {
		return this.repo
			.search()
			.where('roundId')
			.equal(roundId)
			.sortAsc('batchEntryId')
			.returnAll()
	}

	public async getCurrentRoundBatchEntries(): Promise<ICurrentBatchEntries[]> {
		const currentRoundId = await spinAPI.getCurrentRoundId()
		const batchEntries = await this.fetchBatchEntriesByRoundId(currentRoundId)

		const promiseList: Promise<ICurrentBatchEntries>[] = batchEntries.map(be => {
			return new Promise((resolve, reject) => {
				this.entryService
					.fetchEntriesByBatchEntryId(be.roundId, be.batchEntryId)
					.then(entries => {
						resolve({
							batchEntry: be.toRedisJson() as IBatchEntry,
							entries: entries.map(entry => entry.toRedisJson()) as IEntry[],
						})
					})
					.catch(reject)
			})
		})

		return Promise.all(promiseList)
	}

	public async create(
		eventLogId: string,
		roundId: number,
		batchEntryId: number,
		entryId: number,
		player: string,
		jobId: string = null,
		timestamp = Date.now()
	) {
		const entries = await this.entryService.populateEntriesFromBatchEntryId(
			eventLogId,
			entryId,
			batchEntryId,
			roundId,
			jobId,
			timestamp
		)

		const [_entryId, _player, _settled, _totalEntryAmount, _totalWinAmount] =
			await spinAPI.contract.batchEntryMap(roundId, batchEntryId)

		const batchEntry = {
			eventLogId,
			roundId,
			batchEntryId,
			entryId,
			settled: _settled,
			player,
			totalEntryAmount: formatETH(_totalEntryAmount),
			totalWinAmount: formatETH(_totalWinAmount),
			timestamp,
			jobId,
		}

		await this.repo.createAndSave(batchEntry)

		return {
			batchEntry,
			entries,
		}
	}

	public async settle(
		roundId: number,
		batchEntryId: number,
		settledOn = Date.now(),
		jobId: string = null
	) {
		const batchEntryEntity = await this.fetch(roundId, batchEntryId)

		// @NOTE: BULLMQ
		if (!batchEntryEntity) {
			// @NOTE: Push to queue to wait retry again in 10 seconds.
			// @NOTE: Problem occurs because settleBatchEntry and entrySubmitted even are fired off on connection
			logger.warn(
				'@NOTE: NEED TO RACE CONDITION TO CREATE BATCH ENTRY AND ENTRIES SINCE IT IS NULL!!!'
			)
		}

		batchEntryEntity.settled = true
		batchEntryEntity.settledOn = settledOn
		batchEntryEntity.jobId = jobId

		const entries = await this.entryService.fetchEntriesByBatchEntryId(roundId, batchEntryId)

		const promiseList = entries.map(entry => {
			return new Promise((resolve, reject) => {
				entry.settled = true
				entry.settledOn = settledOn
				entry.jobId = jobId
				this.entryService.repo.save(entry).then(resolve).catch(reject)
			})
		})

		await Promise.all(promiseList)
		await this.repo.save(batchEntryEntity)

		return batchEntryEntity
	}
}
