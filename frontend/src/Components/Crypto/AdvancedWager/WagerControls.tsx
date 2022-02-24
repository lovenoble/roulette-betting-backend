import { useMemo } from 'react'
import styled from 'styled-components'

// Components
import SliderInput from './SliderInput'
const SWagerControls = styled.div`
    width: 440px;
    display: flex;
    flex-direction: column;
    .available-fare {
        color: #ffc24d;
        padding-right: 12px;
        font-size: 12px;
    }
    .bottom-box {
        flex: 1;
        padding: 12px;
        box-sizing: border-box;
    }
    .add-bet {
        margin-bottom: 12px;
        width: 92%;
        margin-right: auto;
        margin-left: auto;
        border: 2px solid #ffc24d;
        border-radius: 4px;
        background: transparent;
        color: #ffc24d;
        text-transform: uppercase;
        font-weight: bold;
        height: 42px;
        margin-top: 12px;
    }
    .place-bets {
        width: 100%;
        border: 2px solid #b5179e;
        border-radius: 4px;
        background: transparent;
        color: #b5179e;
        text-transform: uppercase;
        font-weight: bold;
        height: 42px;
        margin-top: 12px;
    }
    .total-wager-wrapper {
        display: flex;
        justify-content: space-between;
        color: #b5179e;
        font-weight: bold;
        .total-wager-title {
        }
        .total-wager-value {
        }
    }
`

const SInputBox = styled.div<{ isDisabled: any }>`
    position: relative;
    flex: 2;
    border: 2px solid #ffc24d;
    border-radius: 4px;
    min-height: 100px;
    margin: 8px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    ${({ isDisabled }) => isDisabled && 'filter: grayscale(1) blur(2px);'}
`

const SDisabledOverlay = styled.div`
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 99;
`

function WagerControls({
    amount,
    setAmount,
    addBet,
    totalWagered,
    selection2XDisabled,
    selectedTab,
    placeBets,
}: {
    amount: number
    setAmount: any
    addBet: any
    totalWagered: string
    selection2XDisabled: boolean
    selectedTab: string
    placeBets: any
}) {
    const isDisabled = useMemo(() => {
        if (selectedTab === '2X' && selection2XDisabled) {
            return true
        }
    }, [selectedTab, selection2XDisabled])

    return (
        <SWagerControls>
            <SInputBox isDisabled={isDisabled}>
                {isDisabled && <SDisabledOverlay />}
                <SliderInput amount={amount} setAmount={setAmount} />
                <span className='available-fare'>Available Fare: X</span>
                <button className="add-bet" disabled={isDisabled} onClick={addBet}>
                    Add
                </button>
            </SInputBox>
            <div className="bottom-box">
                <div className="total-wager-wrapper">
                    <span className="total-wager-title">Total Wagers:</span>
                    <span className="total-wager-value">{totalWagered}</span>
                </div>
                <button onClick={placeBets} className="place-bets">Place Bets</button>
            </div>
        </SWagerControls>
    )
}

export default WagerControls