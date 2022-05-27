import { Queue } from 'bullmq'

export enum QueueNames {
	ContractEvent = 'ContractEvent',
	PearState = 'PearState',
	Latency = 'Latency',
}

const connection = {
	host: 'localhost',
	port: 6379,
}

export const contractEventQueue = new Queue(QueueNames.ContractEvent, { connection })
export const pearStateQueue = new Queue(QueueNames.PearState, { connection })
export const latencyQueue = new Queue(QueueNames.Latency, { connection })
