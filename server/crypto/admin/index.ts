import { Wallet, providers, ContractTransaction, ContractReceipt, ethers } from 'ethers'
import { Clock, Delayed } from '@colyseus/core'

import { FareSpin, FareSpin__factory, FareToken, FareToken__factory, FlatEntry } from '../types'
import CryptoToken from './token'
import CryptoSeed from './seed'
import cryptoConfig from '../../config/crypto.config'
import { logger, createBatchEntry, randomHexString } from './utils'
import { randomizer } from '../../utils'
import store from '../../store'
import {
	INITIAL_COUNTDOWN_SECS,
	INITIAL_PAUSE_ROUND_MARKER,
	INITIAL_FINISHED_SECS,
	INITIAL_SPIN_DURATION,
	INITIAL_DISPLAY_RESULT_DURATION,
	DEFAULT_SIMULATION_INTERVAL,
	SEED_USER_SUBMIT_FEQUENCY,
	ContractModes,
	// DEFAULT_PATCH_RATE,
} from '../constants'

const { blockchainRpcUrl, privateKey, fareTokenAddress, fareSpinAddress } = cryptoConfig

const provider = new providers.JsonRpcProvider(blockchainRpcUrl)

/** Used to run admin level smart contract functions */
class CryptoAdmin {
	adminSigner = new Wallet(privateKey, provider)
	seed = new CryptoSeed()
	fund!: CryptoToken
	fare!: FareToken
	spin!: FareSpin
	clock = new Clock()
	delayedInterval!: Delayed
	delayedTimeout!: Delayed
	countdown!: number
	eventLoopIntervalId: NodeJS.Timer
	currentUserIdx = 0

	async init() {
		logger.warn(
			'CryptoAdmin should only be used in a development or test environment. Do not use in production.'
		)

		try {
			this.fare = FareToken__factory.connect(fareTokenAddress, this.adminSigner)
			this.spin = FareSpin__factory.connect(fareSpinAddress, this.adminSigner)
			this.fund = new CryptoToken({
				fundSigner: this.adminSigner,
				fare: this.fare,
				spin: this.spin,
			})

			await this.seed.init()

			await this.fund.ensureSeedAccountBalances(this.seed.signers)

			logger.info('CryptoAdmin has been initialized')
		} catch (err) {
			logger.warn(err)
			logger.warn('Failed to initialize CryptoAdmin. Did not seed/transfer to accounts')
		}
	}

	async createBatchEntry(userIdx: number, entries: FlatEntry[]) {
		try {
			let tx: ContractTransaction
			let receipt: ContractReceipt
			const params = createBatchEntry(entries)
			const signer = this.seed.signers[userIdx]
			if (!signer) throw new Error("Signer account doesn't exist")

			tx = await this.spin.connect(signer).placeBatchEntry(params)
			receipt = await tx.wait()
			logger.info(`Submitted batch entry for Player: (${signer.address.substring(0, 11)})`)
			return receipt
		} catch (err: any) {
			logger.error(new Error(`${err.error.reason}`))
			throw new Error(err.error.reason)
		}
	}

	async settleBatchEntry(userIdx: number, roundId: number) {
		const signer = this.seed.signers[userIdx]
		if (!signer) throw new Error("Signer account doesn't exist")

		const tx = await this.spin.connect(signer).settleBatchEntry(roundId, signer.address)
		const receipt = await tx.wait()
		return receipt
	}

	createRandomBatchEntryParams(possibleEntries = 5, maxFare = 10000) {
		if (possibleEntries < 1) throw new Error('possibleEntries must be more than 1.')
		const entryMemoryMap = {
			'0': [],
			'1': [],
			'2': [],
		}
		const entryCount = randomizer(1, possibleEntries)
		const batchEntry: FlatEntry[] = [...Array(entryCount)].map(() => {
			let randomContractMode = 0
			if (entryMemoryMap['0'].length > 0) {
				randomContractMode = randomizer(1, 2)
			} else {
				randomContractMode = randomizer(0, 2)
			}
			const contractMode = ContractModes[randomContractMode]
			let randomPickedNumber = 0
			let isNewNumber = false

			while (!isNewNumber) {
				randomPickedNumber = Number(
					ethers.utils.formatUnits(
						ethers.BigNumber.from(ethers.utils.randomBytes(32)).mod(
							contractMode.cardinality
						),
						0
					)
				)

				if (entryMemoryMap[`${randomContractMode}`].indexOf(randomPickedNumber) === -1) {
					isNewNumber = true
					entryMemoryMap[`${randomContractMode}`].push(randomPickedNumber) // Add number to memoryMap
				}
			}
			const randomFareAmount = randomizer(1, maxFare)

			return [randomFareAmount, randomContractMode, randomPickedNumber] as FlatEntry
		})

		return batchEntry
	}

	async submitRandomBatchEntry() {
		// Reset currentUserIdx if current seed accounts is exceeded
		if (this.currentUserIdx > this.seed.publicKeys.length - 1) {
			this.currentUserIdx = 0
		}

		const batchEntryParams = this.createRandomBatchEntryParams()
		try {
			await this.createBatchEntry(this.currentUserIdx, batchEntryParams)
			logger.info(`Submitted batchEntry for userIdx(${this.currentUserIdx})`)
			logger.info(JSON.stringify(batchEntryParams))
			this.currentUserIdx += 1 // Increment currentUserIdx
		} catch (err) {
			this.currentUserIdx += 1 // Increment currentUserIdx
			logger.warn(
				`Seed userIdx(${this.currentUserIdx}) has already entered into the round. Trying the next userIdx...`
			)
			return this.submitRandomBatchEntry()
		}
	}

