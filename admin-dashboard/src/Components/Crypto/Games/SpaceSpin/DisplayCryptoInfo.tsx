import { useMemo } from 'react'
import styled from 'styled-components'
import numeral from 'numeral'

const SDisplayCryptoInfo = styled.div`
    padding: 12px;
    border: 1px solid rgba(0, 0, 0, 0.12);
`

function DisplayCryptoInfo({
    publicAddress = '',
    ethBalance = '',
    pearBalance = '',
    queueBalance = '',
    prizeBalance = '',
    totalSupply = '',
    claimPrize = () => {},
}) {
    const displayAddr = useMemo(() => {
        if (!publicAddress) return ''

        return publicAddress.substring(0, 11)
    }, [publicAddress])

    return (
        <SDisplayCryptoInfo>
            <div>
                <span>Public Key:</span> {displayAddr}
            </div>
            <div>
                <span>Eth Balance:</span> {numeral(ethBalance).format('0,0.00')}
            </div>
            <div>
                <span>Pear Balance:</span>{' '}
                {numeral(pearBalance).format('0,0.00')}
            </div>
            <div>
                <span>Total Supply:</span>
                {numeral(totalSupply).format('0,0.00')}
            </div>
            <div>
                <span>Queue Balance:</span>
                {numeral(queueBalance).format('0,0.00')}
            </div>
            <div>
                <span>Prize Balance:</span>
                {numeral(prizeBalance).format('0,0.00')}
            </div>
            <div style={{ display: 'flex' }}>
                <button style={{ width: '100%' }} onClick={claimPrize}>Claim Prize</button>
            </div>
        </SDisplayCryptoInfo>
    )
}

export default DisplayCryptoInfo