import type { AppOptions } from 'uWebSockets.js'
import type { TransportOptions } from '@colyseus/uwebsockets-transport'
import { DEDICATED_COMPRESSOR_3KB } from 'uWebSockets.js'

export const webSocketOptions = {
  /* There are many common helper features */
  idleTimeout: 32,
  maxBackpressure: 1024,
  maxPayloadLength: 512,
  compression: DEDICATED_COMPRESSOR_3KB,
}

// @NOTE: Configure later (options at the bottom)
export const appOptions: AppOptions = {}

// @NOTE: Configure later (options at the bottom)
export const transportOptions: TransportOptions = {}

export const pearMonitorPort = process.env.FARE_STATE_MONITOR_PORT || 4200

// @NOTE: Used to access pear monitor dashboard
export const pearMonitorPassword = process.env.FARE_STATE_MONITOR_PASSWORD || 'pearPlay123'
