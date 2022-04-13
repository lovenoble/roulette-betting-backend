import { useReducer, useMemo } from 'react'
import { createSlice, PayloadAction, AnyAction } from '@reduxjs/toolkit'

import * as t from './types/pear'

export const _initialPearState: t.IPearState = {
    gamePlayers: new Map<string, t.IWallet>(),
    guestPlayers: new Map<string, t.IGuestPlayer>(),
    entries: new Map<string, t.IEntry[]>(),
    myWallet: {
        id: '',
        ethBalance: '0',
        pearBalance: '0',
        depositBalance: '0',
        queueBalance: '0',
        prizeBalance: '0',
    },
    pearSupply: '',
    currentRoundId: '0',
}

const pearSlice = createSlice({
    name: 'pear',
    initialState: _initialPearState,
    reducers: {
        setMyWallet: (state, action: PayloadAction<any>) => {
            state.myWallet = Object.assign(state.myWallet, action.payload)
        },
        setPlayerWallet: (state, action: PayloadAction<any>) => {
            state.gamePlayers.set(
                action.payload.id,
                Object.assign(
                    state.gamePlayers.get(action.payload.id) || {},
                    action.payload
                )
            )
        },
        removePlayer: (state, action: PayloadAction<string>) => {
            state.gamePlayers.delete(action.payload)
        },
        setPearSupply: (state, action: PayloadAction<string>) => {
            state.pearSupply = action.payload
        },
        setCurrentRoundId: (state, action: PayloadAction<string>) => {
            state.currentRoundId = action.payload
        },
        setRound: (state, action: PayloadAction<any>) => {
            state.entries.set(action.payload.id, action.payload.entryList)
        },
        addEntry: (state, action: PayloadAction<any>) => {
            const round = state.entries.get(action.payload.id)
            if (round) {
                if (!round[action.payload.entryId]) {
                    round[action.payload.entryId] = action.payload
                }
            }
        }
    },
})
const { name, actions, reducer, caseReducers } = pearSlice

export type PearActions = typeof pearSlice.actions

export interface IPearContextReducer {
    name: typeof name
    reducer: typeof reducer
    actions: PearActions
    caseReducers: typeof caseReducers
    state: t.IPearState
    dispatch?: React.Dispatch<AnyAction>
}

export const initialContext: IPearContextReducer = {
    name,
    actions,
    reducer,
    caseReducers,
    state: _initialPearState,
}

export const usePearReducer = () => {
    const [state, dispatch] = useReducer(reducer, _initialPearState)

    return {
        name,
        actions,
        reducer,
        state,
        dispatch,
        caseReducers,
    }
}
