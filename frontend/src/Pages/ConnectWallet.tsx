import styled from 'styled-components'

// Components
// import MetamaskConnect from '../Components/Crypto/MetamaskConnect'
import EthereumWallet from '../Components/Crypto/EthereumWallet'
import GuestLogin from '../Components/Crypto/GuestLogin'

const SConnectWallet = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    position: relative;
    align-items: center;
    justify-content: center;
    z-index: 100;
`

function ConnectWallet() {
    return (
        <SConnectWallet>
            <GuestLogin />
            <EthereumWallet />
        </SConnectWallet>
    )
}

export default ConnectWallet