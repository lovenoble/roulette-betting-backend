import { useCallback } from 'react'
import styled from 'styled-components'
import { RoomAvailable } from 'colyseus.js'

const SRoomPreview = styled.div`
    padding: 12px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    display: flex;
    flex-direction: column;
    > div {
        margin-bottom: 4px;
    }
`

interface IRoomPreviewProps {
    room: RoomAvailable
    joinRoom: (room: string) => void
}

function RoomPreview({ room, joinRoom = (room) => {} }: IRoomPreviewProps) {
    const {
        // name: accessName,
        roomId,
        clients,
        maxClients,
        metadata: { name: roomName, desc },
    } = room

    const join = useCallback(() => {
        // Handle join here
        // joinRoom(accessName as string)
        console.log(roomId)
    }, [roomId])


    return (
        <SRoomPreview>
            <div>Room Id: {roomId}</div>
            <div>Name: {roomName}</div>
            <div>Desc: {desc}</div>
            <div>
                Capacity: {clients}/{maxClients}
            </div>
            <button onClick={join}>Join</button>
        </SRoomPreview>
    )
}

export default RoomPreview
