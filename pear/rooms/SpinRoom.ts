import type { Client } from '@colyseus/core'
import { Room, ServerError, Delayed } from '@colyseus/core'
import { Dispatcher } from '@colyseus/command'
import shortId from 'shortid'

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
        console.log(opt)
        this.state.roomStatus = opt.status
        if (opt.status === 'spinning') {
          setTimeout(() => this.spinWheelTicks(opt.targetTick), 3_000)
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

  async spinWheelTicks(selectedTick: number) {
    let spinTick = 0
    const incrementWheelTick = () => {
      spinTick += 1
      if (spinTick >= 100) {
        spinTick = 0
      }
      this.broadcast('SpinTick', spinTick)
    }
    // let eventLoopIntervalId = setInterval(() => {
    //   this.clock.tick()
    // }, 1000 / 60) // 60fps (16.66ms)
    // let delayedClockInterval = this.clock.setInterval(() => {
    //   spinTick += 1
    //   if (spinTick >= 100) {
    //     spinTick = 0
    //   }
    //   this.broadcast('SpinTick', spinTick)
    // }, 25)
    let intervalId: NodeJS.Timer
    let timeoutId: NodeJS.Timer

    intervalId = setInterval(incrementWheelTick, 20)
    timeoutId = setTimeout(() => {
      clearInterval(intervalId)
      intervalId = setInterval(incrementWheelTick, 30)
    }, 12_000)
    timeoutId = setTimeout(() => {
      clearInterval(intervalId)
      intervalId = setInterval(incrementWheelTick, 35)
    }, 16_500)
    timeoutId = setTimeout(() => {
      clearInterval(intervalId)
      intervalId = setInterval(incrementWheelTick, 40)
    }, 21_000)
    timeoutId = setTimeout(() => {
      clearInterval(intervalId)
      intervalId = setInterval(incrementWheelTick, 50)
    }, 24_500)
    timeoutId = setTimeout(() => {
      clearInterval(intervalId)
      intervalId = setInterval(incrementWheelTick, 70)
    }, 27_000)
    timeoutId = setTimeout(() => {
      clearInterval(intervalId)
      intervalId = setInterval(incrementWheelTick, 90)
    }, 31_500)
    timeoutId = setTimeout(() => {
      clearInterval(intervalId)
      intervalId = setInterval(() => {
        incrementWheelTick()
        console.log(Math.abs(spinTick - selectedTick))
        if (Math.abs(spinTick - selectedTick) >= 12) {
          clearInterval(intervalId)
          setInterval(() => {
            if (spinTick === selectedTick) {
              clearInterval(intervalId)
            }
          }, 150)
        }
      }, 110)
    }, 37_000)

    // let spinEndTimeout = this.clock.setTimeout(() => {
    //   // delayedClockInterval.clear()
    //   clearInterval(intervalId)
    //   PubSub.pub('spin-state', 'round-finished', { endedAt: Date.now(), randomNum: selectedTick })
    // }, 15_000)

    // return () => delayedClockInterval.clear()
  }

  incrementWheelTick(broadcast) {
    let spinTick = 0
    spinTick += 1
    if (spinTick >= 100) {
      spinTick = 0
    }
    broadcast('SpinTick', spinTick)
    return spinTick
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
