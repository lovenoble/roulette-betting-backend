import { Entity, Schema } from 'redis-om'

// struct GameMode {
//     uint256 id;
//     uint256 cardinality;
//     uint256 gameEdgeFloor;
//     uint256 mintMultiplier;
//     uint256 minAmount;
//     uint256 maxAmount;
//     uint256 entryLimit;
//     bool isActive;
// }

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
}

export class GameMode extends Entity {}

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
	},
	{ dataStructure: 'JSON' }
)
