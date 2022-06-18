import type { Client } from '@colyseus/core'
import { Command } from '@colyseus/command'
import { utils } from 'ethers'

import type { SpinRoom } from '../types'
import type {
	FareTransferArgs,
	BatchEntryMsgArgs,
	SettledRound,
	SettledBatchEntryArgs,
} from '../../pubsub/types'

import store from '../../store'
import { SpinEvent, MAX_CHAT_MESSAGE_LENGTH, WebSocketCustomCodes } from '../constants'
import { Entry, BatchEntry, Round as _Round, Message } from '../entities'
import { logger } from '../utils'

// @NOTE: Needed commands
// OnFetchFareSupply
// OnFetchRoundAnalytics

// @NOTE: Define types for options
export class OnFareTransfer extends Command<SpinRoom, FareTransferArgs> {
	execute({ to, from, amount, timestamp: _timestamp }: FareTransferArgs) {
		try {
			const toUser = this.state.users.get(to)
			const fromUser = this.state.users.get(from)
			// @NOTE: Need to add transfer listener for avax amount
			if (toUser) {
				const bnBalance = utils.parseEther(toUser.balance.fare)
				const bnAmount = utils.parseEther(amount)
				toUser.balance.fare = utils.formatEther(bnBalance.add(bnAmount))
			}
			if (fromUser) {
				const bnBalance = utils.parseEther(fromUser.balance.fare)
				const bnAmount = utils.parseEther(amount)
				fromUser.balance.fare = utils.formatEther(bnBalance.sub(bnAmount))
			}
		} catch (err) {
			logger.error(err)
		}
	}
}

type OnNewChatMessageOpts = { text: string; client: Client }
export class OnNewChatMessage extends Command<SpinRoom, OnNewChatMessageOpts> {
	async execute({ text: _text, client }: OnNewChatMessageOpts) {
		const text = (_text || '').trim()
		const user = this.state.users.get(client.sessionId)
		console.log('USER SENT MESSAGE', user)

		if (!client.auth) {
			client.error(
				WebSocketCustomCodes.RESTRICTED_USER_ACTION,
				'Guests cannot send chat messages.'
			)
			return
		}

		if (text.length === 0) {
			client.error(
				WebSocketCustomCodes.MESSAGE_VALIDATION_ERROR,
				'Cannnot send empty chat message.'
			)
			return
		}

		if (text.length > MAX_CHAT_MESSAGE_LENGTH) {
			client.error(
				WebSocketCustomCodes.MESSAGE_VALIDATION_ERROR,
				`Message too long (max length: ${MAX_CHAT_MESSAGE_LENGTH})`
			)
			return
		}

		logger.info(`New chat message from ${user.publicAddress} - ${text}`)

		const msg = new Message({
			text,
			username: user.username,
			createdBy: user.publicAddress,
			colorTheme: user.colorTheme,
		})

		this.room.broadcast(SpinEvent.NewChatMessage, msg, { except: client })
	}
}

export class OnInitSpinRoom extends Command<SpinRoom, void> {
	async execute() {
		this.state.fareTotalSupply = await store.service.fareTransfer.getCachedTotalSupply()
		this.state.currentRoundId = Number(await store.service.round.getCachedCurrentRoundId())
		this.state.isRoundPaused = await store.service.round.getCachedSpinRoundPaused()
		const roundData = await store.service.batchEntry.getCurrentRoundBatchEntries()

		roundData.forEach(({ batchEntry, entries }) => {
			const batchEntryState = new BatchEntry()
			batchEntryState.roundId = batchEntry.roundId
			batchEntryState.batchEntryId = batchEntry.batchEntryId
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
