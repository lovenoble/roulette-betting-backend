import { Entity, Schema } from 'redis-om'

// struct Round {
//     uint256 id;
//     uint256 randomNum;
//     uint256 randomEliminator;
//     bytes32 vrfRequestId;
// }

export interface Round {
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
		eventLogId: { type: 'string' },
		roundId: { type: 'number' },
		randomNum: { type: 'number' },
		randomEliminator: { type: 'string' },
		vrfRequestId: { type: 'string' },
		timestamp: { type: 'date' },
	},
	{ dataStructure: 'JSON' }
)

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

// struct Round {
//     uint256 id;
//     uint256 randomNum;
//     uint256 randomEliminator;
//     bytes32 vrfRequestId;
// }

// struct Eliminator {
//     uint256 gameModeId;
//     uint256 recordedEdgeFloor; // gameModeFloor at the time of the round
//     bool isEliminator;
// }

// mapping(uint256 => Round) public rounds;
// mapping(uint256 => BatchEntry[]) public batchEntryMap;
// mapping(uint256 => Entry[]) public entryMap;
// mapping(uint256 => GameMode) public gameModes;

// // Eliminator[] is the length of gameModes at the time the round was concluded
// // Since gameModeFloors can be adjusted individually we need to store the gameModeFloors each round
// mapping(uint256 => Eliminator[]) public eliminators;
// mapping(bytes32 => uint256) public vrfMap;
