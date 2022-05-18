import { Entity, Schema } from 'redis-om'

export interface FareTransfer {
	eventLogId: string
	from: string
	to: string
	amount: string
	isMintBurn: string
	timestamp: number
}

export class FareTransfer extends Entity {}

export default new Schema(
	FareTransfer,
	{
		eventLogId: { type: 'string' },
		from: { type: 'string' },
		to: { type: 'string' },
		amount: { type: 'string' },
		isMintBurn: { type: 'string' },
		timestamp: { type: 'date' },
	},
	{ dataStructure: 'JSON' }
)
