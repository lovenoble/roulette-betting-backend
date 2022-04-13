import { useCallback, useState, useEffect } from 'react'
import styled from 'styled-components'
import { AnimatePresence } from 'framer-motion'
import { utils } from 'ethers'
import { usePrevious } from 'react-use'
import numeral from 'numeral'

// Components
import Panel from '../../../UI/Panel'
import ColorPicker from '../../../UI/ColorPicker'
import PearInput from '../../../UI/PearInput'
import PearBtn from '../../../UI/PearBtn'
import Loading from './Loading'

// Assets
import transactionIcon from '../../../../assets/games/transaction.svg'

const SSubmitEntry = styled.div`
    position: absolute;
    z-index: 150;
    top: 24px;
`

const SErrorMsg = styled.div`
    font-size: 10px;
    color: #F44336;
    text-align: center;
    width: 100%;
    margin-top: 8px;
    position: absolute;
    bottom: 60px;
`

const SPearBtn = styled(PearBtn)`
    width: 160px;
    height: 36px;
    font-size: 14px;
    border-radius: 4px;
    padding: 0px;
    background: rgba(4, 65, 84, 0.8);
    margin-top: 30px;
    > span {
        color: rgba(255, 255, 255, 0.75);
    }
    > img {
        height: 22px;
        opacity: .75;
    }
`

const SPearInput = styled(PearInput)`
    width: 100%;
    padding: 12px 18px;
    box-sizing: border-box;
    border-radius: 0px;
    background: rgba(0, 0, 0, 0.12);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.66);
    font-size: 14px;
    &::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
    }
    &::-webkit-outer-spin-button {
        -webkit-appearance: none !important;
    }
    &::placeholder {
        color: rgba(255, 255, 255, 0.2);
    }
`

export const SPanel = styled(Panel)`
    width: 300px;
    border: none;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    position: relative;
    background: linear-gradient(
        0deg,
        rgba(41, 39, 85, 0.35) 0%,
        rgba(4, 65, 84, 0.8) 70%,
        rgba(0, 131, 143, 0.6) 100%
    );
    box-shadow: 0px 0px 100px 8px rgba(41, 39, 85, 0.38);
    display: flex;
    align-items: center;
    padding-top: 16px;
    padding-bottom: 16px;
    > h2 {
        font-size: 20px;
        margin: 0px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.7);
        padding-bottom: 16px;
    }
    .deposit-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: rgba(255, 255, 255, 0.8);
        margin-top: 12px;
        margin-bottom: 12px;
        .deposit-labels {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            margin-right: 8px;
            > span {
                margin-bottom: 3px;
                &:last-child {
                    margin-bottom: 0px;
                }
            }
        }
        .deposit-amounts {
            margin-left: 8px;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            font-weight: bold;
            > span {
                margin-bottom: 3px;
                &:last-child {
                    margin-bottom: 0px;
                }
            }
        }
    }
    /* padding: 12px; */
`

interface ISubmitEntry {
    selectedAmount: string
    setSelectedAmount: any
    selectedColor: string
    queueBalance: string
    depositBalance: string
    setSelectedColor: any
    pearTokenContract: any
    pearGameContract: any
    provider: any
    selectedGameMode: string
    setSelectedGameMode: any
}

