import { ContractNames } from '../constants'

export interface IEventLogQueue {
	contractName: ContractNames
	blockNumber: number
	transactionHash: string
	logIndex: number
	event: string
	topics: string[]
	timestamp: number
}

export interface IFareTransferQueue {
	from: string
	to: string
	amount: string
	timestamp: number
	event: IEventLogQueue
}

export interface IGameModeUpdatedQueue {
	gameModeId: number
	timestamp: number
	event: IEventLogQueue
}

export interface IEntrySubmittedQueue {
	roundId: number
	batchEntryId: number
	player: string
	timestamp: number
	event: IEventLogQueue
}

export interface IRoundConcludedQueue {
	roundId: number
	vrfRequestId: string
	randomNum: number
	randomEliminator: string
	timestamp: number
	event: IEventLogQueue
}

export interface IEntrySettledQueue {
	roundId: number
	player: string
	hasWon: boolean
	timestamp: number
	event: IEventLogQueue
}
