import { createContext, useCallback, useEffect, useState, useMemo } from 'react'

// Libraries
import { initialContext, useRealtimeReducer } from './reducers/realtimeReducer'

export const RealtimeContext = createContext(initialContext)

function RealtimeProvider({ children }: any) {
    const { name, actions, reducer, state, dispatch, caseReducers, realtime } =
        useRealtimeReducer()

    return (
        <RealtimeContext.Provider
            value={{
                name,
                reducer,
                actions,
                caseReducers,
                state,
                dispatch,
                realtime,
            }}
        >
            {children}
        </RealtimeContext.Provider>
    )
}

export default RealtimeProvider
