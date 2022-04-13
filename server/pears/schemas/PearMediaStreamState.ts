import { Schema, MapSchema, type } from '@colyseus/schema'
import { IPearMediaUser } from '../types/IPearMediaStreamState'

export class PearMediaUser extends Schema implements IPearMediaUser {
	@type('string') publicAddress = ''
	@type('string') nickName = ''
	@type('string') callId = ''

	constructor(pearMediaUser: { publicAddress: string; nickName?: string; callId?: string }) {
		super(pearMediaUser)
		this.publicAddress = pearMediaUser.publicAddress
		this.nickName = pearMediaUser.nickName
		this.callId = pearMediaUser.callId
	}
}

export class PearScreenShare extends Schema implements PearScreenShare {
	@type('string') peerId = ''
	@type('string') publicAddress = ''
	@type('boolean') isScreenSharing = false

	constructor(peerId: string, publicAddress?: string) {
		super(peerId)
		this.peerId = peerId
		this.publicAddress = publicAddress
	}
}

export class PearMediaStreamState extends Schema {
	@type({ map: PearMediaUser })
	connectedUsers = new MapSchema<PearMediaUser>()
	@type({ map: PearScreenShare })
	pearScreenShares = new MapSchema<PearScreenShare>()
}
