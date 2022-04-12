export enum ChatRoomType {
	GAME = 'game',
	LOBBY = 'lobby',
	GENERAL = 'general',
}

export interface IChatRoomData {
	name: string
	desc: string
	password: string | null
}
