import { useReducer, useMemo } from 'react'
import { RoomAvailable } from 'colyseus.js'
import Realtime from '../../lib/pears/services/Realtime'
import { createSlice, PayloadAction, AnyAction } from '@reduxjs/toolkit'

import * as t from './types/realtime'

export const initialRealtimeState: t.IRealtimeState = {
    joinedLobby: false,
    joinedRoom: false,
    sessionId: '',
    roomId: '',
    roomName: '',
    roomDesc: '',
    availableRooms: new Array<RoomAvailable>(),
    players: new Map<string, t.types.IRTPlayer>(),
    messages: new Map<string, t.types.IRTChatMessage>(),
}

const realtimeSlice = createSlice({
    name: 'realtime',
    initialState: initialRealtimeState,
    reducers: {
        setJoinedLobby: (state, action: PayloadAction<boolean>) => {
            state.joinedLobby = action.payload
        },
        setJoinedRoom: (state, action: PayloadAction<boolean>) => {
            state.joinedRoom = action.payload
        },
        setSessionId: (state, action: PayloadAction<string>) => {
            state.sessionId = action.payload
        },
        setRoomMetadata: (
            state,
            action: PayloadAction<t.ISetRoomMetadataPayload>
        ) => {
            const { roomId, roomName, roomDesc } = action.payload

            state.roomId = roomId || ''
            state.roomName = roomName
            state.roomDesc = roomDesc || ''
        },
        setAvailableRooms: (state, action: PayloadAction<RoomAvailable[]>) => {
            state.availableRooms = action.payload
        },
        addAvailableRoom: (state, action: PayloadAction<{ roomId: string; room: RoomAvailable }>) => {
            const roomIdx = state.availableRooms.findIndex(
                (room) => room.roomId === action.payload.roomId
            )

            if (roomIdx !== -1) {
                state.availableRooms[roomIdx] = action.payload.room
            } else {
                state.availableRooms.push(action.payload.room)
            }
        },
        removeAvailableRoom: (state, action: PayloadAction<string>) => {
            state.availableRooms = state.availableRooms.filter(
                ({ roomId }) => roomId !== action.payload
            )
        },
        addPlayer: (state, action: PayloadAction<t.types.IRTPlayer>) => {
            state.players.set(action.payload.id, action.payload)
        },
        removePlayer: (state, action: PayloadAction<string>) => {
            state.players.delete(action.payload)
        },
        addChatMessage: (
            state,
            action: PayloadAction<t.types.IRTChatMessage>
        ) => {
            state.messages.set(action.payload.id, action.payload)
        },
        removeChatMessages: (state, action: PayloadAction<string>) => {
            state.messages.delete(action.payload)
        },
    },
})
const { name, actions, reducer, caseReducers } = realtimeSlice

export type RealtimeActions = typeof realtimeSlice.actions

export interface IRealtimeContext {
    name: typeof realtimeSlice.name
    reducer: typeof realtimeSlice.reducer
    actions: RealtimeActions
    caseReducers: typeof realtimeSlice.caseReducers
    state: t.IRealtimeState
    realtime: Realtime
    dispatch?: React.Dispatch<AnyAction>
}

export const initialContext: IRealtimeContext = {
    name,
    actions,
    reducer,
    caseReducers,
    state: initialRealtimeState,
    realtime: new Realtime(),
}

export const useRealtimeReducer = () => {
    const [state, dispatch] = useReducer(reducer, initialRealtimeState)

    // Pass dispatch and state inside of here
    const realtime = useMemo(() => {
        const rt = new Realtime()
        rt.defineDispatchActions(dispatch, actions)
        return rt
    }, [])

    return {
        name,
        actions,
        reducer,
        state,
        dispatch,
        caseReducers,
        realtime,
    }
}
