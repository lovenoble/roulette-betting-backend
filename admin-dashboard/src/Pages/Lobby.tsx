import styled from 'styled-components'

// Components
import MatchMaking from '../Components/MatchMaking'

const SLobby = styled.div`
    height: 100vh;
    width: 100vw;
`

function Lobby() {
    return (
        <SLobby>
            <MatchMaking />
        </SLobby>
    )
}

export default Lobby