import styled from 'styled-components'
import { useParams } from 'react-router-dom'

// Components
import ChatRoomComponent from '../Components/ChatRoom'
import RealtimeProvider from '../contexts/RealtimeProvider'

const SChatRoom = styled.div`
    position: relative;
    height: 100vh;
    width: 100vw;
    z-index: 100;
    display: flex;
    justify-content: center;
`

function ChatRoom() {
    const { chatRoomId } = useParams()

    return (
        <RealtimeProvider>
            <SChatRoom>
                <ChatRoomComponent chatRoomId={chatRoomId} />
            </SChatRoom>
        </RealtimeProvider>
    )
}

export default ChatRoom