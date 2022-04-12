import { Schema, MapSchema, ArraySchema, type } from '@colyseus/schema'
import {
	IGuestPlayer,
	IColorGameState,
	IGamePlayer,
	IEntry,
	IEntryList,
} from '../types/IColorGameState'

export class GuestPlayer extends Schema implements IGuestPlayer {
	@type('string') guestUsername = ''
	@type('string') pearBalance = ''
	@type('string') depositBalance = ''
	@type('string') queueBalance = ''

	constructor(guestPlayer: {
		guestUsername: string
		pearBalance: string
		depositBalance: string
		queueBalance: string
	}) {
		super(guestPlayer)
		this.guestUsername = guestPlayer.guestUsername
		this.pearBalance = guestPlayer.pearBalance
		this.depositBalance = guestPlayer.depositBalance
		this.queueBalance = guestPlayer.queueBalance
	}
}

export class GamePlayer extends Schema implements IGamePlayer {
	@type('string') publicAddress = ''
	@type('string') ethBalance = ''
	@type('string') pearBalance = ''
	@type('string') depositBalance = ''
	@type('string') queueBalance = ''
	@type('string') prizeBalance = ''

	constructor(gamePlayer: {
		publicAddress: string
		ethBalance: string
		pearBalance: string
		depositBalance: string
		queueBalance: string
		prizeBalance: string
	}) {
		super(gamePlayer)
		this.publicAddress = gamePlayer.publicAddress
		this.ethBalance = gamePlayer.ethBalance
		this.pearBalance = gamePlayer.pearBalance
		this.depositBalance = gamePlayer.depositBalance
		this.queueBalance = gamePlayer.queueBalance
		this.prizeBalance = gamePlayer.prizeBalance
	}
}

export class Entry extends Schema implements IEntry {
	@type('string') publicAddress = ''
	@type('string') roundId = ''
	@type('string') amount = ''
	@type('string') pickedColor = ''
	@type('boolean') isSettled = false
	@type('string') result = ''
	@type('string') winAmount = ''

	constructor(entry: {
		publicAddress: string
		roundId: string
		amount: string
		pickedColor: string
		isSettled: boolean
		result: string
		winAmount: string
	}) {
		super(entry)
		this.publicAddress = entry.publicAddress
		this.roundId = entry.roundId
		this.amount = entry.amount
		this.pickedColor = entry.pickedColor
		this.isSettled = entry.isSettled
		this.result = entry.result
		this.winAmount = entry.winAmount
	}
}

export class EntryList extends Schema {
	@type([Entry]) list = new ArraySchema<IEntry>()
}

export class ColorGameState extends Schema implements IColorGameState {
	@type({ map: GamePlayer })
	gamePlayers = new MapSchema<IGamePlayer>()
	@type({ map: EntryList })
	entries = new MapSchema<IEntryList>()
	@type({ map: GuestPlayer })
	guestPlayers = new MapSchema<IGuestPlayer>()
	@type('string')
	currentRoundId = ''
	@type('string')
	pearSupply = ''
	@type('boolean')
	roundStarted = false
	@type('string')
	vrfNum = ''
}
