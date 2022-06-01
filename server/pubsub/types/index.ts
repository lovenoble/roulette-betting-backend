import type { RedisOptions } from 'ioredis'

import { PubSubChannel } from '../constants'

export type ChannelName = 'spin-state' | 'analytics' | 'user-update'

export type PubOptions = {
	options?: RedisOptions
}

export type SubOptions = {
	channel: ChannelName | PubSubChannel
	options?: RedisOptions
}
