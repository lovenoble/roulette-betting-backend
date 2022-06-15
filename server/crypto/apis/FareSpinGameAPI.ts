import { BigNumber, utils } from 'ethers'

import { BNToNumber } from '../utils'

import type { IEntry, IBatchEntry, IRound, IEliminator, GameModeParams } from '../types/spin.types'
import type { FareToken, FareSpinGame, EntryStructOutput, EliminatorStructOutput } from '../types'

import { GameModes } from '../constants'
import config from '../../config/crypto.config'

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

	public parseEliminator(eliminator: EliminatorStructOutput): IEliminator {
		return {
			gameModeId: BNToNumber(eliminator.gameModeId),
			recordedEdgeFloor: BNToNumber(eliminator.recordedEdgeFloor),
			isEliminator: eliminator.isEliminator,
		}
	}

	public async getAllEliminatorsByRound(roundId: number): Promise<IEliminator[]> {
		const eliminators = await this.contract.getEliminatorsByRoundId(roundId)

		return eliminators.map(elim => this.parseEliminator(elim))
	}

	public async getVRF(roundId: BigNumber | number): Promise<string> {
		const round = await this.contract.rounds(roundId)
		const vrfNum = utils.formatUnits(round.vrfNum, 0)
		return vrfNum
	}

	public parseEntry(entry: EntryStructOutput): IEntry {
		return {
			gameModeId: BNToNumber(entry.gameModeId),
			amount: BNToNumber(entry.amount, 18),
			pickedNumber: BNToNumber(entry.pickedNumber),
		}
	}

	public async getAllEntries(roundId: BigNumber | number, player: string): Promise<IEntry[]> {
		const bcEntries = await this.contract.getEntriesByRoundPlayer(roundId, player)

		const entries = bcEntries.map(entry => {
			return this.parseEntry(entry)
		})

		return entries
	}

	public async getBatchEntry(roundId: number, player: string): Promise<IBatchEntry> {
		const _batchEntry = await this.contract.batchEntryMap(roundId, player)

		return {
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

		const players = await this.contract.getAllPlayersByRoundId(roundId)

		const promiseList = players.map((player): Promise<IBatchEntry> => {
			return new Promise((resolve, reject) => {
				this.getBatchEntry(roundId, player)
					.then(batchEntry => {
						totalRoundEntryAmount += batchEntry.totalEntryAmount
						totalRoundWinAmount += batchEntry.totalWinAmount
						if (includeEntries) {
							this.getAllEntries(roundId, player)
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
