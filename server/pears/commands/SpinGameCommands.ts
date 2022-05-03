import { Command } from '@colyseus/command'
import { Room } from 'colyseus'
import { utils } from 'ethers'

// Libraries
import PearCrypto from '../crypto'
import { SpinGameState, GamePlayer } from '../schemas/SpinGameState.new'
import { tokenAPI, spinAPI } from '../crypto/contracts'

export const fu = utils.formatUnits

class SpinGame extends Room<SpinGameState> {}

// export class Entry extends Schema {
// 	@type('string') gameModeId: number
// 	@type('string') amount: string
// 	@type('string') pickedNumber: number
// }

// export class GamePlayer extends Schema {
// 	@type('string') publicAddress: string
// 	@type('string') avaxBalance: string
// 	@type('string') fareBalance: string
// 	@type('string') queueBalance: string
// 	@type('string') claimBalance: string
// 	@type('boolean') isGuest: boolean
// }

// export class RoundInfo extends Schema {
// 	@type('string') currentRoundId: string
// 	@type('string') fareSupply: string
// 	@type('boolean') roundStarted: boolean
// 	@type('string') randomNum: string
// 	@type('boolean') isEliminator: boolean
// }

// export class SpinGameState extends Schema {
// 	@type({ map: GamePlayer }) gamePlayers = new MapSchema<GamePlayer>()
// 	@type([Entry]) entries = new ArraySchema<Entry[]>()
// 	@type(RoundInfo) roundInfo = new RoundInfo()
// }

// fetch a users balance (fare, avax, current entries/batchentries)

export class OnSetupUser extends Command<
	SpinGame,
	{
		publicAddress: string
	}
> {
	async execute({ publicAddress }) {
		try {
			const avaxBalanace = await tokenAPI.getAvaxBalance(publicAddress)
			const fareBalance = await tokenAPI.getFareBalance(publicAddress)

			const newGamePlayer = new GamePlayer(
				publicAddress,
				avaxBalanace,
				fareBalance,
				'0',
				'0',
				false
			)

			this.state.gamePlayers.set(publicAddress, newGamePlayer)
		} catch (err) {
			console.error(err)
		}
	}
}
