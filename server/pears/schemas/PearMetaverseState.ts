import { Schema, MapSchema, type } from '@colyseus/schema'
import { IMetaversePlayer, IPearMetaverseState } from '../types/IPearMetaverseState'

export class MetaversePlayer extends Schema implements IMetaversePlayer {
	@type('string') username = ''
	@type('number') moveX = 0
	@type('number') moveY = 0
	@type('number') moveZ = 0
	@type('number') rotateX = 0
	@type('number') rotateY = 0
	@type('number') rotateZ = 0

	constructor(gamePlayer: {
		username: string
		moveX: number
		moveY: number
		moveZ: number
		rotateX: number
		rotateY: number
		rotateZ: number
	}) {
		super(gamePlayer)
		this.username = gamePlayer.username
		this.moveX = gamePlayer.moveX
		this.moveY = gamePlayer.moveY
		this.moveZ = gamePlayer.moveZ
		this.rotateX = gamePlayer.rotateX
		this.rotateY = gamePlayer.rotateY
		this.rotateZ = gamePlayer.rotateZ
	}
}

export class PearMetaverseState extends Schema implements IPearMetaverseState {
	@type({ map: MetaversePlayer })
	metaversePlayers = new MapSchema<IMetaversePlayer>()
}
