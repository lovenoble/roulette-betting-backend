import { Queue } from 'bullmq'

import { QueueNames } from '../constants'
import { queueDefaultOpts } from '../../config'

export class StoreQueue {
	fareContract = new Queue(QueueNames.FareContractEvent, queueDefaultOpts)
	spinContract = new Queue(QueueNames.SpinContractEvent, queueDefaultOpts)
	pearState = new Queue(QueueNames.PearState, queueDefaultOpts)
	latency = new Queue(QueueNames.Latency, queueDefaultOpts)
}

export default new StoreQueue()
