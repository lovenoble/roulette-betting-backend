import type { BigNumber, Event, BigNumberish } from 'ethers'

import redisStore from '../../redis-store'
import { tokenAPI as _tokenAPI, spinAPI } from '../crypto/contracts'
import { handleEventLog, ContractNames, formatBN, formatETH, BNToNumber } from './utils'

const { repo } = redisStore

// Stream -> WebSocket
// 1000ms delay to wait for batch entry to settle

const spin = spinAPI.contract

export const createOrUpdateGameMode = async (gameModeId: BigNumberish, eventLogId?: string) => {
	const [
		id,
		cardinality,
		gameEdgeFloor,
		mintMultiplier,
		minAmount,
		maxAmount,
		entryLimit,
		isActive,
	] = await spin.gameModes(gameModeId)

	const gameMode = await repo.gameMode.search().where('id').eq(id.toNumber()).returnFirst()

	// If gameMode exists ensure values are up to date
	if (gameMode) {
		gameMode.id = id.toNumber()
		gameMode.cardinality = cardinality.toNumber()
		gameMode.gameEdgeFloor = formatBN(gameEdgeFloor)
		gameMode.mintMultiplier = mintMultiplier.toNumber()
		gameMode.minAmount = formatETH(minAmount)
		gameMode.maxAmount = formatETH(maxAmount)
		gameMode.entryLimit = entryLimit.toNumber()
		gameMode.isActive = isActive

		if (eventLogId) {
			gameMode.eventLogId = eventLogId
		}

		await repo.gameMode.save(gameMode)
		// If gameMode does not exist create and save
	} else {
		await repo.gameMode.createAndSave({
			eventLogId,
			id: id.toNumber(),
			cardinality: cardinality.toNumber(),
			gameEdgeFloor: formatBN(gameEdgeFloor),
			mintMultiplier: mintMultiplier.toNumber(),
			minAmount: formatETH(minAmount),
			maxAmount: formatETH(maxAmount),
			entryLimit: entryLimit.toNumber(),
			isActive,
		})
	}
}

export const ensureGameMode = async () => {
	const currentGameModeId = (await spin.getCurrentGameModeId()).toNumber()
	const gameModeIds: number[] = [...Array(currentGameModeId).keys()]

	const promiseList: Promise<any>[] = gameModeIds.map(gameModeId => {
		return createOrUpdateGameMode(gameModeId)
	})

	return Promise.all(promiseList)
}

export const gameModeUpdated = async (gameModeId: BigNumber, event: Event) => {
	console.log('gameModeUpdated')
	const eventLogId = await handleEventLog(event, ContractNames.FareSpinGame)
	if (!eventLogId) return

	await createOrUpdateGameMode(gameModeId, eventLogId)
}

