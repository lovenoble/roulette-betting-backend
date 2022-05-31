import { TextEncoder, TextDecoder } from 'util'

import { createLog } from '../../utils'

export const log = createLog('Transport', 'lightGreen')
export const logWS = createLog('Transport', 'neonGreen', 'WS')
export const logHTTP = createLog('Transport', 'neonGreen', 'HTTP')

export const binaryDecoder = new TextDecoder('utf-8')
export const binaryEncoder = new TextEncoder()
