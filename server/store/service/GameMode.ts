import type { BigNumberish } from 'ethers'

import type { GameMode } from '../schema/types'
import ServiceBase from './ServiceBase'
import { spinAPI } from '../../crypto/contracts'
import { formatBN, formatETH, BNToNumber } from '../utils'

const spin = spinAPI.contract

export default class GameModeService extends ServiceBase<GameMode> {
	public async getActiveGameModes() {
		return this.repo.search().where('isActive').equals(true).returnAll()
	}

	public async getGameModById(id: number) {
		return this.repo.search().where('id').eq(id).returnFirst()
	}

	// Ensures that gameModes in the smart contract are update to date in Redis
	public async ensureGameModes() {
		const currentGameModeId = (await spin.getCurrentGameModeId()).toNumber()
		const gameModeIds: number[] = [...Array(currentGameModeId).keys()]

		const promiseList: Promise<any>[] = gameModeIds.map(gameModeId => {
			return this.createOrUpdate(gameModeId)
		})

		return Promise.all(promiseList)
	}

	public async createOrUpdate(
		gameModeId: BigNumberish,
		timestamp = Date.now(),
		eventLogId?: string,
		jobId?: string
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

		const gameMode = await this.getGameModById(id.toNumber())

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
			gameMode.jobId = jobId

			if (eventLogId) {
				gameMode.eventLogId = eventLogId
			}

			await this.repo.save(gameMode)

			// If gameMode does not exist create and save
		} else {
			await this.repo.createAndSave({
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
				jobId,
			})
		}

		return gameMode
	}
}
