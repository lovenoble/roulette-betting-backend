import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useDebounce } from 'react-use'
import { Contract, utils } from 'ethers'
import { AnimatePresence } from 'framer-motion'

// Components
import DisplayCryptoInfo from './DisplayCryptoInfo'
import SubmitTx from './SubmitTx'
import EntryInfo from './EntryInfo'

// New Components
import SubmitEntry from './SubmitEntry'
import Balances from './Balances'
import Players from './Players'
import PlayerEntry from './PlayerEntry'
import Pagination from '../../../UI/Pagination'
import { SPanel } from './SubmitEntry'
import AdvancedWager from '../../AdvancedWager'

// Libraries
import PearColorGame from '../../../../lib/pears/services/ColorGame'

// Hooks
import useAuth from '../../../../hooks/useAuth'
import usePear from '../../../../hooks/usePear'
import useReactiveStorage from '../../../../hooks/useReactiveStorage'


// Styles
const SSpaceSpin = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 268px;
    box-sizing: border-box;
`

const SEntryContainer = styled(motion.div)`
    display: flex;
    flex-wrap: wrap;
    width: 100vw;
    box-sizing: border-box;
    padding-left: 92px;
    padding-top: 48px;
`

const entryVariants = {
    initial: {
        opacity: 0.99,
    },
    animate: {
        opacity: 1,
        transition: {
            delayChildren: 1,
            staggerChildren: 0.3,
        },
    },
    exit: {
        opacity: 0.99,
    }
}

const SNoEntry = styled(motion.div)`
    position: fixed;
    left: 0;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
    padding-left: 0px;
`

const SNoEntryPanel = styled(motion.div)`
    height: 48px;
    width: 200px;
    display: flex;
    align-items: center;
    padding-left: 0px;
    justify-content: center;
    background: rgba(0, 0, 0, .48);
    font-size: 14px;
    font-weight: 400;
    position: relative;
    .dots {
        position: absolute;
    }
