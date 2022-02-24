import { useReducer, useMemo } from 'react'
import { createSlice, PayloadAction, AnyAction } from '@reduxjs/toolkit'

import * as t from './types/metaverse'

export const _initialMetaverseState: t.IPearMetaverseState = {
    metaversePlayers: new Map<string, t.IMetaversePlayer>(),
}

const metaverseSlice = createSlice({
    name: 'metaverse',
    initialState: _initialMetaverseState,
    reducers: {
        setMetaversePlayer: (state, action: PayloadAction<any>) => {
            state.metaversePlayers.set(action.payload.sessionId, action.payload)
        },
        updateMetaversePlayer: (state, action: PayloadAction<any>) => {
            const metaversePlayer = state.metaversePlayers.get(action.payload.sessionId)
            state.metaversePlayers.set(action.payload.sessionId, Object.assign(metaversePlayer, action.payload))
        },
        removeMetaversePlayer: (state, action: PayloadAction<string>) => {
            state.metaversePlayers.delete(action.payload)
        },
    },
})
const { name, actions, reducer, caseReducers } = metaverseSlice

export type MetaverseActions = typeof metaverseSlice.actions

export interface IMetaverseReducer {
    name: typeof name
    reducer: typeof reducer
    actions: MetaverseActions
    caseReducers: typeof caseReducers
    state: t.IPearMetaverseState
    dispatch?: React.Dispatch<AnyAction>
}

export const initialContext: IMetaverseReducer = {
    name,
    actions,
    reducer,
    caseReducers,
    state: _initialMetaverseState,
}

export const useMetaverseReducer = () => {
    const [state, dispatch] = useReducer(reducer, _initialMetaverseState)

    return {
        name,
        actions,
        reducer,
        state,
        dispatch,
        caseReducers,
    }
}
