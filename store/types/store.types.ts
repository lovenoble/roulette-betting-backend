import { Repository } from 'redis-om'

import type {
  BatchEntry,
  Entry,
  EventLog,
  FareTransfer,
  ContractMode,
  Round,
  User,
  Eliminator,
  Randomness,
} from '../schema/types'
import type {
  BatchEntryService,
  EntryService,
  EventLogService,
  FareTransferService,
  ContractModeService,
  RoundService,
  UserService,
  EliminatorService,
  RandomnessService,
} from '../service'

export interface IRepoObj {
  eliminator?: Repository<Eliminator>
  eventLog?: Repository<EventLog>
  contractMode?: Repository<ContractMode>
  fareTransfer?: Repository<FareTransfer>
  entry?: Repository<Entry>
  batchEntry?: Repository<BatchEntry>
  round?: Repository<Round>
  user?: Repository<User>
  randomness?: Repository<Randomness>
}

export interface IServiceObj {
  eliminator?: EliminatorService
  eventLog?: EventLogService
  contractMode?: ContractModeService
  fareTransfer?: FareTransferService
  entry?: EntryService
  batchEntry?: BatchEntryService
  round?: RoundService
  user?: UserService
  randomness?: RandomnessService
}

export type SpinRoomStatus = 'starting' | 'countdown' | 'pausing' | 'spinning' | 'finished'
