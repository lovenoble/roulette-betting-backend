import { Server, LobbyRoom } from '@colyseus/core'

import SpinRoom from './SpinRoom'
import ChatRoom from './ChatRoom'
import Metaverse from './Metaverse'
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
	chat: {
		name: RoomName.ChatRoom,
		def: ChatRoom,
		options: {
			name: 'Chat Room',
			desc: 'General chat room for players.',
			password: null,
		},
	},
	metaverse: {
		name: RoomName.Metaverse,
		def: Metaverse,
		options: {
			name: 'Metaverse room',
			desc: 'Metaverse room',
			password: null,
		},
	},
}

class Rooms {
	pearServer: Server = null
	RoomName = RoomName
	roomList = roomList

	constructor(pearServer: Server) {
		this.pearServer = pearServer
	}

	createAll() {
		const { chat, spin, lobby, metaverse } = this.roomList

		this.pearServer.define(chat.name, chat.def, chat.options).enableRealtimeListing()
		this.pearServer.define(spin.name, spin.def, spin.options)
		this.pearServer.define(lobby.name, lobby.def, lobby.options)
		this.pearServer.define(metaverse.name, metaverse.def, metaverse.options)
	}
}

export default Rooms
