import { Schema, MapSchema, ArraySchema, type } from '@colyseus/schema'

export class Entry extends Schema {
	@type('string') gameModeId: number
	@type('string') amount: string
	@type('string') pickedNumber: number
}

export class GamePlayer extends Schema {
	@type('string') publicAddress: string
	@type('string') avaxBalance: string
	@type('string') fareBalance: string
	@type('string') queueBalance: string
	@type('string') claimBalance: string
	@type('boolean') isGuest: boolean
}

export class RoundInfo extends Schema {
	@type('string') currentRoundId: string
	@type('string') fareSupply: string
	@type('boolean') roundStarted: boolean
	@type('string') randomNum: string
	@type('boolean') isEliminator: boolean
}

export class SpinGameState extends Schema {
	@type({ map: GamePlayer }) gamePlayers = new MapSchema<GamePlayer>()
	@type([Entry]) entries = new ArraySchema<Entry[]>()
	@type(RoundInfo) roundInfo = new RoundInfo()
}
