import { useEffect } from 'react'
import styled from 'styled-components'

import usePear from '../../hooks/usePear'

const SWallet = styled.div``

function Wallet() {
    const {
        state: { myWallet },
    } = usePear()
    useEffect(() => {}, [])

    return (
        <SWallet>
            <div>ETH Balance: {myWallet.ethBalance}</div>
            <div>PEAR Balance: {myWallet.pearBalance}</div>
            <div>Queue Balance: {myWallet.queueBalance}</div>
            <div>Prize Balance: {myWallet.prizeBalance}</div>
        </SWallet>
    )
}

export default Wallet