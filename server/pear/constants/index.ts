// General
export enum RoomName {
	Lobby = 'Lobby',
	Spin = 'Spin',
	ChatRoom = 'ChatRoom',
	MediaStream = 'MediaStream',
}

export const MAX_CHAT_MESSAGE_LENGTH = 140
export const MAX_SPIN_CLIENTS = 2500
export const INITIAL_COUNTDOWN_SECS = 300 // 5 minutes

// Import/Exports
export * from './HttpStatusCodes'
export * from './WebSocketStatusCodes'
export * from './SpinRoom'
