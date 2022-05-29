import { Entity, Schema } from 'redis-om'
import type { BigNumber } from 'ethers'

import { bnify } from '../utils'
import type { Overwrite } from '../types'

export interface GameMode {
    eventLogId: string
    id: number
    cardinality: number
    mintMultiplier: number
    gameEdgeFloor: string
    minAmount: string
    maxAmount: string
    entryLimit: number
    isActive: boolean
    timestamp: number
}

export interface BNGameMode
    extends Overwrite<
    GameMode,
    {
        bn: {
            cardinality: BigNumber
            mintMultiplier: BigNumber
            gameEdgeFloor: BigNumber
            minAmount: BigNumber
            maxAmount: BigNumber
        }
    }
    > { }

export class GameMode extends Entity {
    public ethFields = ['cardinality', 'mintMultiplier', 'gameEdgeFloor', 'minAmount', 'maxAmount']

    public bnify(): BNGameMode & Entity {
        return bnify(this)
    }
}

export default new Schema(
    GameMode,
    {
        eventLogId: { type: 'string' },
        id: { type: 'number' },
        cardinality: { type: 'number' },
        gameEdgeFloor: { type: 'string' },
        mintMultiplier: { type: 'number' },
        minAmount: { type: 'string' },
        maxAmount: { type: 'string' },
        entryLimit: { type: 'number' },
        isActive: { type: 'boolean' },
        timestamp: { type: 'date' },
    },
    { dataStructure: 'JSON' }
)
