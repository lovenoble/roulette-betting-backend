import { IBatchEntry, IEntry, IRound } from '../../pear/entities'
import { Omit } from '../../store/types'
import { GameMode } from '../../store/schema/types'

export type ChannelName = 'fare' | 'spin-state' | 'analytics' | 'user-update'

export type BatchEntryMsgArgs = {
	batchEntry: Omit<IBatchEntry, 'entries'>
	entries: IEntry[]
}

export type SettledEntry = {
	winAmount?: string
	roundId: number
	entryId: number
	batchEntryId: number
}

export type SettledBatchEntry = {
	batchEntryId: number
	entryId: number
	player: string // Public address of player
	totalWinAmount?: string // Amount(sum of all winning entries) won when round is over
}

export type SettledBatchEntryArgs = {
	batchEntry: SettledBatchEntry
	entries: SettledEntry[]
}

export type FareTransferArgs = {
	to: string
	from: string
	amount: string
	timestamp: number
}

export interface IRoundEliminators {
	isTwoXElim: boolean
	isTenXElim: boolean
	isHundoXElim: boolean
}

export type SettledRound = {
	settledData: SettledBatchEntryArgs[]
} & Omit<IRound, 'isEliminator'> & IRoundEliminators

export type GameModeArgs = Omit<GameMode, 'jobId' | 'eventLogId' | 'timestamp'>

export interface MessageListener {
	'fare-transfer': (transfer: FareTransferArgs) => void
	'game-mode-updated': (gameModes: GameModeArgs[], ...args: any[]) => void
	'batch-entry': (opts: BatchEntryMsgArgs, ...args: any[]) => void
	'round-concluded': (round: SettledRound, ...args: any[]) => void
	'batch-entry-settled': (settledData: SettledBatchEntryArgs, ...args: any[]) => void
	'start-round': (roundId: number, ...args: any[]) => void
}

export type FirstArgument<T> = T extends (arg1: infer U, ...args: any[]) => any ? U : any
