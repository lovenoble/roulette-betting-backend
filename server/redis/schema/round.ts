import { Entity, Schema } from 'redis-om'

export interface Round {
	eventLogId: string
	roundId: number
	randomNum: number
	randomEliminator: string
	vrfRequestId: number
	timestamp: number
}

export class Round extends Entity {}

export default new Schema(
	Round,
	{
		eventLogId: { type: 'string' },
		roundId: { type: 'number' },
		randomNum: { type: 'number' },
		randomEliminator: { type: 'string' },
		vrfRequestId: { type: 'string' },
		timestamp: { type: 'date' },
	},
	{ dataStructure: 'JSON' }
)
