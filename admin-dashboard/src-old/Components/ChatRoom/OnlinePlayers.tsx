import { useMemo } from 'react'
import styled from 'styled-components'
import { createAvatar } from '@dicebear/avatars'
import * as style from '@dicebear/avatars-bottts-sprites'
import { motion, AnimatePresence } from 'framer-motion'

// Libraries
import { IRTPlayer } from '../../lib/pears/types/chatRoom'
import { shortenAddress } from '../../lib/pears/utils'

const SOnlinePlayers = styled.div`
    height: 100%;
    box-shadow: -50px 0px 100px 40px rgba(38, 10, 38, 0.58);
    background: rgba(32, 0, 32, 0.8);
    height: 80%;
    min-height: 500px;
    width: 85px;
    margin-top: 60px;
    border-top: 1px solid rgba(110, 0, 110, 0.24);
    border-left: 1px solid rgba(110, 0, 110, 0.24);
    border-bottom: 1px solid rgba(110, 0, 110, 0.24);
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    padding-bottom: 12px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: scroll;
    ::-webkit-scrollbar {
        width: 0px;
        background: transparent;
    }
`

const SOnlinePlayer = styled(motion.div)`
    color: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid rgba(110, 0, 110, 0.24);
    padding: 12px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    > span {
        margin-top: 6px;
        font-size: 10px;
        color: rgba(255, 255, 255, .8);
    }
`

const SAvatarCircle = styled.div`
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    border: 1px solid rgba(110, 0, 110, 0.24);
    background: rgba(110, 0, 110, 0.8);
    > img {
        height: 32px;
    }
`

const SOnlineCircle = styled.div`
    height: 10px;
    width: 10px;
    background: #388e3c;
    border-radius: 100%;
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const SFlasher = styled(motion.div)<any>`
    position: absolute;
    height: 8px;
    width: 8px;
    border-radius: 100%;
    border: 1px solid #388e3c;
`

export function Flasher(props: any) {
    const flasherVariant = {
        initial: {
            scale: 1,
            opacity: 1,
        },
        animate: {
            scale: [1, 2],
            opacity: [1, 0.8, 0.6, 0.4, 0.2, 0],
            transition: {
                duration: 0.9,
                repeatType: 'loop',
                repeat: Infinity,
                repeatDelay: 0.4,
            },
        },
    }
    return (
        <SOnlineCircle {...props}>
            <SFlasher
                variants={flasherVariant}
                initial="initial"
                animate="animate"
            />
        </SOnlineCircle>
    )
}


function OnlinePlayer({ publicAddress = '' }) {
    const defaultAvatar = useMemo(
        () =>
            createAvatar(style, {
                seed: publicAddress,
                base64: true,
                colorful: true,
            }),
        [publicAddress]
    )

    return (
        <SOnlinePlayer
            initial={{ opacity: 0, y: 50 }}
            animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.02, type: 'spring', stiffness: 200 },
            }}
            exit={{
                opacity: 0,
                height: 0,
                padding: 0,
                transition: { duration: 0.25, type: 'tween' },
            }}
        >
            <SAvatarCircle>
                <img alt="Player Avatar" src={defaultAvatar} />
                <Flasher />
            </SAvatarCircle>
            <span>{shortenAddress(publicAddress)}</span>
        </SOnlinePlayer>
    )
}

interface IOnlinePlayersProps {
    players: Map<string, IRTPlayer>
}

function OnlinePlayers({ players }: IOnlinePlayersProps) {
    const playersJsx = useMemo(() => {
        const playerList: React.ReactElement[] = []
        const playerAddresses: string[] = []

        players.forEach((player, key) => {
            if (playerAddresses.indexOf(player.publicAddress) !== -1) {
                return
            }
            playerAddresses.push(player.publicAddress)
            playerList.push(
                <OnlinePlayer publicAddress={player.publicAddress} key={key} />
            )
        })

        return playerList
    }, [players])


    return <SOnlinePlayers><AnimatePresence>{playersJsx}</AnimatePresence></SOnlinePlayers>
}

export default OnlinePlayers