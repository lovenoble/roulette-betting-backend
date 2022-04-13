import { useState, useCallback, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { utils, Contract } from 'ethers'
import { useDebounce } from 'react-use'
import numeral from 'numeral'

// Hooks
import usePear from '../../../hooks/usePear'
import useAuth from '../../../hooks/useAuth'
// import useRealtime from '../../../hooks/useRealtime'

// Styles
const SPearToken = styled.div``

const SPearWalletInfo = styled.div`
    padding: 8px;
    margin: 12px;
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(0, 0, 0, .18);
    > div {
        margin-bottom: 8px;
    }
`

const SPearWalletWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-top: 12px;
`

// Computer public keys
// const publicKeys = [
//     // '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
//     // '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
//     // '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
//     // '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
//     '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
//     '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
//     '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
//     '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
//     '0xa0Ee7A142d267C1f36714E4a8F75612F20a79720',
//     '0xBcd4042DE499D14e55001CcbB24a551F3b954096',
//     '0x71bE63f3384f5fb98995898A86B02Fb2426c5788',
//     '0xFABB0ac9d68B0B445fB7357272Ff202C5651694a',
//     '0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec',
//     // '0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097',
//     // '0xcd3B766CCDd6AE721141F452C550Ca635964ce71',
//     // '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
//     // '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
//     // '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
//     // '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
// ]

// Laptop Public keys
const publicKeys = [
    // '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
    '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
    '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
    '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
    '0xa0Ee7A142d267C1f36714E4a8F75612F20a79720',
    '0xBcd4042DE499D14e55001CcbB24a551F3b954096',
    '0x71bE63f3384f5fb98995898A86B02Fb2426c5788',
    '0xFABB0ac9d68B0B445fB7357272Ff202C5651694a',
    '0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec',
    '0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097',
    '0xcd3B766CCDd6AE721141F452C550Ca635964ce71',
    '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
    '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
]

interface IPearWalletInfo {
    publicKey: string
    fetchBalances: any
    sendPear: any
    transferIdx: number
}

function PearWalletInfo({
    publicKey = '',
    fetchBalances,
    sendPear,
    transferIdx = 0,
}: IPearWalletInfo) {
    // const [ethBalance, setEthBalance] = useState("")
    const [pearBalance, setPearBalance] = useState("")

    useEffect(() => {
        ;(async () => {
            const [_eth, _pear] = (await fetchBalances(publicKey)) || []

            // setEthBalance(_eth)
            setPearBalance(_pear)
        })()
    }, [fetchBalances, transferIdx, setPearBalance, publicKey])

    return (
        <SPearWalletInfo>
            <div>Receiver Key: {publicKey.substring(0, 10)}</div>
            {/* <div>ETH Balance: {numeral(ethBalance).format('0,0') || '-'}</div> */}
            <div>PEAR Balance: {numeral(pearBalance).format('0,0') || '-'}</div>
            <button onClick={() => sendPear(publicKey)}>Send PEAR</button>
        </SPearWalletInfo>
    )
}

function PearToken() {
    const [transferIdx, setTransferIdx] = useState(0)
    const [pearBalance, setPearBalance] = useState('')
    const [pearSignerContract, setPearSignerContract] = useState<
        Contract | undefined
    >()
    const [tokenAmount, setTokenAmount] = useState('')
    const { publicAddress } = useAuth()
    const {
        // ethBalance,
        pearCrypto,
        pearEth,
        provider,
        // setEthBalance,
        // pearTokenContract,
    } = usePear()
    const { getPearBalance, sendPearToken, getPearSignerContract } = pearEth

    // console.log('contract', pearTokenContract)
    // console.log('provider', provider)
    // console.log(pearSignerContract)

    const fetchBalances = useCallback(
        async (publicAddress: string) => {
            try {
                const _pearBalance = await getPearBalance(
                    publicAddress,
                    // pearTokenContract
                )
                const _ethBalance: any = await provider?.getBalance(
                    publicAddress
                )

                return [utils.formatUnits(_ethBalance), _pearBalance]
            } catch (err) {
                console.error(err)
            }
        },
        [provider, getPearBalance]
    )

    const send = useCallback(
        async (addr: string) => {
            try {
                if (!tokenAmount) return alert('Please enter a token amount.')
                await sendPearToken(tokenAmount, addr, pearSignerContract)
                console.log('Everything went though')
                setTokenAmount('')
            } catch (err) {
                console.error(err)
            }
        },
        [sendPearToken, pearSignerContract, tokenAmount]
    )

    const asyncPearSignerContract = useCallback(async () => {
        try {
            const signerContract = await getPearSignerContract(provider)
            setPearSignerContract(signerContract)
        } catch (err) {
            console.error(err)
        }
    }, [provider, setPearSignerContract, getPearSignerContract])

    useDebounce(
        () => {
            if (!publicAddress) return
            ;(async () => {
                try {
                    const [_eth, _pear] =
                        (await fetchBalances(publicAddress)) || []

                    // setEthBalance(_eth)
                    setPearBalance(_pear)
                } catch (err) {
                    console.error(err)
                }
            })()

            asyncPearSignerContract()
        },
        500,
        [publicAddress, transferIdx]
    )

    useEffect(() => {
        // if (!pearTokenContract) return
        // pearTokenContract?.on('Transfer', (to, amount, from) => {
        //     return setTransferIdx((tIdx) => tIdx + 1)
        // })
    }, [fetchBalances, transferIdx, setTransferIdx])

    return (
        <SPearToken>
            <div>My Public Key: {publicAddress}</div>
            {/* <div>ETH Balance: {numeral(ethBalance).format('0,0') || '-'}</div> */}
            <div>PEAR Balance: {numeral(pearBalance).format('0,0') || '-'}</div>
            <input
                placeholder="Enter amount..."
                value={tokenAmount}
                onChange={(ev) => setTokenAmount(ev.currentTarget.value)}
            />
            <hr />
            <SPearWalletWrapper>
                {publicKeys.map((pubKey) => (
                    <PearWalletInfo
                        key={pubKey}
                        publicKey={pubKey}
                        fetchBalances={fetchBalances}
                        transferIdx={transferIdx}
                        sendPear={send}
                    />
                ))}
            </SPearWalletWrapper>
        </SPearToken>
    )
}

export default PearToken