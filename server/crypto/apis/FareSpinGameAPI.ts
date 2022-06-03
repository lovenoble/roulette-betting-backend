import { utils } from 'ethers'

import { BNToNumber } from '../utils'

import type { IEntry, IBatchEntry, IRound, IEliminator, GameModeParams } from '../types/spin.types'
import type { FareToken, FareSpinGame } from '../types'
import { GameModes } from '../constants'
import config from '../../config/crypto.config'

const { formatUnits } = utils

class FareSpinGameAPI {
	public token!: FareToken
	public contract!: FareSpinGame
	private _treasuryAddress = config.treasuryAddress
	private _gameModes = GameModes

	constructor(fareTokenContract: FareToken, fareSpinGameContract: FareSpinGame) {
		this.token = fareTokenContract
		this.contract = fareSpinGameContract
	}

	public get treasuryAddress() {
		return this._treasuryAddress
	}

	public get gameModes() {
		return this._gameModes
	}

	public getAddress(): string {
		return this.contract.address
	}

	public async getByteCode(): Promise<string> {
		return this.contract.provider.getCode(this.getAddress())
	}

	public getGameModeById(id: number): GameModeParams {
		return this.gameModes.filter(gm => BNToNumber(gm.id) === id)[0]
	}

	public async getAllGameModes(): Promise<GameModeParams[]> {
		const currentGameModeId = BNToNumber(await this.contract.getCurrentGameModeId())
		const gameModeIds = [...Array(currentGameModeId).keys()]

		const promiseList = gameModeIds.map(id => this.contract.gameModes(id))

		return Promise.all(promiseList)
	}

	public async getCurrentRoundId(): Promise<number> {
		const currentRoundId = (await this.contract.getCurrentRoundId()).toNumber()

		return currentRoundId
	}

	public async getRound(roundId: number): Promise<IRound> {
		const roundInfo = await this.contract.rounds(roundId)

		return {
			id: BNToNumber(roundInfo.id),
			randomNum: BNToNumber(roundInfo.randomNum),
			randomEliminator: BNToNumber(roundInfo.randomEliminator),
			vrfRequestId: roundInfo.vrfRequestId,
		}
	}

	public async getAllRounds(): Promise<IRound[]> {
		const roundIds = [...Array(await this.getCurrentRoundId()).keys()]
		const promiseList = roundIds.map(id => this.getRound(id))

		return Promise.all(promiseList)
	}

	public async getEliminator(roundId: number, gameModeId: number): Promise<IEliminator> {
		const eliminator = await this.contract.eliminators(roundId, gameModeId)

		return {
			gameModeId: BNToNumber(eliminator.gameModeId),
			recordedEdgeFloor: BNToNumber(eliminator.recordedEdgeFloor),
			isEliminator: eliminator.isEliminator,
		}
	}

	public async getAllEliminatorsByRound(roundId: number) {
		const gameModeIds = this._gameModes.map(({ id }) => BNToNumber(id))

		const promiseList = gameModeIds.map(async gameModeId => {
			return this.getEliminator(roundId, gameModeId)
		})

		return Promise.all(promiseList)
	}

	public async getAllEliminators(roundIds?: number[]): Promise<IEliminator[][]> {
		const gameModeIds = this._gameModes.map(({ id }) => BNToNumber(id))
		let rIds = roundIds
		if (!rIds) {
			rIds = [...Array(await this.getCurrentRoundId()).keys()]
		}

		const promiseList = roundIds.map(async rId => {
			const _internalPromiseList = gameModeIds.map(async gId => {
				return this.getEliminator(rId, gId)
			})

			return Promise.all(_internalPromiseList)
		})

		return Promise.all(promiseList)
	}

	public async getVRF(vrfRequestId: string): Promise<string> {
		const vrfNum = utils.formatUnits(await this.contract.vrfMap(vrfRequestId), 0)
		return vrfNum
	}

	public async getEntry(entryId: number, entryIdx: number): Promise<IEntry> {
		const entry = await this.contract.entryMap(entryId, entryIdx)

		return {
			gameModeId: BNToNumber(entry.gameModeId),
			amount: BNToNumber(entry.amount, 18),
			pickedNumber: BNToNumber(entry.pickedNumber),
		}
	}

	public async getAllEntries(entryId: number): Promise<IEntry[]> {
		const entryCount = Number(formatUnits(await this.contract.getEntryCount(entryId), 0))
		const entryIdxs: number[] = [...Array(entryCount).keys()]

		const promiseList = entryIdxs.map(entryIdx => {
			return this.getEntry(entryId, entryIdx)
		})

		return Promise.all(promiseList)
	}

	public async getBatchEntry(roundId: number, batchEntryId: number): Promise<IBatchEntry> {
		const _batchEntry = await this.contract.batchEntryMap(roundId, batchEntryId)

		return {
			entryId: BNToNumber(_batchEntry.entryId),
			player: _batchEntry.player,
			settled: _batchEntry.settled,
			totalEntryAmount: BNToNumber(_batchEntry.totalEntryAmount, 18),
			totalWinAmount: BNToNumber(_batchEntry.totalWinAmount, 18),
		}
	}

	public async getAllBatchEntries(
		roundId: number,
		includeEntries = true
	): Promise<{
		batchEntries: IBatchEntry[]
		totalRoundEntryAmount: number
		totalRoundWinAmount: number
	}> {
		let totalRoundEntryAmount = 0
		let totalRoundWinAmount = 0
		const batchEntryCount = Number(
			utils.formatUnits(await this.contract.getBatchEntryCount(roundId), 0)
		)
		const batchIds = [...Array(batchEntryCount).keys()]

		const promiseList = batchIds.map((batchId): Promise<IBatchEntry> => {
			return new Promise((resolve, reject) => {
				this.getBatchEntry(roundId, batchId)
					.then(batchEntry => {
						totalRoundEntryAmount += batchEntry.totalEntryAmount
						totalRoundWinAmount += batchEntry.totalWinAmount
						if (includeEntries) {
							this.getAllEntries(batchEntry.entryId)
								.then(entries => {
									const BEWithEntries: IBatchEntry = Object.assign(batchEntry, {
										entries,
									})
									resolve(BEWithEntries)
								})
								.catch(reject)
						} else {
							resolve(batchEntry)
						}
					})
					.catch(reject)
			})
		})

		const batchEntries = await Promise.all(promiseList)

		return {
			batchEntries,
			totalRoundEntryAmount,
			totalRoundWinAmount,
		}
	}
}

export default FareSpinGameAPI
