import { Schema, type } from '@colyseus/schema'

// @NOTE: Add wheel event messages to control global wheel events
// export enum RoundState {
//     Countdown = 'Countdown',
//     Spinning = 'Spinning',
//     Stopping = 'Stopping',
//     Finished = 'Finished',
// }

export interface IRound {
	// entityId: string // Redis hashId to reference in Redis store (emitted from pubsub event)
	roundId: number
	randomNum: number
	// @NOTE: Need to parse out winning numbers for 2x, 10x, 100x
	// twoXNum: (0 - 1)
	// tenXNum: (0 - 9)
	// hundoNum: (0 - 99)
	randomEliminator: string
	vrfRequestId: string
	isEliminator: boolean
	// @NOTE: Add analytics below
	// fareTotalStartingSupply: string
	// fareTotalEndingSupply: string
	// numberOfChatMessages: string
	// highestWinningBatchEntry: string
	// mostFareLost: string
}

export class Round extends Schema implements IRound {
	@type('string') roundId: number
	@type('string') randomNum: number
	@type('string') randomEliminator: string
	@type('string') vrfRequestId: string
	@type('boolean') isEliminator: boolean
}
