import { Command } from '@colyseus/command'
import { Room } from 'colyseus'
import { utils } from 'ethers'

// Libraries
import PearCrypto from '../crypto'
import { GamePlayer, Entry, GuestPlayer, SpinGameState } from '../schemas/SpinGameState'

const fu = utils.formatUnits

class SpinGame extends Room<SpinGameState> {}

export class OnGuestPlayerJoined extends Command<
	SpinGame,
	{
		guestUsername: string
		sessionId: string
	}
> {
	async execute({ guestUsername, sessionId }) {
		try {
			const joinedGuestPlayer = new GuestPlayer({
				guestUsername,
				pearBalance: '5000000',
				depositBalance: '100000',
				queueBalance: '0',
			})

			this.state.guestPlayers.set(sessionId, joinedGuestPlayer)
		} catch (err) {
			console.error(err)
		}
	}
}

export class OnWalletUpdate extends Command<
	SpinGame,
	{
		playerAddress: string
		pear: PearCrypto
	}
> {
	async execute({ playerAddress, pear }) {
		try {
			const { ethBalance, pearBalance, depositBalance, queueBalance, prizeBalance } =
				await pear.getAllPearBalances(playerAddress)
			const gp = this.state.gamePlayers.get(playerAddress)
			if (!gp) {
				const joinedGamePlayer = new GamePlayer({
					publicAddress: playerAddress,
					ethBalance,
					pearBalance,
					depositBalance,
					queueBalance,
					prizeBalance,
				})

				this.state.gamePlayers.set(playerAddress, joinedGamePlayer)
			} else {
				gp.ethBalance = ethBalance
				gp.pearBalance = pearBalance
				gp.depositBalance = depositBalance
				gp.queueBalance = queueBalance
				gp.prizeBalance = prizeBalance
			}
		} catch (err) {
			console.error(err)
		}
	}
}

export class OnNewEntry extends Command<
	SpinGame,
	{
		roundId: string
		entryId: string
		pear: PearCrypto
	}
> {
	async execute({ roundId, entryId, pear }) {
		try {
			const entry = await pear.pearGameContract.entryMap(roundId, entryId)
			const newEntry = new Entry({
				publicAddress: entry.player,
				roundId: this.state.currentRoundId,
				amount: fu(entry.amount),
				pickedColor: entry.pickedNumber.toString(),
				isSettled: entry.isSettled,
				result: fu(entry.result, 0),
				winAmount: fu(entry.winAmount),
			})

			const entryList = this.state.entries.get(fu(roundId, 0))

			entryList.list[fu(entryId, 0)] = newEntry
		} catch (err) {
			console.error(err)
		}
	}
}
