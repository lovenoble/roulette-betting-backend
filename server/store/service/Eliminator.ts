import type { BigNumber } from 'ethers'

import type { Eliminator } from '../schema/types'

import ServiceBase from './ServiceBase'
import { ensureNumber } from '../utils'

export default class EliminatorService extends ServiceBase<Eliminator> {
	public fetchByRound(roundId: BigNumber | number) {
		return this.repo.search().where('roundId').equal(ensureNumber(roundId)).returnFirst()
	}
}
