import { useContext, useMemo } from 'react'
import { eth, crypto } from '../lib/pears'

import { PearContext, IPearContext } from '../contexts/PearProvider'
import { IPearContextReducer } from '../contexts/reducers/pearReducer'

export interface IPearHook extends IPearContext, IPearContextReducer {
    pearEth: typeof eth,
    pearCrypto: typeof crypto,
}

function useAuth(): IPearHook {
    const pearContext = useContext(PearContext)

    const pearState = useMemo(
        () => ({
            ...pearContext,
            pearEth: eth,
            pearCrypto: crypto,
        }),
        [pearContext]
    )

    return pearState
}

export default useAuth
