import { Schema, MapSchema, type } from '@colyseus/schema'
import { IMediaUserOptions, IScreenShareOptions } from '../types/mediaStream.types'

export class MediaUser extends Schema implements IMediaUserOptions {
	@type('string') publicAddress = ''
	@type('string') nickName? = ''
	@type('string') callId? = ''

	constructor(mediaUser: IMediaUserOptions) {
		super(mediaUser)
		this.publicAddress = mediaUser.publicAddress
		this.nickName = mediaUser.nickName
		this.callId = mediaUser.callId
	}
}

export class ScreenShare extends Schema implements IScreenShareOptions {
	@type('string') peerId = ''
	@type('string') publicAddress? = ''
	@type('boolean') isScreenSharing = false

	constructor(peerId: string, publicAddress?: string) {
		super(peerId)
		this.peerId = peerId
		this.publicAddress = publicAddress
	}
}

export class MediaStreamState extends Schema {
	@type({ map: MediaUser })
	connectedUsers = new MapSchema<MediaUser>()
	@type({ map: ScreenShare })
	screenShares = new MapSchema<ScreenShare>()
}
