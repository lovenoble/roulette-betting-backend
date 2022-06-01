import IORedis from 'ioredis'

import { pubLogger, subLogger } from './utils'
import { ioRedisOptions } from '../config'
import { PubOptions, SubOptions, ChannelName } from './types'
import { PubSubChannel } from './constants'

export class RedisPub {
	io!: IORedis
	logger = pubLogger
	Channels = PubSubChannel

	constructor(options: PubOptions | void) {
		const { options: opts } = options || {}
		this.io = new IORedis(opts || ioRedisOptions)
		this.logger.info('New RedisPub instance created!')
	}
}

export class RedisSub {
	#channel!: ChannelName | PubSubChannel
	io!: IORedis
	logger = subLogger

	public get channel() {
		return this.#channel
	}

	constructor({ channel, options = ioRedisOptions }: SubOptions) {
		this.io = new IORedis(options)
		this.#channel = channel
		this.logger.info(`Subbed to channel: ${channel}`)
	}
}

export default new RedisPub()
