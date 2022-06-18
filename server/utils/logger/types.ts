import { LoggerOptions as WinstonLoggerOptions } from 'winston'

export type LogType =
	| 'Crypto'
	| 'Global'
	| 'Pear'
	| 'Pub'
	| 'Queue'
	| 'RPC'
	| 'RedisStore'
	| 'Sub'
	| 'Transport'
	| 'Worker'
	| 'Crypto'
	| 'CryptoAdmin'

export type LogTheme =
	| 'blue'
	| 'pink'
	| 'palePink'
	| 'purple'
	| 'lightGreen'
	| 'neonGreen'
	| 'royalRed'
	| 'regalYellow'
	| 'postiveGreen'
	| 'brightPink'
	| 'mexicanBrown'
	| 'gold'

export type LoggerOptions = {
	logType: LogType
	theme?: [LogTheme, LogTheme?, LogTheme?]
} & WinstonLoggerOptions
