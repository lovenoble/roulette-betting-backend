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

	public fetch(roundId: BigNumber | number, player: string) {
		return this.repo
			.search()
			.where('roundId')
			.equal(ensureNumber(roundId))
			.where('player')
			.equal(player)
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
					.fetchEntriesByRoundPlayer(be.roundId, be.player)
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
		// entryId: number,
		player: string,
		jobId: string = null,
		timestamp = Date.now()
	) {
		const entries = await this.entryService.populateEntriesFromBatchEntryId(
			eventLogId,
			roundId,
			player,
			jobId,
			timestamp
		)

		const be = await spinAPI.contract.batchEntryMap(roundId, player)
		const { settled, totalEntryAmount, totalWinAmount } = be

		const batchEntry = {
			eventLogId,
			roundId,
			batchEntryId,
			// entryId, // TBR
			settled,
			player,
			totalEntryAmount: formatETH(totalEntryAmount),
			totalWinAmount: formatETH(totalWinAmount),
			timestamp,
			jobId,
		}

		// export interface IBatchEntry {
		// 	// entityId: string // Redis hashId to reference in Redis store (emitted from pubsub event)
		// 	roundId: number // Round when batchEntry was submitted
		// 	batchEntryId: number // References the position of batchEntry array in smart contract
		// 	// entryId: number // References entry array index in smart contract // TBR
		// 	player: string // Public address of player
		// 	settled: boolean // Determines if a player has submitted an batchEntrySettled transaction to claim token
		// 	totalEntryAmount: string // Amount(sum of all entries) won when round is over
		// 	totalWinAmount?: string // Amount(sum of all winning entries) won when round is over
		// 	timestamp: number
		// 	entries: ArraySchema<Entry>
		// 	isLoss: boolean // Defaults to false
		// }

		await this.repo.createAndSave(batchEntry)

		return {
			batchEntry,
			entries,
		}
	}

	public async settle(
		roundId: number,
		player: string,
		settledOn = Date.now(),
		jobId: string = null
	) {
		const batchEntryEntity = await this.fetch(roundId, player)

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

		const entries = await this.entryService.fetchEntriesByRoundPlayer(roundId, player)

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
