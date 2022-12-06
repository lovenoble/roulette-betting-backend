import type { Client } from '@colyseus/core'
import { Room, ServerError, Delayed } from '@colyseus/core'
import { Dispatcher } from '@colyseus/command'
import shortId from 'shortid'
import { randomizer } from '../../utils'

import type { IDefaultRoomOptions, ICreateSpinRoomOptions } from '../types'
import { HttpStatusCode, SpinEvent, MAX_SPIN_CLIENTS, WebSocketCloseCode } from '../constants'
import {
  OnBatchEntry,
  OnUserJoined,
  OnGuestUserJoined,
  OnUserLeave,
  OnFareTotalSupplyUpdated,
  OnInitSpinRoom,
  OnRoundConcluded,
  OnNewChatMessage,
  OnResetRound,
  OnBalanceUpdate,
  // OnFareTransfer,
} from '../commands'
import { SpinState } from '../state/SpinState'
import { logger } from '../utils'
import store from '../../store'
import PubSub from '../../pubsub'

class SpinContract extends Room<SpinState> {
  #name: string
  #desc: string
  #password: string | null = null
  spinTick = 0

  maxClients = MAX_SPIN_CLIENTS // @NOTE: Need to determine the number of clients where performance begins to fall off
  autoDispose = false
  dispatcher = new Dispatcher(this)
  /**
   * Using @gamestdio/timer (this.clock, Delayed)
   * Once built-in setTimeout and setInterval relies on CPU load, functions may delay an unexpected amount of time to execute.
   * Having it tied to a clock's time is guaranteed to execute in a precise way.
   */
  delayedInterval?: Delayed

  get name() {
    return this.#name
  }

  get desc() {
    return this.#desc
  }

  get password() {
    // @NOTE: Ensure password, if set, is hashed
    return this.#password
  }

  async onCreate(options: ICreateSpinRoomOptions) {
    try {
      const { name, desc, password } = options
      logger.info(`Creating new SpinRoom: name --> ${name} description --> ${desc}`)

      this.#name = name
      this.#desc = desc
      this.#password = password

      let hasPassword = false
      if (password) {
        // @NOTE: Handle hashing password before setting the metadata
        logger.info(`Password was set ${password}`)
        hasPassword = true
      }

      this.setMetadata({
        name,
        desc,
        hasPassword,
      })

      this.setState(new SpinState())

      // Initialize SpinRoom state
      await this.dispatcher.dispatch(new OnInitSpinRoom())

      // #region Client action events

      this.onMessage('*', (client, type, message) => {
        logger.info(`New client action from ${client.sessionId} - ${type} - ${message}`)
      })

      this.onMessage('Heartbeat', client => {
        console.log('Heartbeat', client.sessionId)
      })

      this.delayedInterval = this.clock.setInterval(() => {
        this.broadcast('Heartbeat', 'Heartbeat')
      }, 3000)

      this.onMessage(SpinEvent.NewChatMessage, (client, text: string) => {
        this.dispatcher.dispatch(new OnNewChatMessage(), { text, client })
      })

      // #endregion

      // #region PubSub

      // FareTransfer event (update player balances that apply)
      PubSub.sub('fare', 'fare-transfer').listen<'fare-transfer'>(transfer => {
        this.dispatcher.dispatch(new OnBalanceUpdate(), { playerAddress: transfer.to })
        this.dispatcher.dispatch(new OnBalanceUpdate(), { playerAddress: transfer.from })
        // this.dispatcher.dispatch(new OnFareTransfer(), transfer)
      })

      // FareTotalSupply updated
      PubSub.sub('fare', 'fare-total-supply-updated').listen<'fare-total-supply-updated'>(
        ({ totalSupply }) => {
          this.dispatcher.dispatch(new OnFareTotalSupplyUpdated(), totalSupply)
        },
      )

      // New BatchEntry + Entry[]
      PubSub.sub('spin-state', 'batch-entry').listen<'batch-entry'>(data => {
        this.dispatcher.dispatch(new OnBatchEntry(), data)
      })

      // Spin Round has concluded (increment round)
      PubSub.sub('spin-state', 'round-concluded').listen<'round-concluded'>(data => {
        this.dispatcher.dispatch(new OnRoundConcluded(), data)
      })

      PubSub.sub('spin-state', 'spin-round-pause').listen<'spin-round-pause'>(opt => {
        this.state.isRoundPaused = opt.isPaused
        this.broadcast(SpinEvent.TimerUpdated, opt.countdown)
      })

      PubSub.sub('spin-state', 'spin-room-status').listen<'spin-room-status'>(opt => {
        this.state.roomStatus = opt.status
        if (opt.status === 'spinning') {
          setTimeout(() => this.decrementWheelTick(), 1_200)
          setTimeout(() => this.decrementWheelTick(), 1_350)
          setTimeout(() => this.decrementWheelTick(), 1_450)
          setTimeout(() => this.decrementWheelTick(), 1_600)
          setTimeout(() => this.decrementWheelTick(), 1_750)
          setTimeout(() => this.decrementWheelTick(), 1_900)
          setTimeout(() => this.decrementWheelTick(), 2_000)
          setTimeout(() => this.decrementWheelTick(), 2_100)
          setTimeout(() => this.decrementWheelTick(), 2_150)
          setTimeout(() => this.decrementWheelTick(), 2_200)
          setTimeout(() => this.decrementWheelTick(), 2_225)
          setTimeout(() => this.decrementWheelTick(), 2_250)
          setTimeout(() => this.decrementWheelTick(), 2_275)
          setTimeout(() => this.decrementWheelTick(), 2_300)
          setTimeout(() => this.decrementWheelTick(), 2_325)
          setTimeout(() => this.decrementWheelTick(), 2_350)
          setTimeout(() => this.decrementWheelTick(), 2_375)
          setTimeout(() => this.decrementWheelTick(), 2_400)
          setTimeout(() => this.spinWheelTicks(opt.targetTick), 2_500)
        }
      })

      // PubSub.sub('spin-state', 'round-finished', opts => {
      //   console.log('round finished', opts)
      // })

      PubSub.sub('spin-state', 'countdown-updated').listen<'countdown-updated'>(time => {
        this.broadcast(SpinEvent.TimerUpdated, time)
      })

      PubSub.sub('spin-state', 'reset-spin-round').listen<'reset-spin-round'>(_message => {
        this.dispatcher.dispatch(new OnResetRound())
      })

      // #endregion
    } catch (err) {
      // @NOTE: Need better error handling here. If this fails the state doesn't get set
      logger.error(err)
      throw new ServerError(HttpStatusCode.INTERNAL_SERVER_ERROR, err.toString())
    }
  }

