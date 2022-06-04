export enum RoomName {
	Lobby = 'Lobby',
	Spin = 'Spin',
	ChatRoom = 'ChatRoom',
	MediaStream = 'MediaStream',
}

// @NOTE: Extract spin room messages here
export enum SpinMessage {
	Test = 'Test',
}

export enum ChatMessage {
	NewChatMessage = 'NewChatMessage',
}

export enum MediaStreamMessage {
	NEW_SCREEN_SHARE = 'NewScreenShare',
	TOGGLE_SCREEN_SHARE = 'ToggleScreenShare',
	STOP_SCREEN_SHARE = 'StopScreenShare',
}

// Import/Exports
export * from './HttpStatusCodes'
export * from './WebSocketStatusCodes'
