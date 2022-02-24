import { createContext, useCallback, useEffect, useState, useMemo } from 'react'
import useReactiveStorage from '../hooks/useReactiveStorage'

export interface IAuthContext {
    isLoading: boolean
    setIsLoading: any
    publicAddress: string
    setPublicAddress: any
    nonce: number
    setNonce: any
    authToken?: string
    logout: any
    setAuthToken: (str?: string) => void
    removeAuthToken: () => void
}

export const initialAuthState = {
    isLoading: false,
    setIsLoading: () => {},
    publicAddress: '',
    setPublicAddress: () => {},
    nonce: 0,
    authToken: '',
    setNonce: () => {},
    setAuthToken: () => {},
    removeAuthToken: () => {},
    logout: () => {},
}

export const AuthContext = createContext<IAuthContext>(initialAuthState)

function AuthProvider({ children }: any) {
    const [isLoading, setIsLoading] = useState(initialAuthState.isLoading)
    const [publicAddress, setPublicAddress] = useState(
        initialAuthState.publicAddress
    )
    const [nonce, setNonce] = useState(initialAuthState.nonce)

    const [authToken, setAuthToken, removeAuthToken] = useReactiveStorage('authToken', initialAuthState.authToken)

    const logout = useCallback(() => {
         removeAuthToken()
         window.location.reload()
    }, [])

    const contextState = useMemo(() => ({
        isLoading,
        setIsLoading,
        publicAddress,
        setPublicAddress,
        nonce,
        setNonce,
        authToken: authToken as string,
        setAuthToken,
        removeAuthToken,
        logout,
    }), [isLoading, publicAddress, nonce, authToken])

    return <AuthContext.Provider value={contextState}>{children}</AuthContext.Provider>
}

export default AuthProvider