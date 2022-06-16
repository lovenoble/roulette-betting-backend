import fs from 'fs'
import { Wallet, providers, BigNumber, utils } from 'ethers'
import { exec } from 'node:child_process'

import { FareSpinGame, FareSpinGame__factory, FareToken, FareToken__factory } from '../types'
import { fareAPI, spinAPI } from '..'
import cryptoConfig from '../../config/crypto.config'
import { logger, createBatchEntry, BN, randomHexString } from '../utils'

const { blockchainRpcUrl, privateKey, fareTokenAddress, fareSpinGameAddress } = cryptoConfig

const provider = new providers.JsonRpcProvider(blockchainRpcUrl)

/** Class that generates private keys, create seed provider instances, and manage crypto seed data */
class CryptoAccount {
	#seedPath = `${process.cwd()}/crypto/admin/seed`
	#privateKeys: string[] = []
	#publicKeys: string[] = []
	#signers: Wallet[] = []

	get seedPath() {
		return this.#seedPath
	}

	get publicKeys() {
		return this.#publicKeys
	}

	get signers() {
		return this.#signers
	}

	async init(fileName = 'default') {
		const seedFilePath = `${this.seedPath}/${fileName}.seed`
		const data = fs.readFileSync(seedFilePath, { encoding: 'utf8' })
		let privateKeys: string[] = []

		if (!data) {
			privateKeys = await this.createSeedAccounts()
			logger.info('Seed private key file empty. Generated new keys.')
		} else {
			privateKeys = JSON.parse(data) as string[]
			logger.info('Fetched existing seed private keys.')
		}

		this.#signers = privateKeys.map(privKey => new Wallet(privKey, provider))

		this.#publicKeys = this.#signers.map(signer => signer.address)

		return {
			signers: this.#signers,
			publicKeys: this.#publicKeys,
		}
	}

	async #getPrivateKeys(fileName = 'default') {
		const seedFilePath = `${this.seedPath}/${fileName}.seed`
		const data = fs.readFileSync(seedFilePath, { encoding: 'utf8' })
		let privateKeys: string[] = []

		if (!data) {
			privateKeys = await this.createSeedAccounts()
		} else {
			privateKeys = JSON.parse(data) as string[]
		}

		return privateKeys
	}

	deleteSeedPath() {
		fs.rmdirSync(this.seedPath)
	}

	#ensureSeedDir() {
		if (!fs.existsSync(this.seedPath)) fs.mkdirSync(this.seedPath)
	}

	#ensureSeedFile(fileName = 'default') {
		const seedFilePath = `${this.seedPath}/${fileName}.seed`
		if (!fs.existsSync(seedFilePath)) fs.openSync(seedFilePath, 'w')
	}

	#addToSeedFile(privateKeys: string[], fileName = 'default') {
		const seedFilePath = `${this.seedPath}/${fileName}.seed`
		const data = fs.readFileSync(seedFilePath, { encoding: 'utf8' })

		let fileData = ''

		if (data) {
			const parsedData = JSON.parse(data) as string[]
			const combinedPrivateKeys = [...parsedData, ...privateKeys]
			this.#privateKeys = combinedPrivateKeys
			fileData = JSON.stringify(combinedPrivateKeys)
		} else {
			this.#privateKeys = privateKeys
			fileData = JSON.stringify(privateKeys)
		}

		fs.appendFileSync(seedFilePath, fileData, 'utf8')
	}

	async generatePrivateKey(): Promise<string> {
		return new Promise((resolve, reject) => {
			exec('openssl rand -hex 32', (error, stdout, stderr) => {
				if (error) reject(error)
				if (stderr) reject(stderr)
				resolve(`0x${stdout.trim()}`)
			})
		})
	}

	async createSeedAccounts(count = 10, newFileName?: string) {
		this.#ensureSeedDir() // Create seed directory if it doesn't exist
		this.#ensureSeedFile(newFileName)

		const counts = [...Array(count).keys()]
		const promiseList = counts.map(() => this.generatePrivateKey())

		const privateKeys = await Promise.all(promiseList)

		this.#addToSeedFile(privateKeys, newFileName)

		return privateKeys
	}
}