function SubmitEntry({
    selectedAmount,
    setSelectedAmount,
    selectedColor,
    setSelectedColor,
    queueBalance,
    depositBalance,
    pearTokenContract,
    pearGameContract,
    provider,
    selectedGameMode,
    setSelectedGameMode,
}: ISubmitEntry) {
    const [isSending, setIsSending] = useState(false)
    const [loadingText, setLoadingText] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const previousQueueBalance = usePrevious(queueBalance)

    useEffect(() => {
        if (previousQueueBalance !== queueBalance) {
            setIsSending(false)
            setSelectedAmount('')
        }
    }, [previousQueueBalance, queueBalance, setSelectedAmount])

    const submitEntry = useCallback(
        async (ev) => {
            ev.preventDefault()
            try {
                setErrorMsg('')
                setLoadingText('')
                if (!selectedColor) return setErrorMsg('Please select a color.')
                if (!selectedAmount)
                    return setErrorMsg('Please enter an amount.')
                if (Number(selectedAmount) > Number(depositBalance)) return setErrorMsg('Not enough in deposit balance. Please add more funds.')
                if (Number(selectedAmount) > 1000000) return setErrorMsg('Entry amount exceeds the limit')
                if (Number(selectedAmount) < 100) return setErrorMsg('Entry amount is less than the limit')

                setIsSending(true)

                const safeAmount = utils.parseUnits(selectedAmount, 18)
                const safeColor = utils.parseUnits(selectedColor, 0)
                const safeGameMode = utils.parseUnits(selectedGameMode, 0)

                const entryResp = await pearGameContract.submitEntry(
                    safeAmount,
                    safeColor,
                    safeGameMode
                )

                await provider.waitForTransaction(entryResp.hash)

                setLoadingText('Entry Successful. Updating realtime state...')
            } catch (err: any) {
                setIsSending(false)
                if (err.data) {
                    alert(err.data.message)
                }
            }
        },
        [
            selectedAmount,
            selectedColor,
            provider,
            pearGameContract,
            depositBalance,
            selectedGameMode
        ]
    )

    return (
        <SSubmitEntry>
            <SPanel>
                <h2>Submit Entry</h2>
                {/* <ColorPicker
                    selectedColor={selectedColor}
                    setSelectedColor={setSelectedColor}
                /> */}
                <div className="deposit-wrapper">
                    <div className="deposit-labels">
                        <span>Min Amount:</span>
                        <span>Max Amount:</span>
                        <span>Available:</span>
                    </div>
                    <div className="deposit-amounts">
                        <span>{numeral('100').format('0,0')} PEAR</span>
                        <span>{numeral('1000000').format('0,0')} PEAR</span>
                        <span>
                            {numeral(depositBalance).format('0,0')} PEAR
                        </span>
                    </div>
                </div>
                <select
                    value={selectedGameMode}
                    onChange={(e) => setSelectedGameMode(e.currentTarget.value)}
                >
                    <option value="0">2X</option>
                    <option value="1">10X</option>
                    <option value="2">100X</option>
                </select>
                <div>{selectedColor} - {selectedGameMode}</div>
                <SPearInput
                    placeholder="Pick number..."
                    type="number"
                    inputmode="numeric"
                    value={selectedColor}
                    onChange={(e: any) => {
                        setSelectedColor(e.currentTarget.value)
                    }}
                />
                <SPearInput
                    placeholder="Enter amount..."
                    type="number"
                    inputmode="numeric"
                    value={selectedAmount}
                    onChange={(e: any) =>
                        setSelectedAmount(e.currentTarget.value)
                    }
                />
                {errorMsg && <SErrorMsg>{errorMsg}</SErrorMsg>}
                <SPearBtn isLoading={false} onClick={submitEntry}>
                    <span>Submit Entry</span>
                    <img alt="Transaction" src={transactionIcon} />
                </SPearBtn>
                <AnimatePresence>
                    {isSending && <Loading text={loadingText} />}
                </AnimatePresence>
            </SPanel>
        </SSubmitEntry>
    )

    return (
        <SSubmitEntry>
            <SPanel>
                <h2>Submit Entry</h2>
                <ColorPicker
                    selectedColor={selectedColor}
                    setSelectedColor={setSelectedColor}
                />
                <div className="deposit-wrapper">
                    <div className="deposit-labels">
                        <span>Min Amount:</span>
                        <span>Max Amount:</span>
                        <span>Available:</span>
                    </div>
                    <div className="deposit-amounts">
                        <span>{numeral('100').format('0,0')} PEAR</span>
                        <span>{numeral('1000000').format('0,0')} PEAR</span>
                        <span>{numeral(depositBalance).format('0,0')} PEAR</span>
                    </div>
                </div>
                <SPearInput
                    placeholder="Enter amount..."
                    type="number"
                    inputmode="numeric"
                    value={selectedAmount}
                    onChange={(e: any) =>
                        setSelectedAmount(e.currentTarget.value)
                    }
                />
                { errorMsg && <SErrorMsg>{errorMsg}</SErrorMsg>}
                <SPearBtn isLoading={false} onClick={submitEntry}>
                    <span>Submit Entry</span>
                    <img alt="Transaction" src={transactionIcon} />
                </SPearBtn>
                <AnimatePresence>{isSending && <Loading text={loadingText} />}</AnimatePresence>
            </SPanel>
        </SSubmitEntry>
    )
}

export default SubmitEntry