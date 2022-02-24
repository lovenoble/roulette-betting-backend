import { useEffect, useMemo, useCallback, useState } from 'react'
import styled from 'styled-components'
import numeral from 'numeral'
import { usePrevious } from 'react-use'
import { utils } from 'ethers'

// Components
import GameModeTabs from './GameModeTabs'
import SelectColor2X from './SelectColor2X'
import SelectColor10X from './SelectColor10X'
import SelectColor100X from './SelectColor100X'
import BetsPreview from './BetsPreview'
import WagerControls from './WagerControls'

const abiCoder = new utils.AbiCoder()

const SAdvancedWager = styled.div`
    position: fixed;
    top: 24px;
    left: 100px;
    width: 78vw;
    background: pink;
    min-height: 250px;
    border: 3px solid #3f37c9;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
`

const SCenterWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

interface IAdvancedWager {
    publicAddress: string
    pearTokenContract: any
    pearGameContract: any
    depositBalance: string
    queueBalance: string
    provider: any
}

function AdvancedWager({
    publicAddress,
    pearTokenContract,
    pearGameContract,
    depositBalance,
    provider,
    queueBalance
}: IAdvancedWager) {
    const minFareBet = 5000
    const [amount, setAmount] = useState(minFareBet)
    const [selectedTab, setSelectedTab] = useState('2X')
    const [selection2X, setSelection2X] = useState('')
    const [selection10X, setSelection10X] = useState('')
    const [selection100X, setSelection100X] = useState('')
    const [bets, setBets] = useState<any>([])

    const [isSending, setIsSending] = useState(false)
    const [loadingText, setLoadingText] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const previousQueueBalance = usePrevious(queueBalance)


    // Memos
    const selection2XDisabled = useMemo(() => {
        let isDisabled = false

        bets.forEach((bet: any) => {
            if (bet.type === '2X') {
                isDisabled = true
            }
        })

        return isDisabled
    }, [bets])

    const totalWagered = useMemo(() => {
        let incrementer = 0
        bets.forEach((bet: any) => incrementer += bet.amount)
        return numeral(incrementer).format('0,0.00')
    }, [bets])


    // Callbacks
    const addBet = useCallback(() => {
        if (selectedTab === '2X') {
            if (!selection2X) {
                return alert('Please select odd or even...')
            }

            setBets((b: any) => [
                ...b,
                {
                    amount,
                    pickedNumber: selection2X,
                    type: '2X'
                },
            ])

            setAmount(minFareBet)
            setSelection2X('')
        } else if (selectedTab === '10X') {
            if (!selection10X) {
                return alert('Please select a number...')
            }

            setBets((b: any) => [
                ...b,
                {
                    amount,
                    pickedNumber: selection10X,
                    type: '10X'
                },
            ])

            setAmount(minFareBet)
            setSelection10X('')
        } else if (selectedTab === '100X') {
            if (!selection100X) {
                return alert('Please select a number...')
            }

            setBets((b: any) => [
                ...b,
                {
                    amount,
                    pickedNumber: selection100X,
                    type: '100X'
                },
            ])

            setAmount(minFareBet)
            setSelection100X('')

        }
    }, [amount, selection2X, selection10X, selection100X, selectedTab])

    const removeBet = useCallback((deleteIdx: number) => {
        setBets(bets.filter((bet: any, index: number) => index !== deleteIdx))
    }, [bets])

    useEffect(() => {
        if (pearGameContract) {
            setTimeout(() => {
                ;(async () => {
                    try {
                        let currentRoundId = '0'
                        const data = await pearGameContract?.getBatchEntries(
                            '0'
                        )

                        data.forEach(async (dat: any) => {
                            console.log(pearGameContract)
                            const wagers =
                                await pearGameContract?.getBatchWagerEntries(
                                    utils.formatUnits(dat.wagerId, 0)
                                )
                            console.log('-----------------------------------')
                            console.log(wagers)
                            console.log('-----------------------------------')
                        })


                        console.log('-----------------------------------')
                        console.log('Current round batch map')
                        console.log('Data', data)
                        // console.log('Wagers', wagers)
                        console.log('-----------------------------------')
                    } catch (err) {
                        console.error(err)
                    }
                })()
            }, 5000)
        }
    }, [pearGameContract, depositBalance])

    const placeBets = useCallback(
        async (ev) => {
            ev.preventDefault()
            try {
                setErrorMsg('')
                setLoadingText('')
                if (!bets.length) return setErrorMsg('Please add bets before placing...')

                // if (Number(selectedAmount) > Number(depositBalance))
                //     return setErrorMsg(
                //         'Not enough in deposit balance. Please add more funds.'
                //     )

                // if (Number(selectedAmount) > 1000000)
                    // return setErrorMsg('Entry amount exceeds the limit')
                // if (Number(selectedAmount) < 100)
                    // return setErrorMsg('Entry amount is less than the limit')

                setIsSending(true)

                // const safeAmount = utils.parseUnits(selectedAmount, 18)
                // const safeColor = utils.parseUnits(selectedColor, 0)
                // const safeGameMode = utils.parseUnits(selectedGameMode, 0)


                const formattedBets = bets.map((bet: any) => {
                    let _solidityBet: any = {}
                    const _solidityBetArr: any[] = []

                    let formattedNumber = (
                        Number(bet.pickedNumber) - 1
                    ).toString()

                    if (bet.type === '2X') {
                        _solidityBet.gameMode = utils.parseUnits('0', 0)
                        formattedNumber = bet.pickedNumber
                    } else if (bet.type === '10X') {
                        _solidityBet.gameMode = utils.parseUnits('1', 0)
                        formattedNumber = (Number(bet.pickedNumber) * 10).toString()
                    } else if (bet.type === '100X') {
                        _solidityBet.gameMode = utils.parseUnits('2', 0)
                    } else {
                        throw new Error('Bet array contains invalid gameMode.')
                    }

                    _solidityBet.amount = utils.parseUnits(
                        bet.amount.toString(),
                        18
                    )
                    _solidityBet.pickedNumber = utils.parseUnits(
                        formattedNumber,
                        0
                    )

                    _solidityBetArr.push(
                        _solidityBet.amount,
                        _solidityBet.gameMode,
                        _solidityBet.pickedNumber,
                        utils.parseUnits('0', 0),
                        utils.parseUnits('0', 0)
                    )
                    console.log(bet)
                    const encoding = abiCoder.encode(
                        // [
                        //     'uint256',
                        //     'uint8',
                        //     'uint256',
                        //     'uint256',
                        //     'uint256',
                        // ],
                        // [
                        //     Number(bet.amount),
                        //     Number(_solidityBet.gameMode),
                        //     Number(bet.pickedNumber),
                        //     0,
                        //     0
                        // ]
                        [
                            'tuple(uint256 amount, uint8 gameMode, uint256 pickedNumber, uint256 winAmount, uint256 result)',
                        ],
                        [{
                            // @ts-ignore
                            amount: _solidityBet.amount,
                            gameMode: _solidityBet.gameMode,
                            pickedNumber: _solidityBet.pickedNumber,
                            winAmount: '0',
                            result: '0',
                        }]
                    )


                    return {
                        // @ts-ignore
                        amount: _solidityBet.amount,
                        gameMode: _solidityBet.gameMode,
                        pickedNumber: _solidityBet.pickedNumber,
                        winAmount: '0',
                        result: '0',
                    }

                    // return encoding
                })
                console.log(formattedBets)
                console.log(pearGameContract)
                console.log('---------------------')
                console.log('Attempting to submit placeBets')
                console.log('FORMATTED BETS:', formattedBets)
                const entryResp = await pearGameContract.placeBets(formattedBets)
                // const entryResp = await pearGameContract.placeBets([])
                await provider.waitForTransaction(entryResp.hash)
                console.log('SUCCESS!!!!!!!!!!!')
                console.log('---------------------')

                // const entryResp = await pearGameContract.submitEntry(
                //     safeAmount,
                //     safeColor,
                //     safeGameMode
                // )

                // await provider.waitForTransaction(entryResp.hash)

                setLoadingText('Entry Successful. Updating realtime state...')
            } catch (err: any) {
                setIsSending(false)
                console.log(err)
                if (err.data) {
                    alert(err.data.message)
                }
            }
        },
        [bets, provider, pearGameContract, depositBalance]
    )


    // Effects
    // useEffect(() => {
    //     if (previousQueueBalance !== queueBalance) {
    //         setIsSending(false)
    //         setAmount(minFareBet)
    //     }
    // }, [previousQueueBalance, queueBalance])



    return (
        <SAdvancedWager>
            <GameModeTabs
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
            />
            <SCenterWrapper>
                { selectedTab === '2X' && <SelectColor2X
                    selection2X={selection2X}
                    setSelection2X={setSelection2X}
                    selection2XDisabled={selection2XDisabled}
                /> }
                { selectedTab === '10X' && <SelectColor10X
                    selection10X={selection10X}
                    setSelection10X={setSelection10X}
                    bets={bets}
                /> }
                { selectedTab === '100X' && <SelectColor100X
                    selection100X={selection100X}
                    setSelection100X={setSelection100X}
                    bets={bets}
                /> }
                <BetsPreview bets={bets} removeBet={removeBet} />
            </SCenterWrapper>
            <WagerControls
                amount={amount}
                setAmount={setAmount}
                addBet={addBet}
                totalWagered={totalWagered}
                selection2XDisabled={selection2XDisabled}
                placeBets={placeBets}
                selectedTab={selectedTab}
            />
        </SAdvancedWager>
    )
}

export default AdvancedWager