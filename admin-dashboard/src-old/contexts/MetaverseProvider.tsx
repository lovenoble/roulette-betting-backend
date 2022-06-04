import { createContext, useCallback, useEffect, useState, useMemo } from 'react'
import { providers, Contract } from 'ethers'

// Libraries
import * as pears from '../lib/pears'
import {
    initialContext,
    useMetaverseReducer,
    IMetaverseReducer,
} from './reducers/metaverseReducer'
import { chains } from '../config/constants'

export interface IMetaverseContext extends IMetaverseReducer {
    roomName: string
}

export const initialPearState = {
    roomName: 'pear-metaverse',
    ...initialContext,
}

export const MetaverseContext = createContext<IMetaverseContext>(initialPearState)

function PearProvider({ children, layoutRef }: any) {
    const { name, actions, reducer, state, dispatch, caseReducers } =
        useMetaverseReducer()

    return (
        <MetaverseContext.Provider
            value={{
                roomName: 'roomName',
                name,
                actions,
                reducer,
                state,
                dispatch,
                caseReducers,
            }}
        >
            {children}
        </MetaverseContext.Provider>
    )
}

export default PearProvider
