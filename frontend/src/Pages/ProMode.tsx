import styled from 'styled-components'

// Components
// import AdvancedWager from '../Components/Crypto/AdvancedWager'

const SProMode = styled.div`
    top: 0px;
    left: 0px;
    display: flex;
    position: fixed;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    z-index: 999;
`

function ProMode() {
    return (
        <SProMode>
            {/* <AdvancedWager /> */}
        </SProMode>
    )
}

export default ProMode