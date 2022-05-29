import type { BigNumberish } from 'ethers'

import redisStore from '..'
import { spinAPI } from '../../pears/crypto/contracts'
import { formatBN, formatETH, BNToNumber } from '../event/utils'

const { gameMode: gameModeRepo } = redisStore.repo

const spin = spinAPI.contract

export default abstract class GameMode {
	public static repo = gameModeRepo

	public static async getActiveGameModes() {
		return this.repo.search().where('isActive').equals(true).returnAll()
	}

	// Ensures that gameModes in the smart contract are update to date in Redis
	public static async ensureGameModes() {
		const currentGameModeId = (await spin.getCurrentGameModeId()).toNumber()
		const gameModeIds: number[] = [...Array(currentGameModeId).keys()]

		const promiseList: Promise<any>[] = gameModeIds.map(gameModeId => {
			return this.createOrUpdate(gameModeId)
		})

		return Promise.all(promiseList)
	}

	public static async createOrUpdate(
		gameModeId: BigNumberish,
		timestamp = Date.now(),
		eventLogId?: string
	) {
		const [
			id,
			cardinality,
			gameEdgeFloor,
			mintMultiplier,
			minAmount,
			maxAmount,
			entryLimit,
			isActive,
		] = await spin.gameModes(gameModeId)

		const gameMode = await gameModeRepo.search().where('id').eq(id.toNumber()).returnFirst()

		// If gameMode exists ensure values are up to date
		if (gameMode) {
			gameMode.id = BNToNumber(id)
			gameMode.cardinality = BNToNumber(cardinality)
			gameMode.gameEdgeFloor = formatBN(gameEdgeFloor)
			gameMode.mintMultiplier = BNToNumber(mintMultiplier)
			gameMode.minAmount = formatETH(minAmount)
			gameMode.maxAmount = formatETH(maxAmount)
			gameMode.entryLimit = BNToNumber(entryLimit)
			gameMode.isActive = isActive
			gameMode.timestamp = timestamp

			if (eventLogId) {
				gameMode.eventLogId = eventLogId
			}

			await gameModeRepo.save(gameMode)

			// If gameMode does not exist create and save
		} else {
			await gameModeRepo.createAndSave({
				eventLogId,
				id: BNToNumber(id),
				cardinality: BNToNumber(cardinality),
				gameEdgeFloor: formatBN(gameEdgeFloor),
				mintMultiplier: BNToNumber(mintMultiplier),
				minAmount: formatETH(minAmount),
				maxAmount: formatETH(maxAmount),
				entryLimit: BNToNumber(entryLimit),
				timestamp,
				isActive,
			})
		}

		return gameMode
	}
}
