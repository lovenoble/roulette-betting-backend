import styled from 'styled-components'
import { useMemo, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import shortId from 'shortid'
import numeral from 'numeral'

// Libraries
import { shortenAddress } from '../../../../lib/pears/utils'
import Panel from '../../../UI/Panel'
import { IWallet } from '../../../../contexts/reducers/types/pear'

// Components
import UserAvatar from '../../../UI/UserAvatar'
import { Flasher } from '../../../ChatRoom/OnlinePlayers'

const SPlayers = styled(motion.div)`
    height: 350px;
    width: 350px;
    position: fixed;
    z-index: 150;
    bottom: 24px;
    right: 24px;
`

const SPlayerPanel = styled(motion.div)`
    background: rgba(38, 10, 38, 0.66);
    border: 1px solid rgba(110, 0, 110, 0.24);
    box-shadow: 0px 0px 100px 40px rgba(38, 10, 38, 0.58);
    color: white;
    border-radius: 10px;
    box-sizing: border-box;
    height: 350px;
    width: 309px;
    overflow-x: hidden;
    .player-list-wrapper {
        display: flex;
        flex-wrap: wrap;
        overflow-y: scroll;
        overflow-x: hidden;
        height: 100%;
        ::-webkit-scrollbar {
            width: 6px;
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(135, 16, 79, 0.24);
        }
        width: 100%;
    }
`

const SPlayer = styled(motion.div)`
    height: 100px;
    width: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .player-avatar-wrapper {
        cursor: pointer;
        background: rgba(74, 11, 44, 0.5);
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 100%;
        height: 60px;
        width: 60px;
        position: relative;
        box-shadow: rgb(0 0 0 / 20%) 0px 3px 3px -2px,
            rgb(0 0 0 / 14%) 0px 3px 4px 0px,
            rgb(0 0 0 / 12%) 0px 1px 8px 0px;
        img {
            height: 44px;
        }
    }
    .player-address {
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        font-size: 10px;
        font-weight: bold;
        margin-top: 4px;
        /* background: rgba(38, 10, 38, 0.66); */
        color: rgba(255, 255, 255, 0.66);
        /* border: 1px solid rgba(110, 0, 110, 0.4); */
        overflow: hidden;
    }
`

const SFlasher = styled(Flasher)`
    top: auto;
    bottom: 0px;
    right: 2px;
`

interface IPlayersProps {
    players: Map<string, IWallet>
    layoutRef: any
}

const playerVariants = {
    initial: {
        scale: 1,
        opacity: 0.5,
    },
    mainInitial: {
        scale: 1,
        opacity: 1,
    },
    animate: {
        scale: 1,
        opacity: 1,
    },
    exit: {
        y: -300,
    },
    hover: {
        scale: 1.1,
    },
    tap: {
        scale: 0.9,
    },
}

function Player({ player, selected, setSelectedPlayer }: { player: IWallet, selected: boolean, setSelectedPlayer: any }) {
    return (
        <SPlayer
            variants={playerVariants}
        >
            <motion.div
                className="player-avatar-wrapper"
                variants={playerVariants}
                initial="mainInitial"
                // initial="initial"
                // animate="animate"
                onClick={() => setSelectedPlayer(player)}
                whileHover="hover"
                whileTap="tap"
            >
                <UserAvatar publicAddress={player.publicAddress} />
                <SFlasher />
            </motion.div>
            <span className="player-address">
                {shortenAddress(player.publicAddress || '')}
            </span>
        </SPlayer>
    )
}

const SColumnWrapper = styled(motion.div)`
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
        margin-bottom: 4px;
    }
`
const SRightColumn = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    padding-right: 8px;
    > div {
        margin-bottom: 4px;
    }
`

const SPlayerWalletDisplayed = styled(motion.div)`
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 16px;
`

const playerWalletVariants = {
    initial: {
        y: -350,
    },
    animate: {
        y: 0,
        transition: {
            duration: 0.75,
            type: 'spring',
        },
    },
}

function PlayerWalletDisplay({
    player = {},
    back = () => {},
    layoutRef
}: any) {
    if (!player) return null

    return (
        <SPlayerWalletDisplayed
            variants={playerWalletVariants}
            initial="initial"
            animate="animate"
        >
            <Player
                player={player}
                selected={false}
                setSelectedPlayer={() => {}}
                // selected={player.publicAddress === (selectedPlayer || {}).publicAddress}
            />
            <SColumnWrapper onClick={back}>
                <SLeftColumn>
                    <div>Public Address</div>
                    <div>Eth Balance:</div>
                    <div>Pear Balance:</div>
                    <div>Despoit Balance:</div>
                    <div>Queue Balance:</div>
                    <div>Prize Balance:</div>
                </SLeftColumn>
                <SRightColumn>
                    <div>{shortenAddress(player.publicAddress || '')}</div>
                    <div>{numeral(player.ethBalance).format('0,0.00')}</div>
                    <div>{numeral(player.pearBalance).format('0,0.00')}</div>
                    <div>{numeral(player.depositBalance).format('0,0.00')}</div>
                    <div>{numeral(player.queueBalance).format('0,0.00')}</div>
                    <div>{numeral(player.prizeBalance).format('0,0.00')}</div>
                </SRightColumn>
            </SColumnWrapper>
        </SPlayerWalletDisplayed>
    )
}

function Players({ players, layoutRef }: IPlayersProps) {
    const [selectedPlayer, setSelectedPlayer] = useState('')

    const jsxPlayers = useMemo(() => {
        const playerArr: any = []
        players.forEach((wallet, key) => {
            playerArr.push(
                {
                    ...wallet,
                },
                // {
                //     publicAddress: shortId(),
                // },
                // {
                //     publicAddress: shortId(),
                // },
                // {
                //     publicAddress: shortId(),
                // },
                // {
                //     publicAddress: shortId(),
                // },
                // {
                //     publicAddress: shortId(),
                // },
                // {
                //     publicAddress: shortId(),
                // },
                // {
                //     publicAddress: shortId(),
                // },
                // {
                //     publicAddress: shortId(),
                // },
                // {
                //     publicAddress: shortId(),
                // },
                // {
                //     publicAddress: shortId(),
                // },
                // {
                //     publicAddress: shortId(),
                // }
            )
        }, [])
        return playerArr
    }, [players])

    const playerPanelVariants = {
        initial: {
            y: -50,
        },
        animate: {
            y: 0,
            height: 350,
            width: 309,
            transition: {
                when: "beforeChildren",
                delayChildren: .5
            }
        },
        selectedWallet: {
            height: 240,
            width: 250,
        }
    }

    const playerListVariants = {
        initial: {
            y: -350,
        },
        animate: {
            y: 0,
            transition: {
                duration: 0.75,
                type: 'spring',
            },
        },
    }

    const playerVariants = {
        initial: {
            height: 350,
            width: 350,
        },
        selectedWallet: {
            height: 200,
            width: 260,
        }
    }

    return (
        <SPlayers
            variants={playerVariants}
            initial="initial"
            animate={selectedPlayer === '' ? 'animate' : 'selectedWallet'}
        >
            <SPlayerPanel
                variants={playerPanelVariants}
                initial="initial"
                animate={selectedPlayer === '' ? 'animate' : 'selectedWallet'}
                drag={true}
                dragConstraints={layoutRef}
                dragTransition={{ bounceStiffness: 800, bounceDamping: 25 }}
            >
                <AnimatePresence>
                    {selectedPlayer !== '' && (
                        <PlayerWalletDisplay
                            key="wallet-display"
                            player={jsxPlayers[selectedPlayer]}
                            back={() => setSelectedPlayer('')}
                        />
                    )}
                    {selectedPlayer === '' && jsxPlayers.length > 0 && (
                        <motion.div
                            key="player-wrapper"
                            variants={playerListVariants}
                            className="player-list-wrapper"
                        >
                            {jsxPlayers.map((player: any, idx: any) => (
                                <Player
                                    key={idx}
                                    player={player}
                                    selected={false}
                                    // selected={player.publicAddress === (selectedPlayer || {}).publicAddress}
                                    setSelectedPlayer={() =>
                                        setSelectedPlayer(idx)
                                    }
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </SPlayerPanel>
        </SPlayers>
    )
}

export default Players