import { Entity, Schema } from 'redis-om'

export interface EventLog {
	contractName: string
	blockNumber: number
	transactionHash: string
	logIndex: number
	event: string
	topics: string[]
	timestamp: number
}

export class EventLog extends Entity {}

export default new Schema(
	EventLog,
	{
		contractName: { type: 'string' },
		blockNumber: { type: 'number' },
		transactionHash: { type: 'string' },
		logIndex: { type: 'number' },
		event: { type: 'string' },
		topics: { type: 'array' },
		timestamp: { type: 'date' },
	},
	{ dataStructure: 'JSON' }
)