  incrementWheelTick() {
    this.spinTick += 1
    if (this.spinTick >= 100) {
      this.spinTick = 0
    }
    this.broadcast('SpinTick', this.spinTick)
  }

  decrementWheelTick() {
    if (this.spinTick === 0) {
      this.spinTick = 99
    } else {
      this.spinTick -= 1
    }
    this.broadcast('SpinTick', this.spinTick)
  }

  slowTick(selectedTick: number) {
    this.clock.setInterval(() => {
      this.incrementWheelTick()
      if (this.spinTick === selectedTick) {
        this.clock.stop()
        this.clock.clear()
        PubSub.pub('spin-state', 'round-finished', {
          endedAt: Date.now(),
          randomNum: selectedTick,
        })
      }
    }, 130)
  }

  intervalWheelTick(
    intervalMs: number,
    timeoutMs: number,
    delayedInterval: Delayed,
    selectedTick?: number,
  ) {
    this.clock.setTimeout(() => {
      // const randomTickSlowdown = randomizer(-18, -6)
      if (selectedTick) {
        delayedInterval.clear()
        delayedInterval = this.clock.setInterval(() => {
          this.incrementWheelTick()
          const tickDiff = this.spinTick - selectedTick
          if (tickDiff >= -12 && tickDiff <= 0) {
            // if (tickDiff >= randomTickSlowdown && tickDiff <= 0) {
            // if (Math.abs(tickDiff) <= 12) {
            delayedInterval.clear()
            this.slowTick(selectedTick)
          }
        }, 120)
        return
      }

      delayedInterval.pause()
      delayedInterval.time = intervalMs
      delayedInterval.resume()
    }, timeoutMs)
  }

