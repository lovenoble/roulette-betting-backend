import { Wallet, providers, ContractTransaction, ContractReceipt, ethers } from 'ethers'
import { Clock, Delayed } from '@colyseus/core'

import CryptoToken from './token'
import CryptoSeed from './seed'
import { logger, createBatchEntry } from './utils'
import { ensureNumber } from '../utils'
import { Randomness, RandomTag } from '../../store/schema/randomness'
import {
  FareSpin,
  FareSpin__factory,
  FareToken,
  FareToken__factory,
  FlatEntry,
  FareSpinContractState,
} from '../types'
import cryptoConfig from '../../config/crypto.config'
import { randomizer } from '../../utils'
import store from '../../store'
import {
  ENTRIES_OPEN_COUNTDOWN_DURATION,
  // PRE_SPIN_DURATION,
  // WHEEL_SPINNING_DURATION,
  // SEED_USER_SUBMIT_FEQUENCY,
  RESULT_SCREEN_DURATION,
  SEC_MS,
  DEFAULT_SIMULATION_INTERVAL,
  ContractModes,
  Bytes32Zero,
} from '../constants'
import fareRandomness from '../utils/FareRandomness'
import PubSub from '../../pubsub'

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
  currentRoundId = 0
  placedUserIdxs: number[] = []
  failThreshold = 0
  targetTick: number
  revealKey: string
  randomHash: string
  fullRandomNum: string
  isRoundPaused: boolean

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

      tx = await this.spin.connect(signer).placeBatchEntry(params, {
        gasLimit: 2100000,
        gasPrice: 70000000,
      })
      receipt = await tx.wait()
      logger.info(`Submitted batch entry for Player: (${signer.address.substring(0, 11)})`)
      this.placedUserIdxs.push(userIdx)
      return receipt
    } catch (err: any) {
      logger.error(err)
    }
  }

  async settleAllPlacedEntries() {
    const promiseList = this.placedUserIdxs.map(async userId => {
      const pubKey = this.seed.publicKeys[userId]
      const signer = this.seed.signers[userId]
      logger.info(`Settling batchEntries for pubKey(${pubKey.substring(0, 11)})`)
      await this.spin.connect(signer).batchSettleEntries([this.currentRoundId], pubKey)
    })
    await Promise.all(promiseList)
    this.placedUserIdxs = []
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
            ethers.BigNumber.from(ethers.utils.randomBytes(32)).mod(contractMode.cardinality),
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

  // Reset currentUserIdx if current seed accounts is exceeded
  async submitRandomBatchEntry() {
    if (this.currentUserIdx > this.seed.publicKeys.length - 1) {
      this.currentUserIdx = 0
    }

    const batchEntryParams = this.createRandomBatchEntryParams()

    try {
      await this.createBatchEntry(this.currentUserIdx, batchEntryParams)
      logger.info(`Submitted batchEntry for userIdx(${this.currentUserIdx})`)
      logger.info(JSON.stringify(batchEntryParams))
      this.currentUserIdx += 1 // Increment currentUserIdx
      this.failThreshold = 0
    } catch (err) {
      if (this.failThreshold >= this.seed.publicKeys.length) {
        this.currentUserIdx = 0
        this.failThreshold = 0
        return
      }

      this.currentUserIdx += 1 // Increment currentUserIdx
      logger.warn(
        `Seed userIdx(${this.currentUserIdx}) has already entered into the round. Trying the next userIdx...`
      )
      this.failThreshold += 1
      return this.submitRandomBatchEntry()
    }
  }

  async pauseSpinRound(isPaused: boolean) {
    try {
      const tx = await this.spin.setRoundPaused(isPaused, {
        gasLimit: 9000000,
        gasPrice: 70000000000,
      })
      const receipt = await tx.wait()
      this.isRoundPaused = isPaused
      logger.info('Round paused successfully!')
      return receipt
    } catch (err) {
      logger.warn(String(err))
    }
  }

  async concludeRound() {
    if (!this.currentRoundId) {
      this.currentRoundId = Number(await this.spin.getCurrentRoundId())
    }
    try {
      let randomness: Partial<Randomness> = {}
      if (this.revealKey === Bytes32Zero && this.fullRandomNum === '0') {
        randomness = await store.service.randomness.getRandomess(this.currentRoundId)
      } else {
        randomness.revealKey = this.revealKey
        randomness.fullRandomNum = this.fullRandomNum
      }

      const resp = await this.spin.concludeRound(randomness.revealKey, randomness.fullRandomNum, {
        gasLimit: 9000000,
        gasPrice: 70000000000,
      })
      await resp.wait()
    } catch (err) {
      logger.warn(String(err))
    }
  }

  async startNewRound() {
    const roundId = Number(await this.spin.getCurrentRoundId())
    this.currentRoundId = roundId
    const randomness = await this.generateAndSaveRandomness(roundId)
    let resp: ContractTransaction
    try {
      resp = await this.spin.startNewRound(randomness.randomHash, {
        gasLimit: 9000000,
        gasPrice: 70000000000,
      })
      await resp.wait()
    } catch (err: any) {
      logger.warn(String(err))
      try {
        resp = await this.spin.startNewRound(randomness.randomHash, {
          gasLimit: 9000000,
          gasPrice: 70000000000,
        })
        await resp.wait()
      } catch (errs: any) {
        logger.warn(String(errs))
        try {
          resp = await this.spin.startNewRound(randomness.randomHash, {
            gasLimit: 9000000,
            gasPrice: 70000000000,
          })
          await resp.wait()
        } catch (errs2: any) {
          logger.warn(String(errs2))
        }
      }
    }
  }

  async generateAndSaveRandomness(roundId: number) {
    const randomness = await fareRandomness.generateRandomness()
    const revealKey = await fareRandomness.generateSalt()
    const randomHash = await fareRandomness.generateHash(revealKey, randomness.fullRandomNumber)
    const fullRandomNum = randomness.fullRandomNumber.toString()

    const parsedRandomness = {
      fullRandomNum,
      randomHash,
      revealKey,
      tag: RandomTag.Spin,
      roundId,
      timestamp: Date.now(),
    }
    const returnedRandomness = await store.service.randomness.createOrReturn(parsedRandomness)
    this.targetTick = Number(BigInt(returnedRandomness.fullRandomNum) % BigInt(100))
    this.revealKey = revealKey
    this.fullRandomNum = fullRandomNum

    return returnedRandomness || parsedRandomness
  }

  async determineSubmitSeedBatchEntry() {
    try {
      const currentBatchEntries = await store.service.batchEntry.getCurrentRoundBatchEntries()
      const currentBlockEntry = Number(await this.spin.getBatchEntryCount(this.currentRoundId))
      if (currentBatchEntries.length === 0 || currentBlockEntry === 0) {
        await this.submitRandomBatchEntry()
      }
    } catch (err) {
      logger.error(err)
    }
  }

  async setCountdown(ms: number) {
    const secs = ms / 1000 // Param passed in as miliseconds so we convert to seconds
    return store.service.round.setSpinCountdownTimer(secs)
  }

  logCountdown(title: string) {
    logger.info(
      `[${title}]: countdown(${this.countdown} secs), deltaTime(${
        this.clock.deltaTime
      } ms), elaspedTime(${this.clock.elapsedTime / 1000} secs)`
    )
  }

  async startCountdown(_countdown: number, shouldSendStartTx = false) {
    if (shouldSendStartTx) {
      await this.startNewRound()
    }

    await store.service.round.setSpinRoomStatus('countdown')
    this.clock.start()
    this.countdown = _countdown
    this.setCountdown(this.countdown)
    this.countdown -= SEC_MS

    setTimeout(() => {
      this.determineSubmitSeedBatchEntry().catch(logger.error)
    }, 3_000)

    this.delayedInterval = this.clock.setInterval(() => {
      if (this.countdown <= 0) {
        this.logCountdown('COUNTDOWN')
        this.setCountdown(this.countdown)
          .then(() => {
            this.delayedInterval.clear()
            this.preSpinPause()
          })
          .catch(logger.error)
        return
      }
      this.logCountdown('COUNTDOWN')
      this.setCountdown(this.countdown)
      this.countdown -= SEC_MS

      if (this.countdown <= 10_000 && this.countdown >= 7_000) {
        this.determineSubmitSeedBatchEntry().catch(logger.error)
      }

      // if (this.countdown % SEED_USER_SUBMIT_FEQUENCY === 0) {
      //   this.submitRandomBatchEntry().catch(logger.error)
      // }
    }, 1_000)
  }

  async preSpinPause() {
    try {
      // Pause round - Prevents batch entries from being submitted
      logger.info(`Pausing spin round...`)
      await store.service.round.setSpinRoomStatus('pausing')
      await this.pauseSpinRound(true)
      this.spinWheel()
    } catch (err) {
      logger.error(err)
      throw err
    }
  }

  async spinWheel() {
    await store.service.round.setSpinRoomStatus('spinning', this.targetTick)
  }

  async spinEnded() {
    logger.info('Spin round is concluding.')
    await this.concludeRound()
    logger.info('Spin round has successfully concluded!')
    await store.service.round.setSpinRoomStatus('finished')
    this.resetRound()
  }

  async resetRound() {
    logger.info('Sending startNewRound transaction to FareSpin contract...')
    await this.startNewRound()
    setTimeout(async () => {
      logger.info('New round started successfully!')
      await store.service.round.resetFareSpinStateRound()
      this.startCountdown(ENTRIES_OPEN_COUNTDOWN_DURATION, false)
    }, RESULT_SCREEN_DURATION)
  }

  async setContractProperties() {
    this.isRoundPaused = await this.spin.isRoundPaused()
    this.currentRoundId = ensureNumber(await this.spin.getCurrentRoundId())
    const currentRound = await this.spin.rounds(this.currentRoundId)
    this.revealKey = currentRound.revealKey
    this.randomHash = currentRound.randomHash
    this.fullRandomNum = currentRound.fullRandomNum.toString()

    let contractState: FareSpinContractState | undefined

    const shouldEndPrevRound =
      this.isRoundPaused && this.randomHash !== Bytes32Zero && this.revealKey === Bytes32Zero
    const shouldPauseAndEndRound =
      !this.isRoundPaused && this.randomHash !== Bytes32Zero && this.revealKey === Bytes32Zero
    const shouldStartRound =
      !this.isRoundPaused && this.randomHash === Bytes32Zero && this.revealKey === Bytes32Zero

    if (shouldEndPrevRound) {
      contractState = 'should-end-prev-round'
    } else if (shouldPauseAndEndRound) {
      contractState = 'should-pause-and-end-round'
    } else if (shouldStartRound) {
      contractState = 'should-start-round'
    }

    return contractState
  }

  async initPearKeeper(shouldResetCountdown = true) {
    try {
      if (this.eventLoopIntervalId) clearInterval(this.eventLoopIntervalId)
      this.clock.stop()
      this.clock.clear()

      // Set current contract properties
      const contractState = await this.setContractProperties()
      // Handle current state of contract
      switch (contractState) {
        case 'should-end-prev-round':
          logger.info('Should end previous round.')
          await this.concludeRound()
          break
        case 'should-pause-and-end-round':
          await this.pauseSpinRound(true)
          await this.concludeRound()
          logger.info('Should pause and end previous round.')
          break
        case 'should-start-round':
          logger.info('Should start round.')
          break
        default:
          logger.error('Unknown contract state. Exiting keeper process...')
          throw new Error('Unknown contract state')
      }

      this.countdown = await store.service.round.getSpinCountdownTimer()
      if (shouldResetCountdown) {
        await this.setCountdown(ENTRIES_OPEN_COUNTDOWN_DURATION)
        this.countdown = ENTRIES_OPEN_COUNTDOWN_DURATION
      }

      this.clock.start()
      logger.info('Spin countdown has started!')

      // Initialize event loop interval
      this.eventLoopIntervalId = setInterval(() => {
        this.clock.tick()
      }, DEFAULT_SIMULATION_INTERVAL) // 60fps (16.66ms)

      // Ensure batch entries can be submitted
      // await this.pauseSpinRound(false)

      // Bind subs
      PubSub.sub('spin-state', 'round-finished').listen((opts: any) => {
        logger.info('Round finished:', opts)
        this.spinEnded()
      })

      /* Start spin event loop
       * 1. startCountdown - Start countdown from existing countdown number in Redis
       * 2. preSpinPause - Pauses batchEntries, starts 30 second timer for about to spin
       * 3. spinAndConcludeRound - Runs concludeRound (fetches random number), slows down wheel, lands on a color
       * 4. resetRound - Reset countdown timer and starts back at event #1
       */

      this.startCountdown(this.countdown, true)
    } catch (err) {
      clearInterval(this.eventLoopIntervalId)
      logger.error(err)
    }
  }
}

const cryptoAdmin = new CryptoAdmin()

/** Used to run admin level smart contract functions */
export default cryptoAdmin
