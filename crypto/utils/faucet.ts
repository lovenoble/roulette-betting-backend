// @NOTE: Implement faucet token below

// const isDev = NODE_ENV !== 'production'

// const provider = new ethers.providers.JsonRpcProvider(
//     isDev ? BLOCKCHAIN_ETH_URL : INFURA_POLY_TESTNET
// )

// export async function faucetFareMatic(address: string) {
//     try {
//         const signer = new Wallet(PRIVATE_KEY, provider)
//         const fareTokenContract = new Contract(pearTokenAddress, PearToken.abi, signer)
//         const pearBalance = await fareTokenContract.balanceOf(address)
//         console.log('Current Balance:', utils.formatUnits(pearBalance, 18))

//         if (Number(utils.formatUnits(pearBalance, 18)) > 0) {
//             return
//         }

//         const pearAmount = utils.parseUnits('5000000')
//         console.log('Approving PEAR amount to ', address)
//         const approveResp = await fareTokenContract.approve(address, pearAmount)
//         await provider?.waitForTransaction(approveResp.hash)

//         console.log('Transferring PEAR amount to ', address)
//         const transferResp = await fareTokenContract?.transfer(address, pearAmount)

//         if (isDev) {
//             console.log('Sending ETH to ', address)
//             await signer.sendTransaction({
//                 to: address,
//                 value: utils.parseUnits('10'),
//             })
//         } else {
//             console.log('Sending MATIC to ', address)
//             await signer.sendTransaction({
//                 to: address,
//                 value: utils.parseUnits('.25'),
//             })
//         }

//         await provider?.waitForTransaction(transferResp.hash)
//     } catch (err) {
//         console.error(err)
//     }
// }
