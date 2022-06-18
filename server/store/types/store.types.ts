import { Repository } from 'redis-om'

import type {
	BatchEntry,
	Entry,
	EventLog,
	FareTransfer,
	GameMode,
	Round,
	User,
	Eliminator,
} from '../schema/types'
import type {
	BatchEntryService,
	EntryService,
	EventLogService,
	FareTransferService,
	GameModeService,
	RoundService,
	UserService,
	EliminatorService,
} from '../service'

export interface IRepoObj {
	eliminator?: Repository<Eliminator>
	eventLog?: Repository<EventLog>
	gameMode?: Repository<GameMode>
	fareTransfer?: Repository<FareTransfer>
	entry?: Repository<Entry>
	batchEntry?: Repository<BatchEntry>
	round?: Repository<Round>
	user?: Repository<User>
}

export interface IServiceObj {
	eliminator?: EliminatorService
	eventLog?: EventLogService
	gameMode?: GameModeService
	fareTransfer?: FareTransferService
	entry?: EntryService
	batchEntry?: BatchEntryService
	round?: RoundService
	user?: UserService
}

export type SpinRoomStatus = 'countdown' | 'starting' | 'spinning' | 'finished'
