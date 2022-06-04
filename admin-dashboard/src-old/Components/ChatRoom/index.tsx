import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

// Components
import OnlinePlayers from './OnlinePlayers'
import ChatBox from './ChatRoom'

// Hooks
import usePear from '../../hooks/usePear'
import useAuth from '../../hooks/useAuth'
import useRealtime from '../../hooks/useRealtime'

const SChatRoom = styled.div`
    display: flex;
    justify-content: center;
`

function ChatRoom({
    chatRoomId = ''
}) {
    const pear = usePear()
    const navigate = useNavigate()
    const { state, realtime } = useRealtime()
    const { authToken, publicAddress } = useAuth()

    useEffect(() => {
        if (!authToken) {
            return navigate('/connect-wallet')
        }
        realtime?.joinOrCreateChatRoom(authToken)

        return () => {
            realtime?.leaveChatRoom()
        }
    }, [])

    return <SChatRoom>
        <OnlinePlayers players={state.players} />
        <ChatBox myAddress={publicAddress} messages={state.messages} sendMessage={realtime.sendChatRoomMessage} />
    </SChatRoom>
}

export default ChatRoom