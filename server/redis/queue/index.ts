import { Queue } from 'bullmq'

import { queueDefaultOpts } from '../config'

export enum QueueNames {
	FareContractEvent = 'FareContractEvent',
	SpinContractEvent = 'SpinContractEvent',
	PearState = 'PearState',
	Latency = 'Latency',
}

export const fareContractEventQueue = new Queue(QueueNames.FareContractEvent, queueDefaultOpts)
export const spinContractEventQueue = new Queue(QueueNames.SpinContractEvent, queueDefaultOpts)
export const pearStateQueue = new Queue(QueueNames.PearState, queueDefaultOpts)
export const latencyQueue = new Queue(QueueNames.Latency, queueDefaultOpts)
