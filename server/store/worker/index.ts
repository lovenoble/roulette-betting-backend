import { Worker } from 'bullmq'
import type { Job } from 'bullmq'
import chalk from 'chalk'

import { workerDefaultOpts } from '../../config/redis.config'
import { QueueNames, EventNames } from '../constants'
import { sleep } from '../utils'
import { processFareTransfer } from './process/fare'
import {
	processGameModeUpdated,
	processEntrySettled,
	processRoundConcluded,
	processEntrySubmitted,
} from './process/spin'

export const fareContractWorker = new Worker(
	QueueNames.FareContractEvent,
	async (job: Job) => {
		switch (job.name) {
			case EventNames.Transfer:
				return processFareTransfer(job.data)
			default:
				throw new Error(`[Worker]: Invalid eventName ${job.name}`)
		}
	},
	workerDefaultOpts
)

export const spinContractWorker = new Worker(
	QueueNames.SpinContractEvent,
	async (job: Job) => {
		console.log(`Process started: ${job.name} - ${Date.now()}`)
		switch (job.name) {
			case EventNames.GameModeUpdated:
				return processGameModeUpdated(job.data)
			case EventNames.EntrySubmitted:
				return processEntrySubmitted(job.data)
			case EventNames.RoundConcluded:
				return processRoundConcluded(job.data)
			case EventNames.EntrySettled:
				return processEntrySettled(job.data)
			default:
				throw new Error(`[Worker]: Invalid eventName ${job.name}`)
		}
	},
	workerDefaultOpts
)

const workerMap = {
	fareContractWorker,
	spinContractWorker,
}

export async function runWorkers() {
	const workerKeys = Object.keys(workerMap)

	const promiseList = workerKeys.map(async key => {
		return new Promise((resolve, reject) => {
			const worker: Worker = workerMap[key]
			worker.run()

			const maxAttempts = 10
			let attempts = 0
			while (attempts < maxAttempts) {
				if (worker.isRunning()) {
					console.log(
						chalk.hex('#1DE9B6')(
							`[${key}]: Worker started successfully! Waiting for jobs...`
						)
					)
					break
				}

				attempts += 1
				sleep(500)
			}

			if (attempts >= maxAttempts) {
				reject(new Error(`[${key}]: Worker failed to start!`))
			}

			resolve(null)
		})
	})

	await Promise.all(promiseList)
}

fareContractWorker.on('active', () => {
	console.log('FARECONTRACTWORKER ACTIVE')
})

// @NOTE: Create global error/failed listeners for workers
// fareContractWorker.on('completed', (job: Job) => console.log(job.id))
// fareContractWorker.on('failed', (job: Job) => console.log(job.id))
// fareContractWorker.on('error', console.error)

// spinContractWorker.on('completed', (job: Job) => console.log(job.id))
// spinContractWorker.on('failed', (job: Job) => console.log(job.id))
// spinContractWorker.on('error', console.error)
