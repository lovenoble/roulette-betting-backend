import styled from 'styled-components'
import numeral from 'numeral'

const SBetsPreview = styled.div`
    flex: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    .bet-preview-title {
        color: #ffc24d;
    }
    .bets-container {
        height: 140px;
        display: flex;
        flex-wrap: wrap;
        overflow-y: scroll;
        &::-webkit-scrollbar {
            display: none;
        }
    }
`

const SBet = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border: 1px solid white;
    margin: 12px;
    box-sizing: border-box;
`

const S2XBet = styled.div<{ isOdd: boolean }>`
    height: 88px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px;
    margin: 12px;
    border: 1px solid #ffc24d;
    color: #37474f;
    box-shadow: rgb(0 0 0 / 20%) 0px 2px 1px -1px,
        rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 1px 3px 0px;
    border-radius: 4px;
    background: #ffc24d;
    text-transform: uppercase;
    position: relative;
    .bet-selection {
        height: 60px;
        width: 60px;
        background: ${({ isOdd }) => (isOdd ? '#f72585' : '#4cc9f0')};
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
        font-weight: bold;
    }
    .bet-amount {
        font-weight: bold;
        font-size: 12px;
    }
    .bet-close-btn {
        position: absolute;
        right: 4px;
        top: 0px;
        color: white;
        font-weight: bold;
        cursor: pointer;
        transition: .15s ease-in-out all;
        cursor: pointer;
        &:hover {
            transform: scale(1.2);
        }
    }
`

const S10XBet = styled.div`
    height: 88px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px;
    margin: 12px;
    border: 1px solid #ffc24d;
    color: #37474f;
    box-shadow: rgb(0 0 0 / 20%) 0px 2px 1px -1px,
        rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 1px 3px 0px;
    border-radius: 4px;
    background: #ffc24d;
    text-transform: uppercase;
    position: relative;
    .bet-selection {
        height: 60px;
        width: 60px;
        background: #f4511e;
        border-radius: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
        font-weight: bold;
        color: white;
        .bet-game-mode {
            font-size: 10px;
        }
        .bet-picked-number {
        }
    }
    .bet-amount {
        font-weight: bold;
        font-size: 12px;
    }
    .bet-close-btn {
        position: absolute;
        right: 4px;
        top: 0px;
        color: white;
        font-weight: bold;
        cursor: pointer;
        transition: 0.15s ease-in-out all;
        cursor: pointer;
        &:hover {
            transform: scale(1.2);
        }
    }
`

const S100XBet = styled.div`
    height: 88px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px;
    margin: 12px;
    border: 1px solid #ffc24d;
    color: #37474f;
    box-shadow: rgb(0 0 0 / 20%) 0px 2px 1px -1px,
        rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 1px 3px 0px;
    border-radius: 4px;
    background: #ffc24d;
    text-transform: uppercase;
    position: relative;
    .bet-selection {
        height: 60px;
        width: 60px;
        background: #311b92;
        border-radius: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
        font-weight: bold;
        color: white;
        .bet-game-mode {
            font-size: 10px;
        }
        .bet-picked-number {
        }
    }
    .bet-amount {
        font-weight: bold;
        font-size: 12px;
    }
    .bet-close-btn {
        position: absolute;
        right: 4px;
        top: 0px;
        color: white;
        font-weight: bold;
        cursor: pointer;
        transition: 0.15s ease-in-out all;
        cursor: pointer;
        &:hover {
            transform: scale(1.2);
        }
    }
`

function Bet({ bet, removeBet }: { bet: any, removeBet: any }) {
    if (bet.type === '2X') {
        return (
            <S2XBet isOdd={bet.pickedNumber === '1'}>
                <div className="bet-selection">
                    {bet.pickedNumber === '1' ? 'ODD' : 'EVEN'}
                </div>
                <div className="bet-amount">
                    {numeral(bet.amount).format('0,0')} FARE
                </div>
                <div className="bet-close-btn" onClick={removeBet}>
                    X
                </div>
            </S2XBet>
        )
    }

    if (bet.type === '10X') {
        return (
            <S10XBet>
                <div className="bet-selection">
                    <div className="bet-picked-number">{bet.pickedNumber}</div>
                    <div className="bet-game-mode">(10X)</div>
                </div>
                <div className="bet-amount">
                    {numeral(bet.amount).format('0,0')} FARE
                </div>
                <div className="bet-close-btn" onClick={removeBet}>
                    X
                </div>
            </S10XBet>
        )
    }

    if (bet.type === '100X') {
        return (
            <S100XBet>
                <div className="bet-selection">
                    <div className="bet-picked-number">{bet.pickedNumber}</div>
                    <div className="bet-game-mode">(100X)</div>
                </div>
                <div className="bet-amount">
                    {numeral(bet.amount).format('0,0')} FARE
                </div>
                <div className="bet-close-btn" onClick={removeBet}>
                    X
                </div>
            </S100XBet>
        )
    }

    return (
        <SBet>
            <div>{numeral(bet.amount).format('0,0')}</div>
            <div>{bet.pickedNumber}</div>
            <button onClick={removeBet}>Remove</button>
        </SBet>
    )
}

function BetsPreview({ bets, removeBet }: { bets: any[]; removeBet: any }) {
    return (
        <SBetsPreview>
            <div className="bet-preview-title">Preview Bets</div>
            <div className="bets-container">
                {bets.map((bet: any, idx: number) => (
                    <Bet key={idx} bet={bet} removeBet={() => removeBet(idx)} />
                ))}
                {bets.length === 0 && (
                    <div style={{ marginTop: 32 }}>No current bets.</div>
                )}
            </div>
        </SBetsPreview>
    )
}

export default BetsPreview