import type { BigNumber } from 'ethers'

import type { BNGameMode } from '../schema/types'
import redisStore from '..'
import { ensureNumber, formatETH, BNToNumber, BN, toEth } from '../event/utils'
import GameMode from './GameMode'

const { round: roundRepo, entry: entryRepo, batchEntry: batchEntryRepo } = redisStore.repo

export default abstract class Round {
	public static repo = roundRepo

	public static fetch(roundId: BigNumber | number) {
		return this.repo.search().where('roundId').equal(ensureNumber(roundId)).returnFirst()
	}

	// Calculates winners and losers from randomNum/randomEliminator by round
	public static async updateRoundBatchEntries(
		roundId: BigNumber,
		_randomNum: BigNumber,
		_randomEliminator: BigNumber
	) {
		const randomNum = _randomNum
		const randomEliminator = _randomEliminator

		const batchEntries = await batchEntryRepo
			.search()
			.where('roundId')
			.eq(BNToNumber(roundId))
			.returnAll()

		const gameModes = await GameMode.getActiveGameModes()

		const gameModeMap: { [key: number]: BNGameMode } = {}
		gameModes.forEach(gm => {
			gameModeMap[gm.id] = gm.bnify()
		})

		const fetchAllEntries = batchEntries.map(async batchEntry => {
			const obj = {
				batchEntry,
				entries: await entryRepo
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
				await entryRepo.save(entry)
			})

			await Promise.all(entryPromise)
			batchEntry.totalWinAmount = formatETH(totalWinAmount)
			await batchEntryRepo.save(batchEntry)
		})

		await Promise.all(promiseList)
	}
}
