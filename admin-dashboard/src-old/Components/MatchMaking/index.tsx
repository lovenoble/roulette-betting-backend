import { useMemo } from 'react'
import styled from 'styled-components'

// Components
import RoomPreview from './RoomPreview'

// Hooks
import useRealtime from '../../hooks/useRealtime'

const SLobby = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: 24px;
`

const SRoomContainer = styled.div`
    width: 100%;
    display: flex;
`

function Lobby() {
    const { state } = useRealtime()

    const lobbiesJsx = useMemo(
        () => state.availableRooms.map((room) => <RoomPreview key={room.roomId} room={room} joinRoom={(room) => {}} />),
        [state.availableRooms]
    )

    return (
        <SLobby>
            <h2>Available Rooms</h2>
            <SRoomContainer>{lobbiesJsx}</SRoomContainer>
        </SLobby>
    )
}

export default Lobby
