import { useMemo, useRef, useEffect } from 'react'
import numeral from 'numeral'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import Reward from 'react-rewards'
import { Howl } from 'howler'
import { useThrottleFn } from 'react-use'

import { shortenAddress } from '../../../../lib/pears/utils'
import { IEntry } from '../../../../contexts/reducers/types/pear'
import UserAvatar from '../../../UI/UserAvatar'
// @ts-ignore
import kaChingMp3 from './assets/ka-ching.mp3'

const SPlayerEntry = styled(motion.div)`
    height: 180px;
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const SPlayerEntryPanel = styled.div`
    background: rgba(38, 10, 38, 0.66);
    border: 1px solid rgba(110, 0, 110, 0.24);
    box-shadow: 0px 0px 100px 12px rgba(38, 10, 38, 0.58);
    color: white;
    border-radius: 10px;
    box-sizing: border-box;
    /* height: 120px; */
    width: 114px;
    overflow-x: hidden;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    font-size: 12px;
    .player-address {
        border-bottom: 1px solid rgba(110, 0, 110, 0.55);
        background: rgba(110, 0, 110, 0.24);
        padding-bottom: 4px;
        padding-top: 4px;
        width: 100%;
        text-align: center;
        margin-bottom: 8px;
    }
    .player-amount {
        font-size: 14px;
        font-weight: 500;
        padding-top: 6px;
        padding-bottom: 6px;
    }
`

const SPlayerSettledPanel = styled(SPlayerEntryPanel)<{ pickedColor: string }>`
    background: ${({ pickedColor }) => pickedColor};
    position: relative;
    border: none;
    height: 120px;
`

const SPlayerSettleOverlay = styled.div`
    background: rgba(0, 0, 0, 0.6);
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    box-sizing: border-box;
    .result-address {
        font-weight: 500;
        padding-top: 4px;
        padding-bottom: 4px;
        font-size: 10px;
    }
    .result-text {
        font-weight: bold;
        padding-top: 8px;
        font-size: 16px;
    }
    .result-info-wrapper {
        display: flex;
        position: relative;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding-top: 16px;
        padding-bottom: 6px;
        border-top: 1px solid rgba(255, 255, 255, .12);
        .result-info-label {
            position: absolute;
            font-size: 10px;
            top: 2px;
        }
        .result-info-value {
            font-weight: bold;
            font-size: 12px;
            position: relative;
            .result-sign {
                position: absolute;
                left: -8px;
            }
        }
    }
`

const SColorDisplay = styled.div<{ pickedColor: string }>`
    height: 60px;
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    background: ${({ pickedColor }) => pickedColor};
    box-shadow: 0px 0px 100px 12px rgba(10, 10, 10, 0.58);
    > img {
        height: 48px;
    }
`

interface IPlayerEntry {
    entry: any
}

const colors = {
    pink: '#F72585',
    teal: '#3D5AFE',
}

const entryVariants = {
    initial: {
        opacity: 0,
        scale: 0.6,
    },
    animate: {
        opacity: 1,
        scale: 1,
        // y: 0,
        transition: {
            type: 'tween',
            duration: .15,
        }
    },
    exit: {
        opacity: 0,
        // scale: 1,
    }
}

function PlayerSettled({ entry, pickedColor }: IPlayerEntry & { pickedColor: string }) {
    const reward = useRef<any>()
    const sound = useMemo(
        () =>
            new Howl({
                src: [kaChingMp3],
                volume: 0.05,
                rate: 1,
            }),
        []
    )


    const hasWon = useMemo(() => {
        return entry.result === '1'
    }, [entry.result])

    useThrottleFn(() => {
        if (!reward.current) return
        if (hasWon) {
            setTimeout(() => {
                reward.current.rewardMe()
                sound.play()
            }, 200 * (entry.delay * 2))
        } else {
            // setTimeout(() => {
            //     reward.current.punishMe()
            // }, 200 * (delay * 2))
        }
    // @ts-ignore
    }, 700, [reward, hasWon, entry, sound])

    return (
        <SPlayerEntry variants={entryVariants}>
            <Reward
                ref={reward}
                type="confetti"
                config={{ zIndex: 1, spread: 100, angle: 60, elementCount: 30 }}
            >
                <SPlayerSettledPanel pickedColor={pickedColor}>
                    <SPlayerSettleOverlay>
                        <span className="result-text">
                            {hasWon ? 'WINNER' : 'GAME OVER'}
                        </span>
                        <div className="result-address">
                            {shortenAddress(entry.publicAddress || '')}
                        </div>
                        <div className="result-info-wrapper">
                            <span className="result-info-label">
                                Entry Amount:
                            </span>
                            <div className="result-info-value">
                                {numeral(entry.amount).format('0,0.00')}
                            </div>
                        </div>
                        <div className="result-info-wrapper">
                            <span className="result-info-label">
                                {hasWon ? 'Win' : 'Lose'} Amount:
                            </span>
                            <div
                                className="result-info-value"
                                style={{
                                    color: hasWon ? '#4CAF50' : '#F44336',
                                }}
                            >
                                <span className="result-sign">
                                    {hasWon ? '+' : '-'}{' '}
                                </span>
                                {numeral(
                                    hasWon ? entry.winAmount : entry.amount
                                ).format('0,0.00')}
                            </div>
                        </div>
                        {/* <SColorDisplay pickedColor={hasWon ? '#004D40' : '#FF1744'}> */}
                    </SPlayerSettleOverlay>
                    <SColorDisplay pickedColor={pickedColor}>
                        <UserAvatar publicAddress={entry.publicAddress} />
                    </SColorDisplay>
                </SPlayerSettledPanel>
            </Reward>
        </SPlayerEntry>
    )
}

function PlayerEntry({ entry }: IPlayerEntry) {
    const pickedColor = useMemo(() => {
        const color = entry.pickedColor === '0' ? 'pink' : 'teal'
        return colors[color]
    }, [entry.pickedColor])

    if (entry.isSettled) {
        return <PlayerSettled pickedColor={pickedColor} entry={entry} />
    }

    return (
        <SPlayerEntry variants={entryVariants}>
            <SPlayerEntryPanel>
                <div className="player-address">{shortenAddress(entry.publicAddress || '')}</div>
                <SColorDisplay pickedColor={pickedColor}>
                    <UserAvatar publicAddress={entry.publicAddress} />
                </SColorDisplay>
                <div className="player-amount">{numeral(entry.amount).format('0,0.00')}</div>
            </SPlayerEntryPanel>
        </SPlayerEntry>
    )
}

export default PlayerEntry