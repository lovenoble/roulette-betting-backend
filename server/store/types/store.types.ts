import { Repository } from 'redis-om'

import type {
	User,
	EventLog,
	GameMode,
	FareTransfer,
	Entry,
	BatchEntry,
	Round,
} from '../schema/types'
import type {
	BatchEntryService,
	EntryService,
	EventLogService,
	FareTransferService,
	GameModeService,
	RoundService,
	UserService,
} from '../service'

export interface IRepoObj {
	eventLog?: Repository<EventLog>
	gameMode?: Repository<GameMode>
	fareTransfer?: Repository<FareTransfer>
	entry?: Repository<Entry>
	batchEntry?: Repository<BatchEntry>
	round?: Repository<Round>
	user?: Repository<User>
}

export interface IServiceObj {
	eventLog?: EventLogService
	gameMode?: GameModeService
	fareTransfer?: FareTransferService
	entry?: EntryService
	batchEntry?: BatchEntryService
	round?: RoundService
	user?: UserService
}
