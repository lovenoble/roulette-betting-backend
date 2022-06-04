import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from 'react-use'
import { utils } from 'ethers'

import { createLog } from '../../../lib/pears/utils'
import useAuth from '../../../hooks/useAuth'
import usePear from '../../../hooks/usePear'
import useRealtime from '../../../hooks/useRealtime'
import useReactiveStorage from '../../../hooks/useReactiveStorage'

const LOG_PATH = '[Core/NetworkEventListener]:'
const [logInfo, logError] = createLog(LOG_PATH)

// Component that mounts and handles all metamask events
// Mounted globally in App.tsx
function MetamaskEventListener() {
    const navigate = useNavigate()
    const [guestLocalStorage] = useReactiveStorage('guestUsername', '')
    const { authToken, setPublicAddress, removeAuthToken } = useAuth()
    const { pearEth } = usePear()
    const { realtime, state } = useRealtime()

    const handleInvalidAuthToken = useCallback(() => {
            setPublicAddress('')
            removeAuthToken()
            navigate('/connect-wallet')
            realtime?.leaveAllConnectedRooms()
    }, [])

    const verifyToken = useCallback(async (token) => {
        try {
            logInfo('Verifying auth token...')
            if (!window.ethereum) return
            const [ethAddress] = await pearEth.getSelectedAddress() || []

            // User disconnected their wallet but have an existing token
            // Clear all existing state from user
            if (!ethAddress) {
                throw new Error('Metamask is probably not connected. Reconnect and try again.')
            }

            const selectedPublicAddress = utils.getAddress(ethAddress)

            const authPublicAddress = await pearEth.verifyToken(token)

            if (authPublicAddress === selectedPublicAddress) {
                logInfo('Auth token verified!')
                // Token was correctly verified. Set publicAddress on state and join match making lobby
                setPublicAddress(authPublicAddress)
                // await realtime?.joinLobbyRoom()
            } else {
                logError('Token address and public address do not match')
                throw new Error('[Core/NetworkEventListener]: Token address and public address do not match')
            }
        } catch (err) {
            logError(err)
            // @NOTE: Need to make function that handles remove all Player specific data if token is invalid
            handleInvalidAuthToken()
        }
    }, [])


    // Verify token with a debounce to ensure it isn't ran multiple times while verifying
    // useDebounce(() => {
    //     if (authToken) {
    //         verifyToken(authToken)
    //     }
    // }, 200, [authToken])

    // useEffect(() => {
    //     if (!authToken && !guestLocalStorage) {
    //         removeAuthToken()
    //         navigate('/connect-wallet')
    //     }
    // }, [authToken, navigate, removeAuthToken, guestLocalStorage])

    return null
}

export default MetamaskEventListener