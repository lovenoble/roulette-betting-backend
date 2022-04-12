import { useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { utils } from 'ethers'

import useAuth from '../../hooks/useAuth'
import usePear from '../../hooks/usePear'

const SWallet = styled.div`
    position: fixed;
    top: 0px;
    left: 0px;
    height: 100vh;
    width: 100vw;
    background: rgba(0, 0, 0, .8);
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    > button {
        margin-bottom: 16px;
    }
`

function Wallet({
    close = () => {}
}) {
    const { publicAddress, logout } = useAuth()
    const { provider } = usePear()

    const fetchBalances = useCallback(async () => {
        try {
            const ethBalance: any = await provider?.getBalance(publicAddress)
            // setEthBalance(utils.formatUnits(ethBalance))
        } catch (err) {
            console.error(err)
        }
    }, [publicAddress, provider])

    // @NOTE: Implement watcher that checks for changes in the balance on change
    // This should be realtime
    useEffect(() => {
        fetchBalances()
    }, [fetchBalances])

    return <SWallet>
        <button onClick={close}>Close</button>
        <button onClick={logout}>Logout</button>
        <div>Address: {publicAddress}</div>
        <div>ETH Balance</div>
    </SWallet>
}

export default Wallet