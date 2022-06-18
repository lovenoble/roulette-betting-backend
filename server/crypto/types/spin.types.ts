import { BigNumber, ContractReceipt, ContractTransaction } from 'ethers'

export type GameModeParams = {
	id: BigNumber
	cardinality: BigNumber
	mintMultiplier: BigNumber
	gameEdgeFloor: BigNumber
	minAmount: BigNumber
	maxAmount: BigNumber
	entryLimit: BigNumber
	isActive: boolean
}

export interface GameMode {
	id: number
	cardinality: number
	mintMultiplier: number
	gameEdgeFloor: BigNumber
	minAmount: number
	maxAmount: number
	entryLimit: number
	isActive: boolean
}

export interface IGameModesTx {
	tx: ContractTransaction
	gameMode: GameMode
}

export interface IBatchEntryItem {
	amount: BigNumber
	gameModeId: string
	pickedNumber: string
}

export interface IBatchEntryTx {
	tx: ContractTransaction
	receipt: ContractReceipt | null
	entries: IBatchEntryItem[]
	totalEntryAmount: number
}

export interface IConcludeRoundResp {
	currentRoundId: number
	tx: ContractTransaction
	receipt?: ContractReceipt | null
}

export interface IEntry {
	amount: number
	gameModeId: number
	pickedNumber: number
}

export interface IBatchEntry {
	player: string
	settled: boolean
	totalEntryAmount: number
	totalWinAmount: number
	entries?: IEntry[]
}

export interface IRound {
	id: number
	randomNum: number
	vrfRequestId: string
	eliminatorGameMode?: [{ [gameModeId: string]: boolean }]
	randomEliminator?: number
}

export interface IEliminator {
	gameModeId: number
	recordedEdgeFloor: number
	isEliminator: boolean
}

export interface IEliminatorMap {
	[gameModeId: string]: IEliminator[]
}

export interface IBreakDown {
	totalRoundWinAmount: number
	totalRoundEntryAmount: number
	totalRoundSupply: number
	totalDeltaAmount: number
	totalRakeAmount: number
}

export interface IRoundBreakdown {
	info: IRound
	breakdown: IBreakDown
	batchEntries: IBatchEntry[]
}

export interface ISpinSimulationOptions {
	roundCount: number
	entryCount: number
	batchRange: number[]
	amountRange: number[]
	fixedAmount?: number | null
}

export interface IEntryIds {
	roundId: number
	entryId: number
	gameModeId?: number
}

export interface Entry {
	player: string
	gameModeId: string
	roundId: string
	entryId: string
	pickedNumber: string
	amount: string
	winAmount: string
	settled: boolean
	result: string
}

export type EntryStructOutput = [BigNumber, BigNumber, BigNumber] & {
	amount: BigNumber
	gameModeId: BigNumber
	pickedNumber: BigNumber
}

export type EliminatorStructOutput = [BigNumber, BigNumber, boolean] & {
	gameModeId: BigNumber
	recordedEdgeFloor: BigNumber
	isEliminator: boolean
}
