import { Room } from 'colyseus'
import { Command, Dispatcher } from '@colyseus/command'
import chalk from 'chalk'
import { utils } from 'ethers'

import PearCrypto from '../crypto'
import { Entry, EntryList, ColorGameState } from '../schemas/ColorGameState'

const fu = utils.formatUnits
const log = (val: string) => console.log(chalk.bgBlack.magenta(val))

class ColorGame extends Room<ColorGameState> {}

export class OnFetchFareSupply extends Command<
	ColorGame,
	{
		pear: PearCrypto
	}
> {
	async execute({ pear }) {
		try {
			const pearTotalSupply = await pear.getPearTotalSupply()
			this.state.pearSupply = pearTotalSupply
		} catch (err) {
			console.error(err)
		}
	}
}

export class OnFetchRoundAndEntries extends Command<
	ColorGame,
	{
		pear: PearCrypto
		dispatcher: Dispatcher<ColorGame>
		OnNewEntry: any
		OnWalletUpdate: any
	}
> {
	async execute({ pear, dispatcher, OnNewEntry, OnWalletUpdate }) {
		try {
			let currentRoundId = await pear.pearGameContract.currentRoundId()
			currentRoundId = fu(currentRoundId, 0)
			await pear.getInitialGameEntries(this.state, currentRoundId)
			this.state.currentRoundId = currentRoundId

			pear.pearGameContract.on(
				'EntrySubmitted',
				async (roundId, player, amount, color, gameMode, entryId) => {
					if (this.state.entries[fu(roundId, 0)].list[fu(entryId, 0)]) return
					try {
						log('-------------------------------')
						log('EntrySubmitted')
						log(`Player Address: ${player}`)
						log(`Entry Id: ${fu(entryId, 0)}`)
						log(`Entry Amount: ${fu(amount)}`)
						log(`Color Id: ${fu(color, 0)}`)
						log('-------------------------------')
						dispatcher.dispatch(new OnNewEntry(), {
							pear,
							roundId,
							entryId,
						})

						dispatcher.dispatch(new OnWalletUpdate(), {
							pear,
							playerAddress: player,
						})
					} catch (err) {
						console.error(err.toString())
					}
				}
			)

			pear.pearTokenContract.on('PrizeClaimed', async (playerAddress, prizeAmount) => {
				log('-------------------------------')
				log('PrizeClaimed')
				log(`Player Address: ${playerAddress}`)
				log(`Prize Amount: ${fu(prizeAmount)}`)
				log('-------------------------------')

				dispatcher.dispatch(new OnWalletUpdate(), {
					playerAddress,
					pear,
				})
			})

			pear.pearTokenContract.on('PearDeposited', async (playerAddress, depositAmount) => {
				log('----------------------------')
				log('PearDeposited')
				log(`Player Address: ${playerAddress}`)
				log(`DepositAmount: ${fu(depositAmount)}`)
				log('----------------------------')

				dispatcher.dispatch(new OnWalletUpdate(), {
					playerAddress,
					pear,
				})
			})

			// func cb params from, to, value
			pear.pearTokenContract.on('Transfer', async (from, to) => {
				dispatcher.dispatch(new OnWalletUpdate(), {
					playerAddress: from,
					pear,
				})
				dispatcher.dispatch(new OnWalletUpdate(), {
					playerAddress: to,
					pear,
				})
			})

			pear.pearTokenContract.on('PlayerWithdrawal', async (playerAddress, withdrawAmount) => {
				log('----------------------------')
				log('PlayerWithdrawal')
				log(`Player Address: ${playerAddress}`)
				log(`DepositAmount: ${fu(withdrawAmount)}`)
				log('----------------------------')

				dispatcher.dispatch(new OnWalletUpdate(), {
					playerAddress,
					pear,
				})
			})

			pear.pearGameContract.on(
				'EntrySettled',
				() => {}
				// async (roundId, player, amount, pickedColor, result, winAmount, idx) => {

				// 	dispatcher.dispatch(new OnWalletUpdate(), {
				// 		playerAddress: player,
				// 		pear,
				// 	})
				// }
			)

			// @NOTE: Remove the timeouts and make dynamic
			// @NOTE: Hard-coding 3 second timeout to account for spin lag.
			// @NOTE: Hard-coding 10 second timeout to increment to the next round.
			pear.pearGameContract.on(
				'RoundConcluded',
				async (_roundId, amountMinted, amountBurned, randomColor) => {
					// If concluded round isn't current round then event is older
					if (fu(_roundId, 0) !== this.state.currentRoundId) return

					let isEven = Number(randomColor.toString()) % 2 === 0

					this.state.vrfNum = isEven ? '0' : '1'

					const roundId = fu(_roundId, 0)
					log('----------------------------')
					log(`RoundConcluded: ${roundId}`)
					log('----------------------------')

					const entries: any[] = await pear.pearGameContract.getRoundEntries(roundId)
					setTimeout(async () => {
						const newEntryList = new EntryList()

						entries.forEach(entry => {
							const newEntry = new Entry({
								publicAddress: entry.player,
								roundId,
								amount: fu(entry.amount),
								pickedColor: entry.pickedNumber.toString(),
								isSettled: entry.isSettled,
								result: fu(entry.result, 0),
								winAmount: fu(entry.winAmount),
							})
							newEntryList.list.push(newEntry)
						})

						this.state.entries.set(roundId, newEntryList)
						const pearTotalSupply = await pear.getPearTotalSupply()
						this.state.pearSupply = pearTotalSupply

						const _currentRoundId = await pear.pearGameContract.currentRoundId()
						this.state.entries.set(fu(_currentRoundId, 0), new EntryList())
						setTimeout(async () => {
							this.state.vrfNum = ''
							this.state.roundStarted = false
							this.state.currentRoundId = fu(_currentRoundId, 0)
						}, 10000)
					}, 3000)
				}
			)
		} catch (err) {
			console.error(err)
		}
	}
}
