import styled from 'styled-components'

// Components
import PearToken from '../Components/Crypto/PearToken'

const SCrypto = styled.div`
    height: 100vh;
    width: 100vw;
    padding: 24px;
    box-sizing: border-box;
`

function Crypto() {
    return <SCrypto>
        <PearToken />
    </SCrypto>
}

export default Crypto