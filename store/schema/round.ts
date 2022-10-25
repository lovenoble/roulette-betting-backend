import { Entity, Schema } from 'redis-om'

export interface Round {
	eventLogId: string
	jobId: string
	randomEliminator: string
	randomNum: number
	roundId: number
	timestamp: number
	vrfNum: string
	vrfRequestId: string
}

export class Round extends Entity {}

export default new Schema(
	Round,
	{
		eventLogId: { type: 'string' },
		jobId: { type: 'string' },
		randomEliminator: { type: 'string' },
		randomNum: { type: 'number' },
		roundId: { type: 'number' },
		timestamp: { type: 'date' },
		vrfNum: { type: 'string' },
		vrfRequestId: { type: 'string' },
	},
	{ dataStructure: 'JSON' },
)
