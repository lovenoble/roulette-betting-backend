import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { motion } from 'framer-motion'

// Assets
import securityIllustration from '../../assets/connect-wallet/security-illustration.svg'
import formaticLogo from '../../assets/connect-wallet/formatic.png'
import metamaskLogo from '../../assets/connect-wallet/metamask-logo.png'
import portisLogo from '../../assets/connect-wallet/portis.png'
import walletConnectLogo from '../../assets/connect-wallet/wallet-connect.svg'
import coinbaseWalletLogo from '../../assets/connect-wallet/coinbase-wallet.svg'
import loadingSvg from '../../assets/connect-wallet/loading-animation.svg'

// Hooks
import usePear from '../../hooks/usePear'
import useAuth from '../../hooks/useAuth'

// Components
import PearBtn from '../UI/PearBtn'

const SEthereumWallet = styled(motion.div)`
    position: relative;
    width: 550px;
    background: rgb(27, 7, 30);
    background: linear-gradient(
        135deg,
        rgba(27, 7, 30, 0.7) 0%,
        rgba(27, 7, 29, 0.9) 50%,
        rgba(27, 24, 24, 0.6) 100%
    );
    border-radius: 10px;
    box-shadow: 0px 51px 69px 0px rgba(23, 18, 43, 0.58);
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 120px;
`

const SInfoWrapper = styled.div<{ isConnecting: boolean }>`
    display: flex;
    filter: ${({ isConnecting }) => isConnecting ? 'blur(4px)' : 'none'};
    > img {
        flex: 1;
        padding-right: 12px;
    }
`

const SExplainerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    color: white;
    font-weight: 300;
    flex: 1;
    > p {
        font-size: 14px;
        margin-bottom: 4px;
        margin-top: 4px;
    }
`

const SDisabledOption = styled.div`
    background: #2c0b2e;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 12px;
    font-size: 14px;
    border-radius: 10px;
    margin-top: 12px;
    filter: blur(1px);
    > img {
        margin-left: 4px;
    }
`

const SDisabledWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 24px;
`

const SDisabledRow = styled.div`
    display: flex;
    justify-content: space-around;
`

const SConnectBtn = styled(motion.button)<{ isConnecting: boolean }>`
    border: none;
    color: white;
    background: #2c0b2e;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 24px;
    font-size: 14px;
    border-radius: 10px;
    margin-top: 24px;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    filter: ${({ isConnecting }) => (isConnecting ? 'blur(4px)' : 'none')};
    > img {
        margin-left: 8px;
        height: 28px;
    }
`

const SErrorMessage = styled.div`
    margin-top: 12px;
    font-size: 14px;
    color: #f44336;
`

const SConnectingToWallet = styled.div`
    position: absolute;
    border-radius: 10px;
    background: rgba(0, 0, 0, .80);
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
    z-index: 101;
    > img {
        height: 64px;
    }
`

function ConnectingToWallet() {
    return (<SConnectingToWallet>
        Waiting for user to connect wallet via Metamask...
        <img alt="Loading" src={loadingSvg} />
    </SConnectingToWallet>)
}

const motionVariants = {
    'initial': {
        y: -150,
        opacity: 0,
    },
    'animate': {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            duration: 1,
        }
    }
}

function EthereumWallet() {
    const navigate = useNavigate()
    const [isConnecting, setIsConnecting] = useState(false)
    const [errorMsg, setErrorMessage] = useState('')
    const { provider, pearEth } = usePear()
    const { setAuthToken, publicAddress, setPublicAddress, logout } = useAuth()

    const handleConnectWallet = useCallback(async () => {
        try {
            setIsConnecting(true)
            setErrorMessage('')
            const [authToken, publicAddress] = await pearEth.authenticate()
            setAuthToken(authToken)
            setPublicAddress(publicAddress)
            navigate('/chat')
        } catch (err: any) {
            // @NOTE: handle error
            console.error(err)
            setIsConnecting(false)
            if (err.message) {
                setErrorMessage(err.message)
            } else {
                setErrorMessage(err.toString())
            }
        }
    }, [])

    return (
        <SEthereumWallet variants={motionVariants} initial="initial" animate="animate">
            { isConnecting && <ConnectingToWallet /> }
            <SInfoWrapper isConnecting={isConnecting}>
                <img alt="Security Illustration" src={securityIllustration} />
                <SExplainerWrapper>
                    <p>
                        In order to use Pear Connect it’s required to connect
                        your MetaMask wallet. Please ensure you that Metamask is
                        installed and configured and you’re network is switch to
                        the ‘Kovan Test Network’.
                    </p>
                    <p>
                        We plan to implement more options for connecting your
                        different wallets:
                    </p>
                    <div>
                        <SDisabledWrapper>
                            <SDisabledRow>
                                <SDisabledOption>
                                    <span>Wallet Connect</span>
                                    <img
                                        alt="Wallet Connect Logo"
                                        src={walletConnectLogo}
                                    />
                                </SDisabledOption>
                                <SDisabledOption>
                                    <span>Formatic</span>
                                    <img
                                        alt="Formatic Logo"
                                        src={formaticLogo}
                                        style={{ height: 14 }}
                                    />
                                </SDisabledOption>
                            </SDisabledRow>
                            <SDisabledRow>
                                <SDisabledOption>
                                    <span>Coinbase Wallet</span>
                                    <img
                                        alt="Coinbase Wallet Logo"
                                        src={coinbaseWalletLogo}
                                        style={{ height: 18 }}
                                    />
                                </SDisabledOption>
                                <SDisabledOption>
                                    <span>Portis</span>
                                    <img
                                        alt="Portis Logo"
                                        src={portisLogo}
                                        style={{ height: 20 }}
                                    />
                                </SDisabledOption>
                            </SDisabledRow>
                        </SDisabledWrapper>
                    </div>
                </SExplainerWrapper>
            </SInfoWrapper>
            { errorMsg && <SErrorMessage>{errorMsg}</SErrorMessage> }
            <PearBtn
                isLoading={isConnecting}
                onClick={handleConnectWallet}
            >
                <span>Connect Wallet</span>
                <img alt="Metamask Connect" src={metamaskLogo} />
            </PearBtn>
        </SEthereumWallet>
    )
}

export default EthereumWallet
