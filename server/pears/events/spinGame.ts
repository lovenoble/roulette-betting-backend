import type { BigNumber, Event } from 'ethers'

import redisStore from '../../redis-store'
import { tokenAPI as _tokenAPI, spinAPI } from '../crypto/contracts'
import {
	handleEventLog,
	ContractNames,
	gmMultiplierMap,
	formatBN,
	formatETH,
	BNToNumber,
} from './utils'

const { repo } = redisStore

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
