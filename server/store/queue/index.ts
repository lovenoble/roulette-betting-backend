import { Queue } from 'bullmq'

import { QueueNames } from '../constants'
import { queueDefaultOpts } from '../config'

export const fareContractEventQueue = new Queue(QueueNames.FareContractEvent, queueDefaultOpts)
export const spinContractEventQueue = new Queue(QueueNames.SpinContractEvent, queueDefaultOpts)
export const pearStateQueue = new Queue(QueueNames.PearState, queueDefaultOpts)
export const latencyQueue = new Queue(QueueNames.Latency, queueDefaultOpts)
