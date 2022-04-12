import { useCallback, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { Contract, utils, providers } from 'ethers'
import { motion, AnimatePresence } from 'framer-motion'
import numeral from 'numeral'
import { usePrevious } from 'react-use'

// Assets
import closeIcon from './assets/close.svg'
import depositIcon from './assets/deposit.svg'

// Components
import Loading from './Loading'
import PearInput from '../../../UI/PearInput'

const SCloseBtn = styled(motion.div)`
    height: 28px;
    width: 28px;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(135, 15, 79, 0.66);
    position: absolute;
    top: 4px;
    right: 4px;
    cursor: pointer;
    > img {
        height: 12px;
    }
`

const SWithdrawBtn = styled(motion.button)`
    border: none;
    background: rgba(4, 65, 84, 0.8);
    font-weight: 500;
    font-size: 16px;
    padding-top: 12px;
    padding-bottom: 12px;
    border-top: 1px solid rgba(0, 0, 0, 0.24);
    margin-top: 18px;
    width: 66%;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0px 0px 30px 4px rgb(38 10 38 / 58%);
    > img {
        transform: rotate(90deg);
        margin-left: 8px;
        height: 20px;
    }
`

const SDepositPear = styled.div``

const SPearInput = styled(PearInput)`
    width: 100%;
    border-radius: 0px;
    box-sizing: border-box;
    padding: 24px 16px;
    background: rgba(0, 0, 0, 0.3);
    margin-top: 8px;
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

const SDepositOverlay = styled.div`
    position: fixed;
    z-index: 200;
    top: 0px;
    left: 0px;
    height: 100vh;
    width: 100vw;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`

const SDepositModal = styled.div`
    width: 300px;
    padding-bottom: 18px;
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(
        0deg,
        rgba(41, 39, 85, 0.35) 0%,
        rgba(4, 65, 84, 0.8) 70%,
        rgba(0, 131, 143, 0.6) 100%
    );
    box-shadow: 0px 0px 100px 8px rgba(41, 39, 85, 0.38);
    border-radius: 4px;
    > h3 {
        text-align: center;
        margin-bottom: 4px;
    }
    .balance-well {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        padding-top: 12px;
        padding-bottom: 12px;
        .balance-labels {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: center;
            padding-right: 4px;
            > div {
                margin-bottom: 4px;
            }
        }
        .balance-amounts {
            padding-left: 4px;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: center;
            font-weight: bold;
            > div {
                margin-bottom: 4px;
            }
        }
    }
`

interface IDepositPear {
    pearTokenContract: Contract
    provider: providers.Web3Provider
    publicAddress: string
    pearBalance: string
    depositBalance: string
}

const { REACT_APP_PEAR_TOKEN_ADDRESS } = process.env

function Portal({ children }: any) {
    return typeof document === 'object'
        ? createPortal(children, document.body)
        : null
}

const closeVariants = {
    initial: {
        scale: 1,
    },
    hover: {
        scale: 1.1,
    },
    tap: {
        scale: 0.9,
    },
}

function WithdrawPear({
    pearTokenContract,
    provider,
    publicAddress,
    pearBalance,
    depositBalance,
}: IDepositPear) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [showModal, setShowModal] = useState(false)
    const [isWaiting, setIsWaiting] = useState(false)
    const [loadingText, setLoadingText] = useState('')
    const prevDepositBalance = usePrevious(depositBalance)

    useEffect(() => {
        if (!inputRef.current) return

        if (prevDepositBalance !== depositBalance) {
            setLoadingText('')
            setIsWaiting(false)
            inputRef.current.value = ''
        }
    }, [prevDepositBalance, depositBalance, inputRef])

    const depositPear = useCallback(async () => {
        try {
            setLoadingText('')
            if (!inputRef.current) return
            if (Number(inputRef.current.value) <= 0)
                return alert('Please enter a deposit amount.')
            if (Number(inputRef.current.value) > Number(depositBalance))
                return alert(
                    `Cannot withdraw that much. Please deposit less than ${depositBalance}`
                )

            setIsWaiting(true)

            const safeAmount = utils.parseUnits(inputRef.current.value, 18)
            // const approveResp = await pearTokenContract.approve(
            //     REACT_APP_PEAR_TOKEN_ADDRESS,
            //     safeAmount
            // )

            // await provider.waitForTransaction(approveResp.hash)

            const withdrawResp = await pearTokenContract.withdrawFromEscrow(
                safeAmount
            )

            await provider.waitForTransaction(withdrawResp.hash)
            setLoadingText('Transaction successful.\n Updating state...')
        } catch (err) {
            console.error(err)
            setIsWaiting(false)
        }
    }, [pearTokenContract, provider, depositBalance])

    const toggleModal = useCallback(() => {
        setShowModal((_s) => !_s)
    }, [])

    return (
        <SDepositPear>
            <button onClick={toggleModal}>Withdraw Pear</button>
            <AnimatePresence>
                {showModal && (
                    <Portal>
                        <SDepositOverlay>
                            <SDepositModal>
                                <SCloseBtn
                                    onClick={toggleModal}
                                    variants={closeVariants}
                                    initial="initial"
                                    whileTap="tap"
                                    whileHover="hover"
                                >
                                    <img alt="Close" src={closeIcon} />
                                </SCloseBtn>
                                <h3>Withdraw</h3>
                                <div className="balance-well">
                                    <div className="balance-labels">
                                        <div>Pear Balance:</div>
                                        <div>Deposit Balance:</div>
                                    </div>
                                    <div className="balance-amounts">
                                        <div>
                                            {numeral(pearBalance).format(
                                                '0,0.00'
                                            )}
                                        </div>
                                        <div>
                                            {numeral(depositBalance).format(
                                                '0,0.00'
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <SPearInput
                                    type="number"
                                    inputMode="numeric"
                                    placeholder="Enter withdraw amount..."
                                    ref={inputRef}
                                />
                                <SWithdrawBtn
                                    onClick={depositPear}
                                    variants={closeVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    Withdraw{' '}
                                    <img alt="Deposit" src={depositIcon} />
                                </SWithdrawBtn>
                                {isWaiting && <Loading text={loadingText} />}
                            </SDepositModal>
                        </SDepositOverlay>
                    </Portal>
                )}
            </AnimatePresence>
        </SDepositPear>
    )
}

export default WithdrawPear