// @NOTE: Need to discuss about these values
const AVAX_FLOOR = utils.parseEther('0.25')
const AVAX_FAUCET_AMOUNT = utils.parseEther('1')
const FARE_FLOOR = utils.parseEther('10000')
const FARE_FAUCET_AMOUNT = utils.parseEther('500000')

/** Used to run admin level smart contract functions */
class CryptoAdmin {
	adminSigner = new Wallet(privateKey, provider)
	seed = new CryptoAccount()
	fare!: FareToken
	spin!: FareSpinGame

	async init() {
		logger.warn(
			'CryptoAdmin should only be used in a development or test environment. Do not use in production.'
		)

		this.fare = FareToken__factory.connect(fareTokenAddress, this.adminSigner)
		this.spin = FareSpinGame__factory.connect(fareSpinGameAddress, this.adminSigner)

		await this.seed.init()

		// let baseNonce = provider.getTransactionCount(this.adminSigner.address);
		// let nonceOffset = 0;
		// function getNonce() {
		//   return baseNonce.then((nonce) => (nonce + (nonceOffset++)));
		// }

		await this.ensureSeedAccountBalances()

		logger.info('CryptoAdmin has been initialized')
	}

	async ensureSeedAccountBalances() {
		const promiseList = this.seed.signers.map(signer => {
			const { address } = signer
			return new Promise((resolve, reject) => {
				this.checkShouldTransfer(address)
					.then(transferType => {
						if (transferType !== 'none') {
							logger.info(
								`Player balance low on funds. Transfering transferType(${transferType}) to ${address}`
							)
						}
						switch (transferType) {
							case 'avax':
								this.transferAvaxTo(address, AVAX_FAUCET_AMOUNT)
									.then(resolve)
									.catch(reject)
								break
							case 'fare':
								this.transferFareTo(address, FARE_FAUCET_AMOUNT)
									.then(resolve)
									.catch(reject)
								break
							case 'both':
								this.transferFareTo(address, FARE_FAUCET_AMOUNT)
									.then(() => {
										resolve('something')
										// this.transferAvaxTo(address, AVAX_FAUCET_AMOUNT)
										// 	.then(resolve)
										// 	.catch(reject)
									})
									.catch(reject)
								break
							case 'none':
								break
							default:
								reject(new Error('No condition met'))
								break
						}
					})
					.catch(reject)
			})
		})

		/* eslint-disable */
		for await (const prom of promiseList) {
			console.log(prom)
		}
		/* eslint-enable */
	}

	async checkShouldTransfer(address: string): Promise<'fare' | 'avax' | 'none' | 'both'> {
		const fareBalance = await this.fare.balanceOf(address)
		const avaxBalance = await this.fare.provider.getBalance(address)
		let shouldTransferFare = false
		let shouldTransferAvax = false

		if (fareBalance.lt(FARE_FLOOR)) shouldTransferFare = true
		if (avaxBalance.lt(AVAX_FLOOR)) shouldTransferAvax = true

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
		const tx = await this.adminSigner.sendTransaction({
			to,
			value: amount,
		})
		const receipt = await tx.wait()
		return receipt
	}

	async createBatchEntry(userIdx: number, gameModeId: 0 | 1 | 2) {
		const params = createBatchEntry([[1000, BN(gameModeId), 0]])
		const signer = this.seed.signers[userIdx]
		if (!signer) throw new Error("Signer account doesn't exist")

		const tx = await this.spin.connect(signer).placeBatchEntry(params)
		const receipt = await tx.wait()
		return receipt
	}

	async settleBatchEntry(userIdx: number, roundId: number) {
		const signer = this.seed.signers[userIdx]
		if (!signer) throw new Error("Signer account doesn't exist")

		const tx = await this.spin.connect(signer).settleBatchEntry(roundId, signer.address)
		const receipt = await tx.wait()
		return receipt
	}

	async pauseSpinRound(isPaused: boolean) {
		const tx = await this.spin.setRoundPaused(isPaused)
		const receipt = await tx.wait()
		return receipt
	}

	async concludeRound() {
		const vrfRequestId = `0x${randomHexString(256)}`
		const tx = await this.spin.testConcludeRound(vrfRequestId)
		const receipt = await tx.wait()
		return receipt
	}
}

/** Used to run admin level smart contract functions */
export default new CryptoAdmin()
