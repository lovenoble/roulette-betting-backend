import { Server, LobbyRoom } from '@colyseus/core'

import ChatRoom from './rooms/ChatRoom'
import SpinRoom from './rooms/SpinRoom'
// import PearMediaStream from './defs/MediaStream'
import { ROOM_NAMES } from './types/rooms.types'

const {
	LOBBY,
	SPIN_GAME,
	// MEDIA_STREAM,
	CHAT_ROOM,
} = ROOM_NAMES

class Sockets {
	gameServer: Server = null

	constructor(gameServer: Server) {
		this.gameServer = gameServer
	}

	initRooms() {
		this.gameServer.define(LOBBY, LobbyRoom)
		this.gameServer.define(SPIN_GAME, SpinRoom, {
			name: 'Spin Game',
			desc: 'Fareplay spin game room',
			password: null,
		})
		// this.gameServer.define(MEDIA_STREAM, PearMediaStream, {
		// 	name: 'Media Stream',
		// 	desc: 'Media Stream for audio, video, file-sharing, and screen-sharing',
		// 	password: null,
		// })
		this.gameServer
			.define(CHAT_ROOM, ChatRoom, {
				name: 'Chat Room',
				desc: 'General chat room for players.',
				password: null,
			})
			.enableRealtimeListing()
	}
}

export default Sockets
