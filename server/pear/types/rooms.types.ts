export enum ROOM_NAMES {
	GENERAL = 'general',
	LOBBY = 'lobby',
	SPIN_GAME = 'spin-game',
	MEDIA_STREAM = 'media-stream',
	CHAT_ROOM = 'chat-room',
}

export interface IRoomOptions {
	name: string
	desc: string
	password: string | null
}
