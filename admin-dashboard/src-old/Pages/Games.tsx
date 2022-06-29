import styled from 'styled-components'

// Components
import SpaceSpin from '../Components/Crypto/Games/SpaceSpin'

const SGames = styled.div`
    position: relative;
    z-index: 100;
    height: 100vh;
    width: 100vw;
    box-sizing: border-box;
`

function Games() {
    return (
        <SGames>
            <SpaceSpin />
        </SGames>
    )
}

export default Games