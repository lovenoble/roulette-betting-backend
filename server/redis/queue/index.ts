import { Queue } from 'bullmq'

export enum QueueNames {
	ContractEvent = 'ContractEvent',
	PearState = 'PearState',
	Latency = 'Latency',
}

export const contractEventQueue = new Queue(QueueNames.ContractEvent)
export const pearStateQueue = new Queue(QueueNames.PearState)
export const latencyQueue = new Queue(QueueNames.Latency)
