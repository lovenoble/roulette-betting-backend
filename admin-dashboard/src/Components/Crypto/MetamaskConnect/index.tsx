import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
// import { useEthers } from '@usedapp/core'
// const { account, deactivate } = useEthers()

// Components
import usePear from '../../../hooks/usePear'
import useAuth from '../../../hooks/useAuth'

const SMetamaskConnect = styled.div``

function MetamaskConnect() {
    const navigate = useNavigate()
    const { provider, pearEth } = usePear()
    const {
        setAuthToken,
        publicAddress,
        setPublicAddress,
        logout,
    } = useAuth()

    const handleConnectWallet = useCallback(async () => {
        try {
            const [authToken, publicAddress] = await pearEth.authenticate()
            setAuthToken(authToken)
            setPublicAddress(publicAddress)
            navigate('/chat')
        } catch(err) {
            // @NOTE: handle error
            console.error(err)
        }
    }, [])

    const handleDisconnectWallet = useCallback(() => {
        logout()
    }, [])

    return (
        <SMetamaskConnect>
            <h4>({publicAddress})</h4>
            {!publicAddress ? (
                <button onClick={handleConnectWallet}>Connect Wallet</button>
            ) : (
                <button onClick={handleDisconnectWallet}>
                    Disconnect Wallet
                </button>
            )}
        </SMetamaskConnect>
    )
}

export default MetamaskConnect