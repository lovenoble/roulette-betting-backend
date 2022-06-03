import { Command } from '@colyseus/command'

import type { SpinRoom } from '../types'
import type { BatchEntryMsgArgs, SettledRound, SettledBatchEntryArgs } from '../../pubsub/types'

import { Entry, BatchEntry, Round as _Round } from '../entities'
import { logger } from '../utils'

// @NOTE: Needed commands
// OnFetchFareSupply
// OnFetchRoundAnalytics

// @NOTE: Define types for options
export class OnBatchEntry extends Command<SpinRoom, unknown> {
	async execute({ batchEntry, entries }: BatchEntryMsgArgs) {
		try {
			logger.info('ONBATCHENTRY')
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
export class OnBatchEntrySettled extends Command<SpinRoom, any> {
	async execute({ batchEntry, entries }: SettledBatchEntryArgs) {
		// const be = this.state.batchEntries.get(batchEntry.entityId)

		// be.settled = true
		// be.totalWinAmount = batchEntry.totalWinAmount
		logger.info('OnBatchEntry', batchEntry, entries)
	}
}

export class OnRoundConcluded extends Command<SpinRoom, any> {
	async execute(roundData: SettledRound) {
		logger.info('OnRoundConcluded', roundData)
	}
}

// Fetch initial user balance
// Add player/guestPlayer to spinState
// new batchEntry
// round concluded
// entry settled
// mint/burn/transfer
