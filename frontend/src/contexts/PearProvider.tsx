import { createContext, useCallback, useEffect, useState, useMemo } from 'react'
import { providers, Contract } from 'ethers'

// Libraries
import * as pears from '../lib/pears'
import { initialContext, usePearReducer, IPearContextReducer } from './reducers/pearReducer'
import { chains } from '../config/constants'

export type PearNetworkProvider =
    | providers.Web3Provider
    | providers.JsonRpcProvider
    | null

// JSONRPC = 'Metamask not installed so default to JSONRPC'
// WEB3 = 'Metamask is installed'
export enum ProviderType {
    JSONRPC = 'JSONRPC',
    WEB3 = 'WEB3',
}

export interface IPearContext extends IPearContextReducer {
    provider?: providers.Web3Provider
    pearTokenContract?: Contract
    setProvider?: any
    providerType?: ProviderType
    setProviderType?: any
    layoutRef?: any
}

export const initialPearState = {
    setProvider: () => {},
    setProviderType: () => {},
    ...initialContext,
}

export const PearContext = createContext<IPearContext>(initialPearState)

function PearProvider({ children, layoutRef }: any) {
       const {
           name,
           actions,
           reducer,
           state,
           dispatch,
           caseReducers,
       } = usePearReducer()
    const [defaultProvider, defaultProviderType] = pears.eth.getDefaultProvider(
        chains.eth.test.infura.https
    )
    const [providerType, setProviderType] =
        useState<ProviderType>(defaultProviderType)
    const [provider, setProvider] = useState<providers.Web3Provider>(
        defaultProvider
    )

    const pearTokenContract = useMemo(() => {
        if (provider) {
            return pears.eth.getPearContract(provider)
        }
    }, [provider])

    return (
        <PearContext.Provider
            value={{
                provider,
                setProvider,
                providerType,
                setProviderType,
                pearTokenContract,
                name,
                actions,
                reducer,
                state,
                dispatch,
                caseReducers,
                layoutRef,
            }}
        >
            {children}
        </PearContext.Provider>
    )
}

export default PearProvider
