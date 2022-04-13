import { useMemo } from 'react'
import { createAvatar } from '@dicebear/avatars'
import * as style from '@dicebear/avatars-bottts-sprites'
import styled from 'styled-components'
import date from 'date-and-time'
import { motion } from 'framer-motion'

// Libraries
import { shortenAddress } from '../../lib/pears/utils'

const SChatMessage = styled(motion.div)<{ isFirstMessage: boolean, isMine: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: ${({ isMine }) => isMine ? 'flex-end' : 'flex-start'};
    padding: 6px;
    padding-top: ${({ isFirstMessage }) => (isFirstMessage ? '6px' : '2px')};
`

const SChatHeader = styled.div`
    display: flex;
    align-items: center;
    > span {
        margin-left: 6px;
        font-size: 10px;
        color: rgba(255, 255, 255, 0.8);
    }
    .address {

    }
    .timestamp {
        margin-left: 4px;
        font-size: 8px;
    }
`

export const SPlayerAvatar = styled.div`
    border-radius: 100%;
    /* border: 1px solid #87104f; */
    height: 22px;
    width: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    > img {
        height: 14px;
    }
`

const SMessageText = styled.div<{ isFirstMessage: boolean; isMine: boolean }>`
    background: ${({ isMine }) => (isMine ? '#87104f' : '#4629377a')};
    margin-left: ${({ isMine }) => isMine ? '0px' : '8px' };
    margin-right: ${({ isMine }) => isMine ? '8px' : '0px' };
    box-sizing: border-box;
    margin-top: ${({ isFirstMessage }) => (isFirstMessage ? '6px' : '2px')};
    padding: 4px 18px;
    border-radius: 10px;
    font-size: 14px;
    line-height: 1.45;
    max-width: 70%;
    word-break: break-word;
`

interface IChatMessage {
    message: string
    player: string
    createdAt: any
    isFirstMessage: boolean
    isMine: boolean
}

function ChatMessage({ message = '', player = '', createdAt, isFirstMessage, isMine }: IChatMessage) {
    const defaultAvatar = useMemo(
        () =>
            createAvatar(style, {
                seed: player,
                base64: true,
                colorful: true,
            }),
        [player]
    )

    const timestamp = useMemo(
        () => date.format(new Date(createdAt), 'hh:mm A'),
        [createdAt]
    )

    return (
        <SChatMessage initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} isFirstMessage={isFirstMessage} isMine={isMine}>
            {isFirstMessage && (
                <SChatHeader>
                    <SPlayerAvatar>
                        <img alt="Avatar" src={defaultAvatar} />
                    </SPlayerAvatar>
                    <span className="address">{shortenAddress(player)}</span>
                    <span className="timestamp">{timestamp}</span>
                </SChatHeader>
            )}
            <SMessageText isMine={isMine} isFirstMessage={isFirstMessage}>
                {message}
            </SMessageText>
        </SChatMessage>
    )
}

export default ChatMessage
