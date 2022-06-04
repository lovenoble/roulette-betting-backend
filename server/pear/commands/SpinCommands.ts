import { Command } from '@colyseus/command'

import type { SpinRoom } from '../types'
import type {
	FareTransferArgs as _FareTransferArgs,
	BatchEntryMsgArgs,
	SettledRound,
	SettledBatchEntryArgs,
} from '../../pubsub/types'

import { Entry, BatchEntry, Round as _Round } from '../entities'
import { logger } from '../utils'

// @NOTE: Needed commands
// OnFetchFareSupply
// OnFetchRoundAnalytics

// @NOTE: Define types for options
// export class OnFareTransfer extends Command<SpinRoom, FareTransferArgs> {
// 	execute({ to, from, amount, timestamp }: FareTransferArgs) {
//             // const toUser =
// 		try {
// 		} catch (err) {
// 			logger.error(err)
// 		}
// 	}
// }

export class OnBatchEntry extends Command<SpinRoom, BatchEntryMsgArgs> {
	execute({ batchEntry, entries }: BatchEntryMsgArgs) {
		try {
			logger.info('OnBatchEntry')
			const batchEntryState = new BatchEntry()
			batchEntryState.roundId = batchEntry.roundId
			batchEntryState.batchEntryId = batchEntry.batchEntryId
			batchEntryState.entryId = batchEntry.entryId
			batchEntryState.player = batchEntry.player
			batchEntryState.settled = batchEntry.settled
			batchEntryState.totalEntryAmount = batchEntry.totalEntryAmount
			batchEntryState.totalWinAmount = batchEntry.totalWinAmount
			batchEntryState.timestamp = batchEntry.timestamp

			entries.forEach(entry => {
				const entryState = new Entry()

				entryState.amount = entry.amount
				entryState.roundId = entry.roundId
				entryState.gameModeId = entry.gameModeId
				entryState.pickedNumber = entry.pickedNumber
				entryState.batchEntryId = entry.batchEntryId
				entryState.entryId = entry.entryId
				entryState.winAmount = entry.winAmount
				entryState.settled = entry.settled

				batchEntryState.entries.add(entryState)
			})

			this.state.batchEntries.set(batchEntryState.player, batchEntryState)
		} catch (err) {
			logger.error(err)
		}
	}
}

// @NOTE: Probably don't need this since OnRoundConcluded can handle updating state for specific user
export class OnBatchEntrySettled extends Command<SpinRoom, SettledBatchEntryArgs> {
	execute({ batchEntry, entries }: SettledBatchEntryArgs) {
		// const be = this.state.batchEntries.get(batchEntry.entityId)

		// be.settled = true
		// be.totalWinAmount = batchEntry.totalWinAmount
		logger.info('OnBatchEntry', batchEntry, entries)
	}
}

export class OnRoundConcluded extends Command<SpinRoom, SettledRound> {
	execute(roundData: SettledRound) {
		logger.info('OnRoundConcluded', roundData)

		// Set round info
		this.state.round.roundId = roundData.roundId
		this.state.round.vrfRequestId = roundData.vrfRequestId
		this.state.round.randomNum = roundData.randomNum
		this.state.round.randomEliminator = roundData.randomEliminator

		// Set eliminator results
		this.state.round.isTwoXElim = roundData.isTwoXElim
		this.state.round.isTenXElim = roundData.isTenXElim
		this.state.round.isHundoXElim = roundData.isHundoXElim

		// Set winAmounts for call batchEntries/entries
		roundData.settledData.forEach(({ batchEntry, entries }) => {
			const be = this.state.batchEntries.get(batchEntry.player)
			be.totalWinAmount = batchEntry.totalWinAmount
			be.entries.forEach((e, idx) => {
				e.winAmount = entries[idx].winAmount
			})
		})
	}
}
