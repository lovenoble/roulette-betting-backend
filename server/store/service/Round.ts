import type { BigNumber } from 'ethers'

import type EntryService from './Entry'
import type BatchEntryService from './BatchEntry'
import type GameModeService from './GameMode'
import type { Round, BNGameMode } from '../schema/types'
import type { SettledBatchEntryArgs, SettledBatchEntry, SettledEntry } from '../../pubsub/types'

import ServiceBase from './ServiceBase'
import { ensureNumber, formatETH, BN, toEth, logger } from '../utils'
import { spinAPI } from '../../crypto'
import { GlobalRedisKey } from '../constants'

export default class RoundService extends ServiceBase<Round> {
	gameModeService!: GameModeService
	batchEntryService!: BatchEntryService
	entryService!: EntryService

	constructor(
		gameModeService: GameModeService,
		batchEntryService: BatchEntryService,
		entryService: EntryService
	) {
		super()

		this.batchEntryService = batchEntryService
		this.entryService = entryService
		this.gameModeService = gameModeService
	}

	public fetch(roundId: BigNumber | number) {
		return this.repo.search().where('roundId').equal(ensureNumber(roundId)).returnFirst()
	}

	public async updateCurrentRoundId(_currentRoundId?: string) {
		let currentRoundId = _currentRoundId
		if (!currentRoundId) {
			currentRoundId = (await spinAPI.getCurrentRoundId()).toString()
		}
		await this.client.set(`Global:${GlobalRedisKey.CurrentRoundId}`, currentRoundId)

		return currentRoundId
	}

	public async getCachedCurrentRoundId() {
		return this.client.get(`Global:${GlobalRedisKey.CurrentRoundId}`)
	}

	// Calculates winners and losers from randomNum/randomEliminator by round
	public async updateRoundBatchEntries(
		roundId: number,
		_randomNum: number,
		_randomEliminator: string
	) {
		const randomNum = BN(_randomNum)
		const randomEliminator = BN(_randomEliminator)

		const batchEntries = await this.batchEntryService.repo
			.search()
			.where('roundId')
			.eq(roundId)
			.returnAll()

		const gameModes = await this.gameModeService.getActiveGameModes()

		const gameModeMap: { [key: number]: BNGameMode } = {}
		gameModes.forEach(gm => {
			gameModeMap[gm.id] = gm.bnify()
		})

		const fetchAllEntries = batchEntries.map(async batchEntry => {
			const obj = {
				batchEntry,
				entries: await this.entryService.repo
					.search()
					.where('batchEntryId')
					.eq(batchEntry.batchEntryId)
					.where('roundId')
					.eq(batchEntry.roundId)
					.sortAsc('entryIdx')
					.returnAll(),
			}

			return obj
		})

		const data = await Promise.all(fetchAllEntries)

		const promiseList: Promise<SettledBatchEntryArgs>[] = data.map(
			async ({ batchEntry, entries }) => {
				let totalWinAmount = BN('0')

				const entryPromise: Promise<SettledEntry>[] = entries.map(async entry => {
					const gm = gameModeMap[entry.gameModeId].bn

					if (BN(gm.gameEdgeFloor).lt(randomEliminator)) {
						// @NOTE: MINT NFT LOOTBOX (ONLY ONCE PER BATCH ENTRY)
						logger.warn('@NOTE: ELIMINATOR ROUND: NFT LOOTBOXES SHOULD BE MINTED')
					} else {
						let rng = randomNum
						if (gm.cardinality.eq('10')) {
							rng = BN(Math.floor(rng.toNumber() / 10).toString())
						}

						if (rng.mod(gm.cardinality).eq(entry.pickedNumber)) {
							entry.winAmount = formatETH(gm.mintMultiplier.mul(toEth(entry.amount)))
							totalWinAmount = totalWinAmount.add(toEth(entry.winAmount))
						}
					}
					await this.entryService.repo.save(entry)
					const { entryId, batchEntryId, winAmount, entryIdx } = entry
					return { entryId, batchEntryId, roundId, winAmount, entryIdx } as SettledEntry
				})

				const updatedEntries = await Promise.all(entryPromise)
				batchEntry.totalWinAmount = formatETH(totalWinAmount)
				await this.batchEntryService.repo.save(batchEntry)

				return {
					batchEntry: {
						totalWinAmount: batchEntry.totalWinAmount,
						roundId: batchEntry.roundId,
						entryId: batchEntry.entryId,
						player: batchEntry.player,
						batchEntryId: batchEntry.batchEntryId,
					} as SettledBatchEntry,
					entries: updatedEntries,
				}
			}
		)

		return Promise.all(promiseList)
	}
}
