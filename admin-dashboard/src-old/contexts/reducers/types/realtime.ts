import * as rtTypes from '../../../lib/pears/types/chatRoom'
import { RoomAvailable } from 'colyseus.js'

export * as types from '../../../lib/pears/types/chatRoom'

export interface IRealtimeState {
    joinedLobby: boolean
    joinedRoom: boolean
    sessionId: string
    roomId: string
    roomName: string
    roomDesc: string
    availableRooms: RoomAvailable[]
    players: Map<string, rtTypes.IRTPlayer>
    messages: Map<string, rtTypes.IRTChatMessage>
}

export interface ISetRoomMetadataPayload {
    roomId?: string
    roomName: string
    roomDesc?: string
}