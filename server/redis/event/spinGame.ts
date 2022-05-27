import type { BigNumber, Event, BigNumberish } from 'ethers'

import redisStore from '..'
import { tokenAPI as _tokenAPI, spinAPI } from '../../pears/crypto/contracts'
import { ContractNames, formatBN, formatETH, BNToNumber, toEth, BN } from './utils'
import type { BNGameMode } from '../schema/types'
import { EventLog, GameMode } from '../service'

const { repo } = redisStore

const spin = spinAPI.contract

// #region HELPERS

export const createEntriesFromBatchEntry = async (
	entryId: BigNumber,
	batchEntryId: BigNumber,
	roundId: BigNumber
): Promise<any[]> => {
	const entryCount = (await spinAPI.contract.getEntryCount(entryId)).toNumber()
	const entryIdxs: number[] = [...Array(entryCount).keys()]

	const promiseList: Promise<any>[] = entryIdxs.map(entryIdx => {
		return new Promise((resolve, reject) => {
			spinAPI.contract
				.entryMap(entryId, entryIdx)
				.then(async ([amount, gameModeId, pickedNumber]) => {
					const entry = {
						amount: formatETH(amount),
						roundId: BNToNumber(roundId),
						gameModeId: BNToNumber(gameModeId),
						pickedNumber: BNToNumber(pickedNumber),
						batchEntryId: BNToNumber(batchEntryId),
						entryId: BNToNumber(entryId),
						winAmount: null,
						settled: false,
						timestamp: Date.now(),
					}
					resolve(await repo.entry.createAndSave(entry))
				})
				.catch(reject)
		})
	})

	return Promise.all(promiseList)
}

const updateBatchEntries = async (
	roundId: BigNumber,
	_randomNum: BigNumber,
	_randomEliminator: BigNumber
) => {
	const randomNum = _randomNum
	const randomEliminator = _randomEliminator

	const batchEntries = await repo.batchEntry
		.search()
		.where('roundId')
		.eq(BNToNumber(roundId))
		.returnAll()

	const gameModes = await repo.gameMode.search().where('isActive').equals(true).returnAll()

	const gameModeMap: { [key: number]: BNGameMode } = {}
	gameModes.forEach(gm => {
		gameModeMap[gm.id] = gm.bnify()
	})

	const fetchAllEntries = batchEntries.map(async batchEntry => {
		const obj = {
			batchEntry,
			entries: await repo.entry
				.search()
				.where('batchEntryId')
				.eq(batchEntry.batchEntryId)
				.returnAll(),
		}

		return obj
	})

	const data = await Promise.all(fetchAllEntries)

	const promiseList = data.map(async ({ batchEntry, entries }) => {
		let totalWinAmount = BN('0')

		const entryPromise = entries.map(async entry => {
			const gm = gameModeMap[entry.gameModeId].bn

			if (BN(gm.gameEdgeFloor).lt(randomEliminator)) {
				// @NOTE: MINT NFT LOOTBOX (ONLY ONCE PER BATCH ENTRY)
				console.log('@NOTE: ELIMINATOR ROUND: NFT LOOTBOXES SHOULD BE MINTED')
			} else {
				let rng = randomNum
				if (gm.cardinality.eq('10')) {
					rng = BN(Math.floor(rng.toNumber() / 10).toString())
				}

				if (rng.mod(gm.cardinality).eq(entry.pickedNumber)) {
					entry.winAmount = formatETH(gm.mintMultiplier.mul(toEth(entry.amount)))
					totalWinAmount = totalWinAmount.add(toEth(entry.winAmount))
				}
			}
			await repo.entry.save(entry)
		})

		await Promise.all(entryPromise)
		batchEntry.totalWinAmount = formatETH(totalWinAmount)
		await repo.batchEntry.save(batchEntry)
	})

	await Promise.all(promiseList)
}

// #endregion HELPERS

// #region EVENTS

export const gameModeUpdatedEvent = async (gameModeId: BigNumber, event: Event) => {
	console.log('gameModeUpdated')
	const eventLogId = await EventLog.process(event, ContractNames.FareSpinGame)
	if (!eventLogId) return

	await GameMode.createOrUpdate(gameModeId, eventLogId)
}

