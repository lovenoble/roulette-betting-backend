import { Server, LobbyRoom } from '@colyseus/core'

import SpinRoom from './SpinRoom'
// import ChatRoom from './ChatRoom'
// import MediaStream from './MediaStream'

import type { RoomMap } from '../types'
import { RoomName } from '../constants'

export const roomList: RoomMap = {
	lobby: {
		name: RoomName.Lobby,
		def: LobbyRoom,
		options: {
			name: 'Match-making Lobby',
			desc: 'Lobby room for matching-making',
			password: null,
		},
	},
	spin: {
		name: RoomName.Spin,
		def: SpinRoom,
		options: {
			name: 'Spin Game',
			desc: 'Fareplay Spin Game Room',
			password: null,
		},
	},
	// mediaStream: {
	// 	def: MediaStream,
	// 	options: {
	// 		name: RoomName.MediaStream
	// 		desc: 'Media Stream for audio, video, file-sharing, and screen-sharing',
	// 		password: null,
	// 	},
	// },
	// chat: {
	// 	def: ChatRoom,
	// 	options: {
	// 		name: RoomName.ChatRoom,
	// 		desc: 'General chat room for players.',
	// 		password: null,
	// 	},
	// },
}

class Rooms {
	pearServer: Server = null
	RoomName = RoomName
	roomList = roomList

	constructor(pearServer: Server) {
		this.pearServer = pearServer
	}

	createAll() {
		const { spin, lobby } = this.roomList

		this.pearServer.define(spin.name, spin.def, spin.options)
		this.pearServer.define(lobby.name, lobby.def, lobby.options)

		// this.pearServer.define(RoomName.Lobby, LobbyRoom)
		// this.pearServer.define(RoomName.Spin, SpinRoom, {
		// 	name: 'Spin Game',
		// 	desc: 'Fareplay Spin Game Room',
		// 	password: null,
		// })

		// this.pearServer.define(RoomName.MediaStream, PearMediaStream, {
		// 	name: 'Media Stream',
		// 	desc: 'Media Stream for audio, video, file-sharing, and screen-sharing',
		// 	password: null,
		// })
		// this.pearServer
		// 	.define(RoomName.ChatRoom, ChatRoom, {
		// 		name: 'Chat Room',
		// 		desc: 'General chat room for players.',
		// 		password: null,
		// 	})
		// 	.enableRealtimeListing()
	}
}

export default Rooms
