import { Entity, Schema } from 'redis-om'

export interface Eliminator {
	jobId: string
	eventLogId: string
	roundId: number
	gameModeId: number
	recordedEdgeFloor: string // gameModeFloor at the time of the round
	isEliminator: boolean
	timestamp: number
}

export class Eliminator extends Entity {}

export default new Schema(
	Eliminator,
	{
		jobId: { type: 'string' },
		eventLogId: { type: 'string' },
		roundId: { type: 'number' },
		gameModeId: { type: 'number' },
		recordedEdgeFloor: { type: 'string' },
		isEliminator: { type: 'boolean' },
		timestamp: { type: 'date' },
	},
	{ dataStructure: 'JSON' }
)
