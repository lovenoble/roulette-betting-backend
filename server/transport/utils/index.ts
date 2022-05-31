import { TextEncoder, TextDecoder } from 'util'
import { Logger } from '../../utils'

export const logger = new Logger('purple')

export const binaryDecoder = new TextDecoder('utf-8')
export const binaryEncoder = new TextEncoder()
