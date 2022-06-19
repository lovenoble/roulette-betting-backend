import { IBatchEntry, IEntry, IRound } from '../../pear/entities'
import { Omit, SpinRoomStatus } from '../../store/types'
import { GameMode } from '../../store/schema/types'

export type ChannelName = 'fare' | 'spin-state' | 'analytics' | 'user-update'

export type BatchEntryMsgArgs = {
	batchEntry: Omit<IBatchEntry, 'entries' | 'isLoss'>
	entries: Omit<IEntry, 'isLoss'>[]
}

export type SettledEntry = {
	winAmount?: string
	roundId: number
	player: string
}

export type SettledBatchEntry = {
	batchEntryId: number
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
} & Omit<IRound, 'isEliminator'> &
	IRoundEliminators

export type GameModeArgs = Omit<GameMode, 'jobId' | 'eventLogId' | 'timestamp'>

export interface MessageListener {
	'fare-total-supply-updated': ({ totalSupply: string }, ...args: any[]) => void
	'fare-transfer': (transfer: FareTransferArgs, ...args: any[]) => void
	'game-mode-updated': (gameModes: GameModeArgs[], ...args: any[]) => void
	'batch-entry': (opts: BatchEntryMsgArgs, ...args: any[]) => void
	'round-concluded': (round: SettledRound, ...args: any[]) => void
	'batch-entry-settled': (settledData: SettledBatchEntryArgs, ...args: any[]) => void
	'start-round': (roundId: number, ...args: any[]) => void
	'countdown-updated': (countdown: number, ...args: any[]) => void
	'spin-round-pause': (opts: { isPaused: boolean; countdown: number }, ...args: any[]) => void
	'spin-room-status': (opts: { status: SpinRoomStatus }, ...args: any[]) => void
	'reset-spin-round': (opts: { message: string }, ...args: any[]) => void
}

export type FirstArgument<T> = T extends (arg1: infer U, ...args: any[]) => any ? U : any