export const createEntriesFromBatchEntry = async (
	entryId: BigNumber,
	batchEntryId: BigNumber
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
						gameModeId: gameModeId.toNumber(),
						pickedNumber: pickedNumber.toNumber(),
						batchEntryId: batchEntryId.toNumber(),
						entryId: entryId.toNumber(),
						winAmount: '',
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

export const entrySubmittedEvent = async (
	roundId: BigNumber,
	batchId: BigNumber,
	player: string,
	entryId: BigNumber,
	event: Event
) => {
	console.log('entrySubmittedEvent')
	const eventLogId = await handleEventLog(event, ContractNames.FareSpinGame)
	if (!eventLogId) return

	const batchEntry = await spinAPI.contract.batchEntryMap(roundId, batchId)
	await createEntriesFromBatchEntry(entryId, batchId)

	const [_entryId, _player, _settled, _totalEntryAmount, _totalWinAmount] = batchEntry

	await repo.batchEntry.createAndSave({
		eventLogId,
		roundId: roundId.toNumber(),
		batchEntryId: batchId.toNumber(),
		entryId: entryId.toNumber(),
		settled: _settled,
		player,
		totalEntryAmount: formatETH(_totalEntryAmount),
		totalWinAmount: formatETH(_totalWinAmount),
	})
}

// struct Entry {
//     uint256 amount;
//     uint256 gameModeId;
//     uint256 pickedNumber;
// }

// struct BatchEntry {
//     uint256 entryId;
//     address player;
//     bool settled;
//     uint256 totalEntryAmount;
//     uint256 totalWinAmount;
// }

const updateBatchEntries = async (
	roundId: BigNumber,
	_randomNum: BigNumber,
	_randomEliminator: BigNumber
) => {
	const randomNum = _randomNum.toNumber()
	const randomEliminator = Number(formatBN(_randomEliminator))

	const batchEntries = await repo.batchEntry
		.search()
		.where('roundId')
		.eq(roundId.toNumber())
		.returnAll()

	const gameModes = await repo.gameMode.search().where('isActive').equals(true).returnAll()
	const gameModeMap = {}
	gameModes.forEach(gm => {
		gameModeMap[gm.id] = gm
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
		let totalWinAmount = 0

		const entryPromise = entries.map(async entry => {
			const gm = gameModes[entry.gameModeId]

			if (Number(gm.gameEdgeFloor) < randomEliminator) {
				// @NOTE: MINT NFT LOOTBOX (ONLY ONCE PER BATCH ENTRY)
			} else {
				let rng = randomNum
				if (gm.cardinality === 10) {
					rng = Math.floor(rng / 10)
				}
				if (rng % gm.cardinality === entry.pickedNumber) {
					entry.winAmount = (Number(entry.amount) * gm.mintMultiplier).toString()
					totalWinAmount = Number(totalWinAmount) + Number(entry.winAmount)
				}
			}

			await repo.entry.save(entry)
		})

		await Promise.all(entryPromise)
		batchEntry.totalWinAmount = totalWinAmount.toString()
		await repo.batchEntry.save(batchEntry)
	})

	await Promise.all(promiseList)
}

export const roundConcluded = async (
	roundId: BigNumber,
	vrfRequestId: string,
	randomNum: BigNumber,
	randomEliminator: BigNumber,
	event: Event
) => {
	console.log('roundConcluded')
	const eventLogId = await handleEventLog(event, ContractNames.FareSpinGame)
	if (!eventLogId) return

	// calculate entries and save values

	await updateBatchEntries(roundId, randomNum, randomEliminator)

	await repo.round.createAndSave({
		eventLogId,
		roundId: roundId.toNumber(),
		randomNum: randomNum.toNumber(),
		randomEliminator: formatBN(randomEliminator),
		vrfRequestId,
	})
}

export const entrySettledEvent = async (
	roundId: BigNumber,
	batchId: BigNumber,
	player: string,
	entryId: BigNumber,
	hasWon: boolean,
	event: Event
) => {
	console.log('entrySettledEvent')
	const eventLogId = await handleEventLog(event, ContractNames.FareSpinGame)
	if (!eventLogId) return

	const [_entryId, _player, _settled, _totalEntryAmount, _totalWinAmount] =
		await spinAPI.contract.batchEntryMap(roundId, batchId)
	const batchEntryEntity = await repo.batchEntry
		.search()
		.where('batchEntryId')
		.equal(BNToNumber(batchId))
		.where('roundId')
		.equal(BNToNumber(roundId))
		.returnFirst()

	batchEntryEntity.settled = true
	// SHOULD ONLY SETTLED ENTRIES AND BATCH ENTRY
	if (hasWon) {
		batchEntryEntity.totalWinAmount = formatETH(_totalWinAmount)
	}
	await repo.batchEntry.save(batchEntryEntity)
}

// struct Entry {
//     uint256 amount;
//     uint256 gameModeId;
//     uint256 pickedNumber;
// }

// struct BatchEntry {
//     uint256 entryId;
//     address player;
//     bool settled;
//     uint256 totalEntryAmount;
//     uint256 totalWinAmount;
// }

// struct GameMode {
//     uint256 id;
//     uint256 cardinality;
//     uint256 gameEdgeFloor;
//     uint256 mintMultiplier;
//     uint256 minAmount;
//     uint256 maxAmount;
//     uint256 entryLimit;
//     bool isActive;
// }

// struct Round {
//     uint256 id;
//     uint256 randomNum;
//     uint256 randomEliminator;
//     bytes32 vrfRequestId;
// }

// struct Eliminator {
//     uint256 gameModeId;
//     uint256 recordedEdgeFloor; // gameModeFloor at the time of the round
//     bool isEliminator;
// }

// event EntrySubmitted(
//     uint256 indexed roundId,
//     uint256 indexed batchId,
//     address indexed player,
//     uint256 entryId
// );
// event EntrySettled(
//     uint256 indexed roundId,
//     uint256 indexed batchId,
//     address indexed player,
//     uint256 entryId,
//     bool hasWon
// );
// event RoundConcluded(
//     uint256 indexed roundId,
//     bytes32 indexed vrfRequestId,
//     uint256 randomNum,
//     uint256 randomEliminator
// );
// event RandomNumberRequested(bytes32 indexed vrfRequestId);
// event NFTWon(
//     uint256 indexed roundId,
//     uint256 indexed batchId,
//     address indexed player
// );