export const createBatchEntry = async (
	eventLogId: string,
	roundId: BigNumber,
	batchEntryId: BigNumber,
	entryId: BigNumber,
	player: string
) => {
	await createEntriesFromBatchEntry(entryId, batchEntryId, roundId)

	const [_entryId, _player, _settled, _totalEntryAmount, _totalWinAmount] =
		await spinAPI.contract.batchEntryMap(roundId, batchEntryId)

	await repo.batchEntry.createAndSave({
		eventLogId,
		roundId: BNToNumber(roundId),
		batchEntryId: BNToNumber(batchEntryId),
		entryId: BNToNumber(entryId),
		settled: _settled,
		player,
		totalEntryAmount: formatETH(_totalEntryAmount),
		totalWinAmount: formatETH(_totalWinAmount),
	})
}

export const entrySubmittedEvent = async (
	roundId: BigNumber,
	batchEntryId: BigNumber,
	player: string,
	entryId: BigNumber,
	event: Event
) => {
	console.log('entrySubmittedEvent')
	const eventLogId = await EventLog.process(event, ContractNames.FareSpinGame)
	if (!eventLogId) return

	await createBatchEntry(eventLogId, roundId, batchEntryId, entryId, player)
}

export const roundConcludedEvent = async (
	roundId: BigNumber,
	vrfRequestId: string,
	randomNum: BigNumber,
	randomEliminator: BigNumber,
	event: Event
) => {
	console.log('roundConcluded')
	const eventLogId = await EventLog.process(event, ContractNames.FareSpinGame)
	if (!eventLogId) return

	// calculate entries and save updated values
	await updateBatchEntries(roundId, randomNum, randomEliminator)

	await repo.round.createAndSave({
		eventLogId,
		roundId: BNToNumber(roundId),
		randomNum: BNToNumber(randomNum),
		randomEliminator: formatBN(randomEliminator),
		vrfRequestId,
	})
}

export const settleBatchEntry = async (roundId: BigNumber, batchEntryId: BigNumber) => {
	const batchEntryEntity = await repo.batchEntry
		.search()
		.where('batchEntryId')
		.equal(BNToNumber(batchEntryId))
		.where('roundId')
		.equal(BNToNumber(roundId))
		.returnFirst()

	if (!batchEntryEntity) {
		// @NOTE: Push to queue to wait retry again in 10 seconds.
		// @NOTE: Problem occurs because settleBatchEntry and entrySubmitted even are fired off on connection
		console.log(
			'@NOTE: NEED TO RACE CONDITION TO CREATE BATCH ENTRY AND ENTRIES SINCE IT IS NULL!!!'
		)
	}

	batchEntryEntity.settled = true

	const entries = await repo.entry
		.search()
		.where('batchEntryId')
		.equal(BNToNumber(batchEntryId))
		.where('roundId')
		.equal(BNToNumber(roundId))
		.returnAll()

	const promiseList = entries.map(entry => {
		return new Promise((resolve, reject) => {
			entry.settled = true
			repo.entry.save(entry).then(resolve).catch(reject)
		})
	})

	await Promise.all(promiseList)

	return batchEntryEntity
}

export const entrySettledEvent = async (
	roundId: BigNumber,
	batchEntryId: BigNumber,
	_NUplayer: string,
	_NUentryId: BigNumber,
	hasWon: boolean,
	event: Event
) => {
	console.log('entrySettledEvent')
	const eventLogId = await EventLog.process(event, ContractNames.FareSpinGame)
	if (!eventLogId) return

	const batchEntryEntity = await settleBatchEntry(roundId, batchEntryId)

	const [_entryId, _player, _settled, _totalEntryAmount, _totalWinAmount] =
		await spinAPI.contract.batchEntryMap(roundId, batchEntryId)

	// Ensure blockchain totalWinAmount and calculated Redis totalWinAmount is correct
	if (hasWon && !toEth(batchEntryEntity.totalWinAmount).eq(_totalWinAmount)) {
		batchEntryEntity.totalWinAmount = formatETH(_totalWinAmount)
		await repo.batchEntry.save(batchEntryEntity)
	}
}

// #endregion EVENTS
