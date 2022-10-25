import { useMemo, useCallback, useRef } from 'react'
import styled from 'styled-components'
import { useDebounce } from 'react-use'
import { motion, AnimatePresence } from 'framer-motion'

// Assets
import sendMessageLogo from '../../assets/chat/send-message.svg'

// Components
import { IRTChatMessage } from '../../lib/pears/types/chatRoom'
import PearInput from '../UI/PearInput'
import ChatMessage from './ChatMessage'

const SChatRoom = styled.div`
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 80%;
    min-height: 500px;
    width: 60vw;
    min-width: 700px;
    background: rgba(38, 10, 38, 0.66);
    border: 1px solid rgba(110, 0, 110, 0.24);
    box-shadow: 0px 0px 100px 40px rgba(38, 10, 38, 0.58);
    color: white;
    border-radius: 10px;
    box-sizing: border-box;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
`

const SChatContainer = styled.div`
    overflow-y: scroll;
    overflow-x: hidden;
    width: 100%;
    flex: 1;
    position: relative;
    padding: 16px;
    box-sizing: border-box;
    ::-webkit-scrollbar {
        width: 6px;
        background: transparent;
    }
    ::-webkit-scrollbar-thumb {
        background: rgba(135, 16, 79, .24);
    }
`

const SChatControls = styled.form`
    display: flex;
    width: 100%;
    box-sizing: border-box;
    background: rgba(32, 0, 32, 0.8);
    border-top: 1px solid rgba(110, 0, 110, 0.24);
    > .send-message {
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        height: 100%;
        padding-left: 12px;
        padding-right: 12px;
        cursor: pointer;
        > img {
            height: 24px;
        }
    }
`

interface IChatRoom {
    messages: Map<string, IRTChatMessage>
    sendMessage: any
    myAddress: string
}

function ChatRoom({ messages, sendMessage, myAddress }: IChatRoom) {
    const inputRef = useRef<HTMLInputElement>(null)
    const bottomBufferRef = useRef<HTMLDivElement>(null)

    const messagesJsx = useMemo(() => {
        const messageList: React.ReactElement[] = []
        let latestPlayer: any = ''

        messages.forEach((message, key) => {
            let isFirstMessage = false
            if (message.createdBy !== latestPlayer) {
                latestPlayer = message.createdBy
                isFirstMessage = true
            }

            messageList.push(
                <ChatMessage
                    key={key}
                    isMine={myAddress === message.createdBy}
                    isFirstMessage={isFirstMessage}
                    message={message.text}
                    player={message.createdBy}
                    createdAt={message.createdAt}
                />
            )
        })

        return messageList
    }, [messages, myAddress])

    const onSend = useCallback(
        (event) => {
            event.preventDefault()
            if (!inputRef.current) return
            const msgText = inputRef.current.value
            if (!msgText.trim()) return

            sendMessage(msgText)

            inputRef.current.value = ''
            inputRef.current.focus()
        },
        [inputRef, sendMessage]
    )

    useDebounce(
        () => {
            if (!bottomBufferRef.current) return
            bottomBufferRef.current.scrollIntoView({ behavior: 'smooth' })
        },
        50,
        [messages, bottomBufferRef]
    )

    return (
        <SChatRoom>
            <SChatContainer>
                <AnimatePresence>{messagesJsx}</AnimatePresence>
                <div ref={bottomBufferRef} className="bottom-buffer"></div>
            </SChatContainer>
            <SChatControls onSubmit={onSend}>
                <PearInput
                    ref={inputRef}
                    autoFocus
                    placeholder="Write a message..."
                />
                <motion.button
                    className="send-message"
                    whileHover={{
                        scale: 1.1,
                        transition: {
                            duration: 0.15,
                        },
                    }}
                    whileTap={{
                        scale: 0.9,
                        transition: {
                            duration: 0.15,
                        },
                    }}
                >
                    <img alt="Send Message" src={sendMessageLogo} />
                </motion.button>
            </SChatControls>
        </SChatRoom>
    )
}

export default ChatRoom
