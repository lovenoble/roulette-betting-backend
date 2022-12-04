import numeral from 'numeral'
import { Wallet, providers, BigNumber, utils } from 'ethers'

import { FareSpin, FareSpin__factory, FareToken, FareToken__factory } from '../types'
import cryptoConfig from '../../config/crypto.config'
import { logger } from '../utils'
import {
  AVAX_FLOOR,
  SEED_AVAX_FAUCET_AMOUNT,
  FARE_FLOOR,
  SEED_FARE_FAUCET_AMOUNT,
} from '../constants'

const { blockchainRpcUrl, privateKey, fareTokenAddress, fareSpinAddress } = cryptoConfig

const provider = new providers.JsonRpcProvider(blockchainRpcUrl)

type CryptoTokenOptions = {
  fundSigner?: Wallet
  fare?: FareToken
  spin?: FareSpin
}

export default class CryptoToken {
  fundSigner!: Wallet
  fare!: FareToken
  spin!: FareSpin

  constructor({ fundSigner, fare, spin }: CryptoTokenOptions) {
    this.fundSigner = fundSigner || new Wallet(privateKey, provider)
    this.fare = fare || FareToken__factory.connect(fareTokenAddress, this.fundSigner)
    this.spin = spin || FareSpin__factory.connect(fareSpinAddress, this.fundSigner)

    // Log owners Fare and ETH balances
    // ;(async () => {
    // 	const balance = await this.fundSigner.getBalance()
    // 	const fareBalance = await this.fare.balanceOf(await this.fundSigner.getAddress())
    // 	console.log(utils.formatEther(fareBalance))
    // 	console.log(utils.formatEther(balance))
    // })()
  }

  async ensureBalance(address: string) {
    const transferType = await this.checkShouldTransfer(address)

    if (transferType !== 'none') {
      logger.info(
        `Balance(s) low. Transfering transferType(${transferType}) to ${address.substring(0, 11)}`,
      )
    }

    switch (transferType) {
      case 'avax':
        await this.transferAvaxTo(address, SEED_AVAX_FAUCET_AMOUNT)
        break
      case 'fare':
        await this.transferFareTo(address, SEED_FARE_FAUCET_AMOUNT)
        break
      case 'both':
        await this.transferFareTo(address, SEED_FARE_FAUCET_AMOUNT)
        await this.transferAvaxTo(address, SEED_AVAX_FAUCET_AMOUNT)
        break
      case 'none':
        break
      default:
        throw new Error('No condition met')
    }

    return transferType
  }

  async ensureAllowSpinMintBurn(signerWallet: Wallet) {
    const userFare = this.fare.connect(signerWallet)
    const didAllow = await userFare.didUserAllowContract(signerWallet.address, this.spin.address)

    if (!didAllow) {
      logger.info(
        `Submitting allow mint/burn transaction to FareSpin for ${signerWallet.address.substring(
          0,
          7,
        )}`,
      )
      // "gasLimit": 8000000,
      // "targetBlockRate": 2,
      // "minBaseFee": 25000000000,
      // "targetGas": 15000000,
      // "baseFeeChangeDenominator": 36,
      // "minBlockGasCost": 0,
      // "maxBlockGasCost": 1000000,
      // "blockGasCostStep": 200000

      // underpriced: address 0x3b7883D9150e6EA961CB486F736479f1282fD17E have gas fee cap (15000000) \\u003c pool minimum fee cap (25000000000)\
      await userFare.setAllowContractMintBurn(this.spin.address, true, {
        gasLimit: 8000000,
        gasPrice: 50000000000,
      })
    }
  }

  async ensureSeedAccountBalances(signers: Wallet[]) {
    const promiseList = signers.map(signer => {
      const { address } = signer

      return async () => {
        await this.ensureBalance(address)
        return this.ensureAllowSpinMintBurn(signer)
      }
    })

    /* eslint-disable */
    for (const prom of promiseList) {
      await prom()
    }
    /* eslint-enable */
  }

  prettyBN(bn: BigNumber) {
    return numeral(utils.formatEther(bn)).format('0,0.00')
  }

  async checkShouldTransfer(address: string): Promise<'fare' | 'avax' | 'none' | 'both'> {
    const fareBalance = await this.fare.balanceOf(address)
    const avaxBalance = await this.fare.provider.getBalance(address)
    let shouldTransferFare = false
    let shouldTransferAvax = false

    if (fareBalance.lt(FARE_FLOOR)) shouldTransferFare = true
    if (avaxBalance.lt(AVAX_FLOOR)) shouldTransferAvax = true

    logger.info(
      `Seed Player(${address.substring(0, 11)}) balances: AVAX(${this.prettyBN(
        avaxBalance,
      )}) -- FARE(${this.prettyBN(fareBalance)})`,
    )

    if (shouldTransferAvax && shouldTransferFare) {
      return 'both'
    }
    if (shouldTransferAvax && !shouldTransferFare) {
      return 'avax'
    }
    if (!shouldTransferAvax && shouldTransferFare) {
      return 'fare'
    }
    return 'none'
  }

  async transferFareTo(to: string, amount: BigNumber) {
    const tx = await this.fare.transfer(to, amount, {
      gasLimit: 8000000,
      gasPrice: 50000000000,
    })
    const receipt = await tx.wait()
    return receipt
  }

  async transferAvaxTo(to: string, amount: BigNumber) {
    const tx = await this.fundSigner.sendTransaction({
      to,
      value: amount,
      gasLimit: 8000000,
      gasPrice: 50000000000,
    })
    const receipt = await tx.wait()
    return receipt
  }
}