	async pauseSpinRound(isPaused: boolean) {
		const tx = await this.spin.setRoundPaused(isPaused)
		const receipt = await tx.wait()
		return receipt
	}

	async concludeRound() {
		const vrfRequestId = randomHexString(256)
		const tx = await this.spin.testConcludeRound(vrfRequestId)
		const receipt = await tx.wait()
		return receipt
	}

	async setCountdown(time: number) {
		return store.service.round.setSpinCountdownTimer(time)
	}

	logCountdown(title: string) {
		logger.info(
			`[${title}]: countdown(${this.countdown} secs), deltaTime(${
				this.clock.deltaTime
			} ms), elaspedTime(${this.clock.elapsedTime / 1000} secs)`
		)
	}

	async startCountdown(_countdown: number) {
		this.clock.start()
		this.countdown = _countdown

		// @NOTE: Every 15 seconds check if player threshold has been met
		store.service.round.setSpinRoomStatus('countdown')
		this.delayedInterval = this.clock.setInterval(() => {
			if (this.countdown <= 0) {
				// Emit countdown hit 0 pubsub event
				this.delayedInterval.clear()
				this.startSpin()
				return
			}

			if (this.countdown % SEED_USER_SUBMIT_FEQUENCY === 0) {
				;(async () => {
					try {
						await this.submitRandomBatchEntry() // Submit seed user random batch entry
					} catch (err) {
						logger.error(err)
					}
				})()
			}

			// @NOTE: Probably do this every 15 seconds
			this.logCountdown('COUNTDOWN')
			this.setCountdown(this.countdown)
			this.countdown -= 1
		}, 1000)
	}

	async startSpin() {
		// Stop all batch entries
		await this.pauseSpinRound(true)
		// Change spinRoom state to 'about to spin'
		store.service.round.setSpinRoomStatus('starting')
		this.delayedInterval = this.clock.setInterval(() => {
			if (this.countdown < 0) {
				this.delayedInterval.clear()
				this.endRound()
				return
			}

			this.logCountdown('ABOUT TO SPIN')
			this.setCountdown(this.countdown)
			this.countdown -= 1
		}, INITIAL_PAUSE_ROUND_MARKER) // Wait 10 seconds before starting spin
	}

	endRound() {
		// Start spinning wheel
		store.service.round.setSpinRoomStatus('spinning')
		this.delayedTimeout = this.clock.setTimeout(async () => {
			await this.concludeRound()

			// Mint/Burn screens event
			this.delayedTimeout = this.clock.setTimeout(async () => {
				// Pubsub new round started
				// Allow batchEntries
				// Reset countdown timer
				store.service.round.setSpinRoomStatus('finished')
				this.delayedTimeout.clear()
				this.resetRound()
			}, INITIAL_DISPLAY_RESULT_DURATION * 1000) // Time for round to conclude and begin next timer
		}, INITIAL_SPIN_DURATION * 1000) // Time wheel is spinning
	}

	async resetRound() {
		this.countdown = INITIAL_FINISHED_SECS // Time duration before spin round is reset
		// PubSub countdown update
		await this.setCountdown(this.countdown)

		this.delayedInterval = this.clock.setInterval(() => {
			if (this.countdown <= 0) {
				// @NOTE: commented out because FareSpin concludeRound now handles unpausing the round
				// this.pauseSpinRound(false)
				this.clock.stop()
				this.clock.clear()
				this.delayedInterval.clear()
				this.delayedTimeout.clear()
				store.service.round.resetPearStateRound()
				this.startCountdown(INITIAL_COUNTDOWN_SECS)
				return
			}

			this.logCountdown('RESETTING ROUND')
			this.setCountdown(this.countdown)
			this.countdown -= 1
		}, 1000)
	}

	async initPearKeeper(shouldResetCountdown = true) {
		try {
			if (this.eventLoopIntervalId) clearInterval(this.eventLoopIntervalId)
			this.clock.stop()
			this.clock.clear()

			this.countdown = await store.service.round.getSpinCountdownTimer()
			if (shouldResetCountdown) {
				await this.setCountdown(INITIAL_COUNTDOWN_SECS)
				this.countdown = INITIAL_COUNTDOWN_SECS
			}

			this.clock.start()
			logger.info('Spin countdown has started!')

			// Initialize event loop interval
			this.eventLoopIntervalId = setInterval(() => {
				this.clock.tick()
			}, DEFAULT_SIMULATION_INTERVAL) // 60fps (16.66ms)

			// Ensure batch entries can be submitted
			await this.pauseSpinRound(false)

			/* Start spin event loop
			 * 1. startCountdown - Start countdown from existing countdown number in Redis
			 * 2. startSpin - Pauses batchEntries, starts 30 second timer for about to spin
			 * 3. endRound - Runs concludeRound (fetches random number), slows down wheel, lands on a color
			 * 4. resetRound - Reset countdown timer and starts back at event #1
			 */
			this.startCountdown(this.countdown)
		} catch (err) {
			clearInterval(this.eventLoopIntervalId)
			logger.error(new Error(err.toString()))
		}
	}
}

/** Used to run admin level smart contract functions */
export default new CryptoAdmin()
