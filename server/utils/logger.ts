/* eslint-disable no-console */
import chalk, { Chalk } from 'chalk'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { getPrettyTimestamp } from './timestamp'

const __filename = fileURLToPath(import.meta.url)

const { LOGLEVEL = 'INFO' } = process.env

export type Parameter = [unknown?, ...unknown[]]

const LOGTRACE = !!JSON.parse(process.env.LOGTRACE || 'true')
const LOGCOLORS = !!JSON.parse(process.env.LOGCOLORS || 'true')

const colors = {
	blue: '#0277BD',
	pink: '#AB47BC',
	brightPink: '#F900BF',
	purple: '#A760FF',
	lightGreen: '#B4FF9F',
	neonGreen: '#1DE9B6',
	royalRed: '#FF5D5D',
	regalYellow: '#F7D716',
	postiveGreen: '#14C38E',
	mexicanBrown: '#C69B7B',
	gold: '#FFC600',
}

export type LogTheme =
	| 'blue'
	| 'pink'
	| 'purple'
	| 'lightGreen'
	| 'neonGreen'
	| 'royalRed'
	| 'regalYellow'
	| 'postiveGreen'
	| 'brightPink'
	| 'mexicanBrown'
	| 'gold'

/**
 * Logger Class
 */
export class Logger {
	private readonly rootDir: string = `${process.cwd()}/`
	private readonly fileDir: string = dirname(__filename)
	colors = colors
	private logInfo: Chalk
	private logWarn: Chalk
	private logError: Chalk
	private hasTimestamp = false

	constructor(
		infoTheme: LogTheme = 'lightGreen',
		warnTheme: LogTheme = 'regalYellow',
		errorTheme: LogTheme = 'royalRed'
	) {
		this.rootDir = this.rootDir.replace('/dist', '/')
		this.logInfo = chalk.hex(colors[infoTheme]).bold
		this.logWarn = chalk.hex(colors[warnTheme]).bold
		this.logError = chalk.hex(colors[errorTheme]).bold
	}

	public setTimestamp(isOn: boolean) {
		this.hasTimestamp = isOn
	}

	public info(...args: Parameter): void {
		if (LOGLEVEL.toLowerCase() !== 'info') return

		if (LOGTRACE) {
			let traceString = `[${this.trace()}${this.#getTimestamp()}]:`
			args.unshift(traceString)
		}

		if (!LOGCOLORS) {
			console.info(...args)
		} else {
			console.info(this.logInfo(...args))
		}
	}

	public warn(...args: Parameter): void {
		if (LOGLEVEL.toLowerCase() !== 'warn' || LOGLEVEL.toLowerCase() !== 'info') return

		if (LOGTRACE) {
			let traceString = `[${this.trace()}${this.#getTimestamp()}]:`
			args.unshift(traceString)
		}

		if (!LOGCOLORS) {
			console.warn(...args)
		} else {
			console.warn(this.logWarn(...args))
		}
	}

	public error(...args: Parameter): void {
		console.error(this.logError(...args))
		if (LOGTRACE) {
			let traceString = `[${this.trace()}${this.#getTimestamp()}]:`
			args.unshift(traceString)
		}
		if (!LOGCOLORS) {
			console.error(...args)
		} else {
			console.error(this.logError(JSON.stringify(args)))
		}
	}

	#getTimestamp() {
		return this.hasTimestamp ? `|${getPrettyTimestamp('short')}` : ''
	}

	private trace(): string {
		const lines = (<string>new Error().stack).split('\n').slice(1)
		const lineMatch = /at (?:(.+)\s+)?\(?(?:(.+?):(\d+):(\d+)|([^)]+))\)?/.exec(lines[2])
		if (!lineMatch || lineMatch[2] === null || lineMatch[3] === null) {
			return ''
		}

		const fileName = lineMatch[2].replace('file:///', '/').split(this.rootDir)[1]
		const line = lineMatch[3]

		return `${fileName}:${line}`
	}
}

export const logger: Logger = new Logger() // Default logger
