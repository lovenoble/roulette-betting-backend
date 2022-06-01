import { LoggerOptions as WinstonLoggerOptions } from 'winston'

export type LogType =
	| 'Global'
	| 'Pear'
	| 'RPC'
	| 'RedisStore'
	| 'Transport'
	| 'Worker'
	| 'Queue'
	| 'PubSub'
	| 'Crypto'

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

export type LoggerOptions = {
	logType: LogType
	theme?: [LogTheme, LogTheme?, LogTheme?]
} & WinstonLoggerOptions
