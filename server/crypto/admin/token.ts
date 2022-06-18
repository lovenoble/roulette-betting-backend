import numeral from 'numeral'
import { Wallet, providers, BigNumber, utils } from 'ethers'

import { FareSpinGame, FareSpinGame__factory, FareToken, FareToken__factory } from '../types'
import cryptoConfig from '../../config/crypto.config'
import { logger } from '../utils'
import { AVAX_FLOOR, AVAX_FAUCET_AMOUNT, FARE_FLOOR, FARE_FAUCET_AMOUNT } from '../constants'

const { blockchainRpcUrl, privateKey, fareTokenAddress, fareSpinGameAddress } = cryptoConfig

const provider = new providers.JsonRpcProvider(blockchainRpcUrl)

type CryptoTokenOptions = {
	fundSigner?: Wallet
	fare?: FareToken
	spin?: FareSpinGame
}

export default class CryptoToken {
	fundSigner!: Wallet
	fare!: FareToken
	spin!: FareSpinGame

	constructor({ fundSigner, fare, spin }: CryptoTokenOptions) {
		this.fundSigner = fundSigner || new Wallet(privateKey, provider)
		this.fare = fare || FareToken__factory.connect(fareTokenAddress, this.fundSigner)
		this.spin = spin || FareSpinGame__factory.connect(fareSpinGameAddress, this.fundSigner)
	}

	async ensureBalance(address: string) {
		const transferType = await this.checkShouldTransfer(address)

		if (transferType !== 'none') {
			logger.info(
				`Balance(s) low. Transfering transferType(${transferType}) to ${address.substring(
					0,
					11
				)}`
			)
		}

		switch (transferType) {
			case 'avax':
				await this.transferAvaxTo(address, AVAX_FAUCET_AMOUNT)
				break
			case 'fare':
				await this.transferFareTo(address, FARE_FAUCET_AMOUNT)
				break
			case 'both':
				await this.transferFareTo(address, FARE_FAUCET_AMOUNT)
				await this.transferAvaxTo(address, AVAX_FAUCET_AMOUNT)
				break
			case 'none':
				break
			default:
				throw new Error('No condition met')
		}

		return transferType
	}

	async ensureSeedAccountBalances(signers: Wallet[]) {
		const promiseList = signers.map(signer => {
			const { address } = signer

			return async () => {
				return this.ensureBalance(address)
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
				avaxBalance
			)}) -- FARE(${this.prettyBN(fareBalance)})`
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
		const tx = await this.fare.transfer(to, amount)
		const receipt = await tx.wait()
		return receipt
	}

	async transferAvaxTo(to: string, amount: BigNumber) {
		const tx = await this.fundSigner.sendTransaction({
			to,
			value: amount,
		})
		const receipt = await tx.wait()
		return receipt
	}
}
