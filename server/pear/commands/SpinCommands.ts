import { Command } from '@colyseus/command'
import { Room } from 'colyseus'
import { utils } from 'ethers'

import type * as types from '../../store/types'

// Libraries
import { SpinState } from '../state/SpinState'
import { IEntry, Entry, IBatchEntry, BatchEntry, GuestPlayer, Player, Round } from '../entities'

// export class SpinState extends Schema {
// 	// sessionId -> Player, GuestPlayer
// 	@type({ map: GuestPlayer }) guestPlayer = new MapSchema<GuestPlayer>()
// 	@type({ map: Player }) players = new MapSchema<Player>()

// 	// roundId -> BatchEntry, Round
// 	@type({ map: BatchEntry }) batchEntries = new MapSchema<BatchEntry>()
// 	@type({ map: Round }) rounds = new MapSchema<Round>()

// 	@type('string') fareTotalSupply: number
// 	@type('number') currentRoundId: number

// 	// @NOTE: Ensure that publicAddress can only submit one batchEntry per round (in smart contract)
// 	// @NOTE: Determine if we should start wheel at 2-5 mins or once 300 players are reached
// 	@type('number') countdownTimer: number
// }

class SpinGame extends Room<SpinState> {}

// @NOTE: Define types for options
export class OnBatchEntry extends Command<SpinGame, any> {
	async execute(data) {
		const { batchEntry, entries }: { batchEntry: any; entries: any[] } = data

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

		this.state.batchEntries.set(batchEntry.entityId, batchEntryState)
	}
}

export class OnBatchEntrySettled extends Command<SpinGame, any> {
	async execute(batchEntry) {
		const be = this.state.batchEntries.get(batchEntry.entityId)

		be.settled = true
		be.totalWinAmount = batchEntry.totalWinAmount
	}
}

// export class OnSetupUser extends Command<
// 	SpinGame,
// 	{
// 		publicAddress: string
// 	}
// > {
// 	async execute({ publicAddress }) {
// 		try {
// 			const avaxBalanace = await tokenAPI.getAvaxBalance(publicAddress)
// 			const fareBalance = await tokenAPI.getFareBalance(publicAddress)

// 			const newGamePlayer = new GamePlayer(
// 				publicAddress,
// 				avaxBalanace,
// 				fareBalance,
// 				'0',
// 				'0',
// 				false
// 			)

// 			this.state.gamePlayers.set(publicAddress, newGamePlayer)
// 		} catch (err) {
// 			console.error(err)
// 		}
// 	}
// }

// Fetch initial user balance
// Add player/guestPlayer to spinState
// new batchEntry
// round concluded
// entry settled
// mint/burn/transfer
