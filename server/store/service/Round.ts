import type { BigNumber } from 'ethers'

import type EntryService from './Entry'
import type BatchEntryService from './BatchEntry'
import type GameModeService from './GameMode'

import type { Round, BNGameMode } from '../schema/types'
import ServiceBase from './ServiceBase'
import { ensureNumber, formatETH, BN, toEth } from '../utils'

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
					.returnAll(),
			}

			return obj
		})

		const data = await Promise.all(fetchAllEntries)

		const promiseList = data.map(async ({ batchEntry, entries }) => {
			let totalWinAmount = BN('0')

			const entryPromise = entries.map(async entry => {
				const gm = gameModeMap[entry.gameModeId].bn

				if (BN(gm.gameEdgeFloor).lt(randomEliminator)) {
					// @NOTE: MINT NFT LOOTBOX (ONLY ONCE PER BATCH ENTRY)
					console.log('@NOTE: ELIMINATOR ROUND: NFT LOOTBOXES SHOULD BE MINTED')
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
			})

			await Promise.all(entryPromise)
			batchEntry.totalWinAmount = formatETH(totalWinAmount)
			await this.batchEntryService.repo.save(batchEntry)
		})

		await Promise.all(promiseList)
	}
}
