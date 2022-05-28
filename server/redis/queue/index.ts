import { Queue } from 'bullmq'

import { connection } from '../config'

export enum QueueNames {
	ContractEvent = 'ContractEvent',
	PearState = 'PearState',
	Latency = 'Latency',
}

export const contractEventQueue = new Queue(QueueNames.ContractEvent, { connection })
export const pearStateQueue = new Queue(QueueNames.PearState, { connection })
export const latencyQueue = new Queue(QueueNames.Latency, { connection })
