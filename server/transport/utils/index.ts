import chalk from 'chalk'
import { TextEncoder, TextDecoder } from 'util'

const logColor = chalk.hex('#B4FF9F').bold
export const log = (protocol: string, ...args: any) =>
	console.log(logColor(`[Transport(${protocol})]:`, ...args))

export const binaryDecoder = new TextDecoder('utf-8')
export const binaryEncoder = new TextEncoder()
