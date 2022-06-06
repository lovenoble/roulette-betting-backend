import { Command } from '@colyseus/command'
import dayjs from 'dayjs'

import type { SpinRoom } from '../types'
import type {
    FareTransferArgs as _FareTransferArgs,
    BatchEntryMsgArgs,
    SettledRound,
    SettledBatchEntryArgs,
} from '../../pubsub/types'

import store from '../../store'
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

export class OnInitSpinRoom extends Command<SpinRoom, void> {
    async execute() {
        this.state.fareTotalSupply = await store.service.fareTransfer.getCachedTotalSupply()
        this.state.currentRoundId = Number(await store.service.round.getCachedCurrentRoundId())
        const roundData = await store.service.batchEntry.getCurrentRoundBatchEntries()

        roundData.forEach(({ batchEntry, entries }) => {
            const batchEntryState = new BatchEntry()
            batchEntryState.roundId = batchEntry.roundId
            batchEntryState.batchEntryId = batchEntry.batchEntryId
            batchEntryState.entryId = batchEntry.entryId
            batchEntryState.player = batchEntry.player
            batchEntryState.settled = batchEntry.settled
            batchEntryState.totalEntryAmount = batchEntry.totalEntryAmount
            batchEntryState.totalWinAmount = batchEntry.totalWinAmount
            batchEntryState.timestamp = batchEntry.timestamp
            batchEntryState.isLoss = false

            entries.forEach(entry => {
                const entryState = new Entry()

                entryState.amount = entry.amount
                entryState.roundId = entry.roundId
                entryState.gameModeId = entry.gameModeId
                entryState.pickedNumber = entry.pickedNumber
                entryState.batchEntryId = entry.batchEntryId
                entryState.entryId = entry.entryId
                entryState.entryIdx = entry.entryIdx
                entryState.winAmount = entry.winAmount
                entryState.settled = entry.settled
                entryState.isLoss = false

                batchEntryState.entries.push(entryState)
            })

            this.state.batchEntries.set(batchEntryState.player, batchEntryState)
        })
    }
}

export class OnFareTotalSupplyUpdated extends Command<SpinRoom, string> {
    async execute(fareTotalSupply: string) {
        logger.info(`New fareTotalSupply: ${fareTotalSupply} FARE`)
        this.state.fareTotalSupply = fareTotalSupply
    }
}

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
            batchEntryState.isLoss = false

            entries.forEach(entry => {
                const entryState = new Entry()

                entryState.amount = entry.amount
                entryState.roundId = entry.roundId
                entryState.gameModeId = entry.gameModeId
                entryState.pickedNumber = entry.pickedNumber
                entryState.batchEntryId = entry.batchEntryId
                entryState.entryId = entry.entryId
                entryState.entryIdx = entry.entryIdx
                entryState.winAmount = entry.winAmount
                entryState.settled = entry.settled
                entryState.isLoss = false

                batchEntryState.entries.push(entryState)
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
            if (!be) return

            if (batchEntry.totalWinAmount) {
                be.totalWinAmount = batchEntry.totalWinAmount
                be.entries.forEach((e, idx) => {
                    if (entries[idx].winAmount) {
                        e.winAmount = entries[idx].winAmount
                    } else {
                        e.isLoss = true
                    }
                })
            } else {
                be.isLoss = true
            }
        })

        this.state.currentRoundId += 1
    }
}
