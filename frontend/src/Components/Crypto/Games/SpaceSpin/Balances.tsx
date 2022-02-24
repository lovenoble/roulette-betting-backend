import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import numeral from 'numeral'
import { usePrevious } from 'react-use'
import { utils } from 'ethers'

// Libraries
import { shortenAddress } from '../../../../lib/pears/utils'

// Components
import Panel from '../../../UI/Panel'
import DepositPear from './DepositPear'
import WithdrawPear from './WithdrawPear'
import Loading from './Loading'

import useAuth from '../../../../hooks/useAuth'

const SPanel = styled(Panel)`
    width: 250px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 12px;
    padding-bottom: 12px;
    position: relative;
    .your-wallet {
        font-weight: 500;
        color: rgba(255, 255, 255, 0.7);
        padding: 4px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        margin-bottom: 8px;
    }
`

const SBalances = styled.div`
    position: fixed;
    right: 24px;
    top: 18px;
    z-index: 150;
`

const SColumnWrapper = styled.div`
    display: flex;
    width: 100%;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.75);
`
const SLeftColumn = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-end;
    padding-right: 8px;
    > div {
        margin-bottom: 6px;
    }
`
const SRightColumn = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    padding-right: 24px;
    align-items: flex-end;
    > div {
        margin-bottom: 6px;
    }
`


function Balances({ wallet, pearSupply, publicAddress, pearTokenContract, pearGameContract, provider, colorGame, state }: any) {
    const [isLoading, setIsLoading] = useState(false)
    const [loadingText, setLoadingText] = useState('')
    const previousPrizeBalance = usePrevious(wallet.prizeBalance)
    const previousDepositBalance = usePrevious(wallet.depositBalance)
    const [myPearTake, setMyPearTake] = useState('')
    const { authToken } = useAuth()

    useEffect(() => {
        if (pearGameContract) {
            pearGameContract.on(
                'RandomNumberFetched',
                (
                    roundId: any,
                    randomness: any,
                    requestId: any,
                    randomNum: any
                ) => {
                    console.log(utils.formatUnits(roundId, 0))
                    console.log(utils.formatUnits(randomness))
                    console.log(utils.formatUnits(requestId))
                    console.log(utils.formatUnits(randomNum, 18))
                }
            )
        }
    }, [pearGameContract])

    useEffect(() => {
        if (!publicAddress) return
        if (previousPrizeBalance !== wallet.prizeBalance) {
            setIsLoading(false)
            setLoadingText('')
        }
        if (previousDepositBalance !== wallet.depositBalance) {
            setIsLoading(false)
            setLoadingText('')
        }

        if (pearTokenContract && publicAddress) {
            pearTokenContract
                .pearTake()
                .then((val: any) => {
                    console.log(utils.formatUnits(val))
                    setMyPearTake(utils.formatUnits(val))
                })
                .catch((err: any) => {
                    console.error(err)
                })
        }
    }, [
        publicAddress,
        pearTokenContract,
        previousPrizeBalance,
        wallet.prizeBalance,
        wallet.depositBalance,
        previousDepositBalance,
    ])

    const claimPrize = useCallback(async () => {
        try {
            setLoadingText('')
            if (Number(wallet.prizeBalance) === 0)
                return alert('No prize balance to claim')
            setIsLoading(true)

            await pearTokenContract.claimPrize(1)

            setLoadingText('Prize claim! Updating realtime state...')
        } catch (err: any) {
            setIsLoading(false)
            if (err.data) {
                alert(err.data.message)
            } else {
                console.error(err)
            }
        }
    }, [pearTokenContract, wallet.prizeBalance])

    const withdrawFromEscrow = useCallback(async () => {
        try {
            setLoadingText('')
            if (Number(wallet.depositBalance) === 0) return alert('Nothing to withdrawal')
            setIsLoading(true)

            await pearTokenContract.withdrawFromEscrow()

            setLoadingText('Withdraw successful! Updating realtime state...')
        } catch (err: any) {
            throw new Error(err)
        }
    }, [pearTokenContract, wallet.depositBalance])

        const startRound = useCallback(() => {
            colorGame.room.send('round-started', !state.roundStarted)
        }, [colorGame, state])

        const stopRound = useCallback(() => {
            colorGame.room.send('round-started', false)
        }, [colorGame])

    return (
        <SBalances>
            <SPanel>
                <div className="your-wallet">Your Wallet</div>
                <SColumnWrapper>
                    <SLeftColumn>
                        <div>Public Address</div>
                        <div>Total Supply:</div>
                        <div>Eth Balance:</div>
                        <div>Pear Balance:</div>
                        <div>Deposit Balance:</div>
                        <div>Queue Balance:</div>
                        <div>Prize Balance:</div>
                        <div>Pear Take:</div>
                    </SLeftColumn>
                    <SRightColumn>
                        <div>{shortenAddress(publicAddress)}</div>
                        <div>{numeral(pearSupply).format('0,0.00')}</div>
                        <div>{numeral(wallet.ethBalance).format('0,0.00')}</div>
                        <div>
                            {numeral(wallet.pearBalance).format('0,0.00')}
                        </div>
                        <div>
                            {numeral(wallet.depositBalance).format('0,0.00')}
                        </div>
                        <div>
                            {numeral(wallet.queueBalance).format('0,0.00')}
                        </div>
                        <div>
                            {numeral(wallet.prizeBalance).format('0,0.00')}
                        </div>
                        <div>
                            {numeral(myPearTake).format('0,0.00')}
                        </div>
                    </SRightColumn>
                </SColumnWrapper>
                {/* <button onClick={claimPrize}>Claim Prize</button> */}
                <DepositPear
                    publicAddress={publicAddress}
                    pearTokenContract={pearTokenContract}
                    pearBalance={wallet.pearBalance}
                    depositBalance={wallet.depositBalance}
                    provider={provider}
                />
                <WithdrawPear
                    publicAddress={publicAddress}
                    pearTokenContract={pearTokenContract}
                    pearBalance={wallet.pearBalance}
                    depositBalance={wallet.depositBalance}
                    provider={provider}
                />
                <button onClick={startRound} style={{ marginRight: 24 }}>
                    Start Wheel
                </button>
                <button onClick={stopRound} style={{ marginRight: 24 }}>
                    Stop Wheel
                </button>
                <button
                    onClick={() => {
                        pearGameContract
                            ?.runRandomBatchSettle()
                            .then((e: any) => console.log(e))
                            .catch(console.log)
                    }}
                >
                    Run Settle
                </button>
                {/* <button onClick={withdrawFromEscrow}>Withdrawal</button> */}
                {/* <button onClick={withdrawFromEscrow}>Withdrawal</button> */}
                {/* {publicAddress ===
                    '0x668c2847f5b51cC716A8fb5c78333719F05A0A76' && (
                    <button
                        onClick={() => {
                            pearGameContract.getRandomNumber()
                        }}
                    >
                        Run Random
                    </button>
                )} */}
                {isLoading && <Loading text={loadingText} />}
            </SPanel>
        </SBalances>
    )
}

export default Balances