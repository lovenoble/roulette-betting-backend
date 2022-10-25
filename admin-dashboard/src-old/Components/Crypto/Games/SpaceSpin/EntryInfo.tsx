import { useMemo } from 'react'
import styled from 'styled-components'
import numeral from 'numeral'
import { utils } from 'ethers'

const SEntryInfo = styled.div`
    padding: 8px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    margin: 16px;
    > h4 {
        margin: 0px;
        text-align: center;
    }
`

const SEntryWrapper = styled.div`
    display: flex;
    > div {
        display: flex;
        flex-direction: column;
        &:first-child {
            align-items: flex-end;
            margin-right: 8px;
            font-weight: bold;
        }
    }
`

interface IEntryInfo {
    addr: string
    amount: string
    color: string
    winAmount: string
    isSettled: boolean
    result: any
}

function EntryInfo({
    addr = '',
    amount = '',
    color = '',
    winAmount = '',
    result = 0,
    isSettled = false,
}: IEntryInfo) {
    const displayResult = useMemo(() => {
        if (isSettled) {
            return Number(utils.formatUnits(result, 0)) ? 'Win' : 'Game Over'
        }

        return 'Pending...'
    }, [result, isSettled])

    return (
        <SEntryInfo>
            <h4>-Entry-</h4>
            <SEntryWrapper>
                <div>
                    <div>Address:</div>
                    <div>Entry Amount:</div>
                    <div>Win Amount:</div>
                    <div>Color:</div>
                    <div>Result:</div>
                </div>
                <div>
                    <div>{addr}</div>
                    <div>{numeral(amount).format('0,0.00')}</div>
                    <div>{numeral(winAmount).format('0,0.00')}</div>
                    <div>{color}</div>
                    <div>{displayResult}</div>
                </div>
            </SEntryWrapper>
        </SEntryInfo>
    )
}

export default EntryInfo