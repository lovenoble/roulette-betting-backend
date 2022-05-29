import { Server, LobbyRoom } from '@colyseus/core'

import ChatRoom from './ChatRoom'
import SpinRoom from './SpinRoom'
// import MediaStream from './MediaStream'

import { RoomDef, RoomName } from '../types/rooms.types'

class Rooms {
	pearServer: Server = null
	ROOM_NAMES = RoomName

	constructor(pearServer: Server) {
		this.pearServer = pearServer
	}

	createAll() {
		this.pearServer.define(RoomName.Lobby, LobbyRoom)
		this.pearServer.define(RoomName.Spin, SpinRoom, {
			name: 'Spin Game',
			desc: 'Fareplay Spin Game Room',
			password: null,
		})
		// this.pearServer.define(RoomName.MediaStream, PearMediaStream, {
		// 	name: 'Media Stream',
		// 	desc: 'Media Stream for audio, video, file-sharing, and screen-sharing',
		// 	password: null,
		// })
		this.pearServer
			.define(RoomName.ChatRoom, ChatRoom, {
				name: 'Chat Room',
				desc: 'General chat room for players.',
				password: null,
			})
			.enableRealtimeListing()
	}
}

export default Rooms
