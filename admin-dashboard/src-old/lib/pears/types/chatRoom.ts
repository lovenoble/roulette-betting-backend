import { MapSchema } from '@colyseus/schema'

export enum ChatRoomType {
    GAME = 'chatRoom',
    LOBBY = 'lobby',
    GENERAL = 'chatRoom',
}

export enum PearMessages {
    NEW_CHAT_MESSAGE = 'NEW_CHAT_MESSAGE',
}

export interface IRTPlayer {
    id: any
    username?: string
    publicAddress: string
}

export interface IRTChatMessage {
    id: string
    text: string
    createdBy: string
    createdAt: number
}

export interface IRTChatState {
    messages: MapSchema<IRTChatMessage>
    players: MapSchema<IRTPlayer>
}
