import type { BigNumber } from 'ethers'

import type { Eliminator } from '../schema/types'

import ServiceBase from './ServiceBase'
import { spinAPI } from '../../crypto'
import { ensureNumber } from '../utils'

export default class EliminatorService extends ServiceBase<Eliminator> {
	public async fetchByRound(roundId: BigNumber | number) {
		return this.repo.search().where('roundId').equal(ensureNumber(roundId)).returnFirst()
	}

	public async createEliminatorsByRoundId(
		jobId: string,
		evenetLogId: string,
		_roundId: BigNumber | number,
		timestamp = Date.now()
	) {
		const roundId = ensureNumber(_roundId)
		const eliminators = await spinAPI.getAllEliminatorsByRound(ensureNumber(roundId))

		const promiseList = eliminators.map(({ gameModeId, recordedEdgeFloor, isEliminator }) => {
			return this.repo.createAndSave({
				jobId,
				evenetLogId,
				roundId,
				gameModeId: ensureNumber(gameModeId),
				recordedEdgeFloor: ensureNumber(recordedEdgeFloor),
				isEliminator,
				timestamp,
			})
		})

		return Promise.all(promiseList)
	}
}
