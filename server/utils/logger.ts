/* eslint-disable no-console */
import chalk, { Chalk } from 'chalk'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

export type Parameter = [unknown?, ...unknown[]]

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

	public info(...args: Parameter): void {
		args = [`${this.trace()} |`, ...args]
		console.info(this.logInfo(...args))
	}

	public warn(...args: Parameter): void {
		args = [`${this.trace()} |`, ...args]
		console.warn(this.logWarn(...args))
	}

	public error(...args: Parameter): void {
		args = [`${this.trace()} |`, ...args]
		console.error(this.logError(...args))
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