  async spinWheelTicks(selectedTick: number) {
    this.clock.stop()
    this.clock.clear()
    this.clock.start(true)

    const runInterval = (
      totalTime: number,
      holdTime: number,
      slowTime: number,
      intervalCallback: () => void,
    ) => {
      // Convert total time and hold time from seconds to milliseconds
      totalTime *= 1000
      holdTime *= 1000
      slowTime *= 1000

      // Check if total time is valid (not negative)
      if (totalTime < 0) {
        throw new Error('Total time must be a non-negative number')
      }

      // Hard-code start and end interval times
      const startInterval = 25
      let endInterval = 80
      let startSlowDown = false

      const interpolate = (start: number, end: number, time: number, total: number) => {
        const num = start + (end - start) * (time / total)
        return num <= end ? num : end
      }

      let time = 0
      let slowTimeElasped = 0
      let intervalTime = startInterval
      const run = () => {
        const tickDiff = Math.abs(selectedTick + this.spinTick - 100)
        if (!startSlowDown && tickDiff <= 24 && time - holdTime >= totalTime) {
          startSlowDown = true
        }

        if (startSlowDown) {
          slowTimeElasped += intervalTime
          intervalTime = interpolate(80, 120, slowTimeElasped, slowTime)
        } else {
          time += intervalTime

          intervalTime =
            time < holdTime
              ? startInterval
              : interpolate(startInterval, endInterval, time - holdTime, totalTime)
        }

        // Call the interval callback function with the updated interval time
        intervalCallback()

        if (time - holdTime <= totalTime) {
          // If the total time has not elapsed, run the function again after the specified interval time
          setTimeout(run, intervalTime)
        } else if (startSlowDown && this.spinTick === selectedTick) {
          setTimeout(() => {
            PubSub.pub('spin-state', 'round-finished', {
              endedAt: Date.now(),
              randomNum: selectedTick,
            })
          }, 3000)
          console.log('landed on tick', selectedTick, this.spinTick)
        } else {
          setTimeout(run, intervalTime)
        }
      }

      // Start running the interval
      run()
    }
    runInterval(6, 6, 3, () => this.incrementWheelTick())

    // let delayedInterval = this.clock.setInterval(() => this.incrementWheelTick(), 25)
    // this.intervalWheelTick(30, 7_000, delayedInterval)
    // this.intervalWheelTick(35, 9_000, delayedInterval)
    // this.intervalWheelTick(40, 11_000, delayedInterval)
    // this.intervalWheelTick(45, 12_000, delayedInterval)
    // this.intervalWheelTick(50, 13_000, delayedInterval)
    // this.intervalWheelTick(55, 14_000, delayedInterval)
    // this.intervalWheelTick(60, 16_000, delayedInterval)
    // this.intervalWheelTick(65, 17_000, delayedInterval)
    // this.intervalWheelTick(70, 18_000, delayedInterval)
    // this.intervalWheelTick(85, 20_000, delayedInterval)
    // this.intervalWheelTick(100, 22_000, delayedInterval)
    // this.intervalWheelTick(110, 24_000, delayedInterval, selectedTick)
  }

  async onAuth(client: Client, options: IDefaultRoomOptions = {}) {
    try {
      const { authToken, networkUsername, networkActorNumber } = options
      // Handle authenticated user
      if (authToken) {
        const user = await store.service.user.getUserFromToken(authToken)

        if (!user) {
          logger.error(new Error('Invalid authToken. Please reauthenticate and try again.'))
          throw new ServerError(
            HttpStatusCode.UNAUTHORIZED,
            'Invalid authToken. Please reauthenticate and try again.',
          )
        }

        // @NOTE: Implement setting user data here
        client.userData = {
          authToken,
          publicAddress: user.publicAddress,
          networkUsername,
          networkActorNumber,
        }
        return user.publicAddress
      }

      // Handle guest user
      const guestId = shortId() // Generate guestId

      // @NOTE: Moved this to onGuestJoined dispatch
      // @NOTE: Implement setting user data here
      client.userData = { authToken, guestId, networkUsername, networkActorNumber }

      return `guest:${guestId}`
    } catch (err: any) {
      logger.error(err)

      setTimeout(() => client.leave(WebSocketCloseCode.POLICY_VIOLATION, (err as Error).message), 0)
      if (err instanceof Error) {
        throw new ServerError(HttpStatusCode.INTERNAL_SERVER_ERROR, err.message)
      }
    }
  }

  onJoin(client: Client, _options: IDefaultRoomOptions = {}, auth?: string) {
    try {
      const [publicAddress, guestId] = auth.split(':')

      if (guestId) {
        this.dispatcher.dispatch(new OnGuestUserJoined(), { client, guestId })
      } else if (publicAddress) {
        this.dispatcher.dispatch(new OnUserJoined(), {
          client,
          publicAddress,
        })
      } else {
        throw new ServerError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Auth token does not exist.')
      }
    } catch (err) {
      logger.error(err)
      setTimeout(() => client.leave(WebSocketCloseCode.POLICY_VIOLATION, (err as Error).message), 0)

      if (err instanceof Error) {
        throw new ServerError(HttpStatusCode.INTERNAL_SERVER_ERROR, err.message)
      }
    }
  }

  onLeave(client: Client, consented: boolean) {
    const { sessionId } = client

    this.dispatcher.dispatch(new OnUserLeave(), {
      sessionId,
      client,
      consented,
    })
  }

  onDispose() {
    this.dispatcher.stop()
    logger.info('Disposing of SpinContract room...')
  }
}

export default SpinContract
