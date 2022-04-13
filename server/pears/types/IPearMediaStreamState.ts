import { Schema, MapSchema } from '@colyseus/schema'

export interface IPearMediaUser extends Schema {
	publicAddress: string
	nickName?: string
	callId?: string
}

export interface IPearScreenShare extends Schema {
	peerId: string
	publicAddress?: string
	isScreenSharing: boolean
}

export interface IPearMediaStreamState extends Schema {
	connectedUsers: MapSchema<IPearMediaUser>
	pearScreenShares: MapSchema<IPearScreenShare>
}