`

const noEntryVariants = {
    initial: {
        y: -80,
    },
    animate: {
        y: 0,
    },
    exit: {
        y: 80,
    },
}

function NoEntry() {
    const [dots, setDots] = useState<string>('.')

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (dots.length >= 4) {
                setDots('')
            } else {
                setDots(_d => _d + '.')
            }
        }, 550)

        return () => clearInterval(intervalId)
    }, [dots])

   return (
       <SNoEntry>
           <SNoEntryPanel
               variants={noEntryVariants}
               initial="initial"
               animate="animate"
               exit="exit"
           >
               <span>
                   Waiting for entries <span className="dots">{dots}</span>
               </span>
           </SNoEntryPanel>
       </SNoEntry>
   )
}

function SpaceSpin() {
    const {
        dispatch,
        actions,
        state,
        provider,
        pearEth: {
           getPearSignerContract,
           getGameSignerContract,
        },
        layoutRef,
    } = usePear()
    const { currentRoundId, myWallet, pearSupply, entries, gamePlayers } = state
    const [selectedPage, setSelectedPage] = useState('')
    const [colorGame, setColorGame] = useState<any>()
    const { publicAddress, authToken } = useAuth()
    const [selectedColor, setSelectedColor] = useState('')
    const [selectedGameMode, setSelectedGameMode] = useState('0')
    const [selectedAmount, setSelectedAmount] = useState('')
    const [pearTokenContract, setPearTokenContract] = useState<any>(null)
    const [pearGameContract, setPearGameContract] = useState<any>(null)
    const [guestLocalStorage] = useReactiveStorage('guestUsername', '')

    useEffect(() => {
        setSelectedPage((Number(currentRoundId) + 1).toString())
    }, [currentRoundId])

    useEffect(() => {
        let hasToken = authToken || guestLocalStorage
        if (!dispatch || !actions || colorGame || !hasToken)
            return
        ;(async () => {
            let _colorGame: PearColorGame | null = null
            if (!publicAddress) {
                _colorGame = new PearColorGame(publicAddress)
            } else {
                _colorGame = new PearColorGame('', guestLocalStorage)
            }

            _colorGame.defineDispatchActions(dispatch, actions)
            setColorGame(_colorGame)

            _colorGame.joinOrCreateColorGame(authToken || '', guestLocalStorage)

            const _pearTokenContract = await getPearSignerContract(provider)
            const _pearGameContract = await getGameSignerContract(provider)
            setPearTokenContract(_pearTokenContract)
            setPearGameContract(_pearGameContract)
        })()
    }, [
        guestLocalStorage,
        dispatch,
        actions,
        publicAddress,
        colorGame,
        authToken,
        getPearSignerContract,
        getGameSignerContract,
        provider,
    ])

    const jsxEntries = useMemo(() => {
        const _entries: any[] = []


        if (!selectedPage) return _entries
        const page = (Number(selectedPage) - 1).toString()
        let delay = 0
        entries.get(page)?.forEach((entry) => {
            _entries.push({
                delay,
                ...entry,
            })

            if (entry.result === '1')  {
                delay += 1
            }
        })

        return _entries
    }, [entries, selectedPage])

    useEffect(() => {
        if (entries && currentRoundId) {
            setSelectedPage((Number(currentRoundId) + 1).toString())
        }
    }, [entries, currentRoundId])

    return (
        <SSpaceSpin>
            <AdvancedWager
                 pearTokenContract={pearTokenContract}
                 pearGameContract={pearGameContract}
                 depositBalance={myWallet.depositBalance}
                 queueBalance={myWallet.queueBalance}
                 publicAddress={publicAddress}
                 provider={provider}
            />
            {/* <SubmitEntry
                selectedAmount={selectedAmount}
                setSelectedAmount={setSelectedAmount}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                pearTokenContract={pearTokenContract}
                pearGameContract={pearGameContract}
                queueBalance={myWallet.queueBalance}
                depositBalance={myWallet.depositBalance}
                provider={provider}
                selectedGameMode={selectedGameMode}
                setSelectedGameMode={setSelectedGameMode}
            /> */}
            <Balances
                wallet={myWallet}
                pearSupply={pearSupply}
                publicAddress={publicAddress}
                pearTokenContract={pearTokenContract}
                pearGameContract={pearGameContract}
                provider={provider}
                colorGame={colorGame}
                state={state}
            />
            <Pagination
                selectedPage={selectedPage}
                setSelectedPage={setSelectedPage}
                pageSize={Number(currentRoundId) + 1}
            />
            <Players layoutRef={layoutRef} players={gamePlayers} />
            {/* {publicAddress === '0x668c2847f5b51cC716A8fb5c78333719F05A0A76' && ( */}
            {/* {publicAddress && (
                <button
                    style={{
                        position: 'fixed',
                        bottom: 24,
                        zIndex: 200,
                    }}
                    onClick={() => {
                        pearGameContract
                            ?.runRandomSettle()
                            .then((e: any) => console.log(e))
                            .catch(console.log)
                    }}
                >
                    Run Settle
                </button>
            )} */}
            <AnimatePresence>
                <SEntryContainer
                    variants={entryVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    {!jsxEntries.length && <NoEntry />}
                    {jsxEntries.map((entry, idx) => {
                        return <PlayerEntry entry={entry} key={idx} />
                    })}
                </SEntryContainer>
            </AnimatePresence>
        </SSpaceSpin>
    )
}

// function SpaceSpin() {
//     const {
//         pearTokenContract,
//         pearEth,
//         provider,
//     } = usePear()
//     const { publicAddress } = useAuth()
//     const [ethBalance, setEthBalance] = useState('')
//     const [pearBalance, setPearBalance] = useState('')
//     const [prizeBalance, setPrizeBalance] = useState('')
//     const [queueBalance, setQueueBalance] = useState('')
//     const [totalSupply, setTotalSupply] = useState('')
//     const [color, setColor] = useState('')
//     const [amount, setAmount] = useState('')
//     const [playerEntries, setPlayerEntries] = useState([])
//     const [gameContract, setGameContract] = useState<Contract | null>()
//     const [totalRounds, setTotalRounds] = useState(0)
//     const [selectedRound, setSelectedRound] = useState(0)
//     const { getPearBalance, getGameSignerContract, getPearSignerContract } =
//         pearEth

//     const fetchBalances = useCallback(
//         async () => {
//             try {

//                 const _pearBalance = await getPearBalance(
//                     publicAddress,
//                     pearTokenContract
//                 )
//                 const _ethBalance: any = await provider?.getBalance(
//                     publicAddress
//                 )
//                 const _prizes: any = await pearTokenContract?.getClaimsPrize(
//                     publicAddress
//                 )

//                 const _totalSupply: any = await pearTokenContract?.totalSupply()
//                 setTotalSupply(utils.formatUnits(_totalSupply))
//                 setPrizeBalance(utils.formatUnits(_prizes.amount))
//                 setQueueBalance(utils.formatUnits(_prizes.inQueue))
//                 setEthBalance(utils.formatUnits(_ethBalance))
//                 setPearBalance(_pearBalance)
//             } catch (err) {
//                 console.error(err)
//             }
//         },
//         [provider, getPearBalance, pearTokenContract, publicAddress]
//     )

//     const asyncGameSignerContract = useCallback(async () => {
//         try {
//             const signerContract = await getGameSignerContract(provider)
//             setGameContract(signerContract)
//             // signerContract?.on('EntrySubmitted', (id, player, amount, color) => {
//             //     signerContract?.getRoundEntries(1).then((e: any) => setPlayerEntries(e))
//             //     fetchBalances(publicAddress)
//             // })
//             // signerContract?.on('RandomNumberFetched', (roundId, randomness, requestId) => {
//             //     console.log(roundId, randomness, requestId)
//             // })
//             console.log(signerContract)
//         } catch (err) {
//             console.error(err)
//         }
//     }, [provider, setGameContract, getGameSignerContract])

//     const fetchTotalRounds = useCallback(async () => {
//         const roundNums = await gameContract?.currentRoundId()
//         setTotalRounds(Number(utils.formatUnits(roundNums, 0)))
//     }, [gameContract])

//     const claimPrize = useCallback(async () => {
//         try {
//             if (!provider) return
//             const pearContract = await getPearSignerContract(provider)
//             await pearContract?.claimPrize()
//         } catch (err) {
//             console.error(err)
//         }
//     }, [provider, getPearSignerContract])

//     useEffect(() => {
//         if (!gameContract) return
//         fetchTotalRounds()
//         gameContract?.on(
//             'RandomNumberFetched',
//             (roundId, randomness, requestId) => {
//                 console.log(utils.formatUnits(roundId, 0), utils.formatUnits(randomness), requestId)
//             }
//         )
//     }, [fetchTotalRounds, gameContract])

//     useDebounce(
//         () => {
//             if (!publicAddress) return
//             fetchBalances()
//             asyncGameSignerContract()
//         },
//         500,
//         [publicAddress]
//     )

//     useEffect(() => {
//         gameContract
//             ?.getRoundEntries(selectedRound)
//             .then((e: any) => setPlayerEntries(e))
//     }, [selectedRound, gameContract])

//     const selectOptions = useMemo(() => {
//         const options = Array.from(Array(totalRounds + 1).keys())
//         return options.map((round) => (
//             <option key={round} value={round}>
//                 {round}
//             </option>
//         ))
//     }, [totalRounds])

//     return (
//         <SSpaceSpin>
//             <button onClick={() => {
//                 console.log(gameContract)
//                 gameContract?.getRandomNumber()
//             }}>Request Randomness</button>
//             <label>Select Round:</label>
//             <select onChange={(ev) => setSelectedRound(Number(ev.currentTarget.value))} defaultValue={totalRounds}>
//                 {selectOptions}
//             </select>
//             <DisplayCryptoInfo
//                 publicAddress={publicAddress}
//                 ethBalance={ethBalance}
//                 pearBalance={pearBalance}
//                 prizeBalance={prizeBalance}
//                 queueBalance={queueBalance}
//                 claimPrize={claimPrize}
//                 totalSupply={totalSupply}
//             />
//             <SubmitTx
//                 color={color}
//                 setColor={setColor}
//                 amount={amount}
//                 setAmount={setAmount}
//                 contract={gameContract}
//                 provider={provider}
//                 pearGameAddress={pearGameAddress}
//                 getPearSignerContract={getPearSignerContract}
//             />
//             <SEntryContainer>
//                 {playerEntries.map((info: any, idx) => (
//                     <EntryInfo
//                         key={idx}
//                         addr={info.player.substring(0, 10)}
//                         color={info.pickedColor ? 'black' : 'red'}
//                         amount={utils.formatEther(info.amount)}
//                         result={info.result}
//                         isSettled={info.isSettled}
//                         winAmount={utils.formatEther(info.winAmount)}
//                     />
//                 ))}
//             </SEntryContainer>
//         </SSpaceSpin>
//     )
// }

export default SpaceSpin