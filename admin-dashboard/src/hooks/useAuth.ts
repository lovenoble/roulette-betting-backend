import { useContext, useMemo } from 'react'

import { AuthContext, IAuthContext } from '../contexts/AuthProvider'

function useAuth(): IAuthContext {
    const authContext = useContext(AuthContext)

    return useMemo(() => authContext, [authContext])
}

export default useAuth