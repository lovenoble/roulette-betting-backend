import { Entity, Schema } from 'redis-om'

export interface Round {
	jobId: string
	eventLogId: string
	roundId: number
	randomNum: number
	randomEliminator: string
	vrfRequestId: string
	timestamp: number
}

export class Round extends Entity {}

export default new Schema(
	Round,
	{
		jobId: { type: 'string' },
		eventLogId: { type: 'string' },
		roundId: { type: 'number' },
		randomNum: { type: 'number' },
		randomEliminator: { type: 'string' },
		vrfRequestId: { type: 'string' },
		timestamp: { type: 'date' },
	},
	{ dataStructure: 'JSON' }
)
