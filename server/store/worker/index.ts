import { Worker } from 'bullmq'
import type { Job } from 'bullmq'
import chalk from 'chalk'

import { IServiceObj } from 'store/types'
import { workerDefaultOpts } from '../../config/redis.config'
import { QueueNames, EventNames } from '../constants'
import { sleep } from '../utils'
import createFareJobProcesses from './process/fare'
import createSpinJobProcesses from './process/spin'

export default class StoreWorker {
	fareWorker!: Worker
	spinWorker!: Worker
	process: ReturnType<typeof createFareJobProcesses> & ReturnType<typeof createSpinJobProcesses>

	constructor(service: IServiceObj) {
		this.process = {
			...createFareJobProcesses(service),
			...createSpinJobProcesses(service),
		}

		// Define workers below
		this.fareWorker = new Worker(
			QueueNames.FareContractEvent,
			this.handleFareContractJob,
			workerDefaultOpts
		)

		this.spinWorker = new Worker(
			QueueNames.SpinContractEvent,
			this.handleSpinContractJob,
			workerDefaultOpts
		)
	}

	public get list() {
		return {
			fareContractWorker: this.fareWorker,
			spinContractWorker: this.spinWorker,
		}
	}

	async handleFareContractJob(job: Job) {
		switch (job.name) {
			case EventNames.Transfer:
				return this.process.fareTransfer(job.data)
			default:
				throw new Error(`[Worker]: Invalid eventName ${job.name}`)
		}
	}

	async handleSpinContractJob(job: Job) {
		console.log(`Process started: ${job.name} - ${Date.now()}`)
		switch (job.name) {
			case EventNames.GameModeUpdated:
				return this.process.gameModeUpdated(job.data)
			case EventNames.EntrySubmitted:
				return this.process.entrySubmitted(job.data)
			case EventNames.RoundConcluded:
				return this.process.roundConcluded(job.data)
			case EventNames.EntrySettled:
				return this.process.entrySettled(job.data)
			default:
				throw new Error(`[Worker]: Invalid eventName ${job.name}`)
		}
	}

	async start() {
		const workerKeys = Object.keys(this.list)

		const promiseList = workerKeys.map(async key => {
			return new Promise((resolve, reject) => {
				const worker: Worker = this.list[key]

				worker.run()

				const maxAttempts = 10
				let attempts = 0
				while (attempts < maxAttempts) {
					if (worker.isRunning()) {
						console.log(
							chalk.hex('#F06292')(
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

	async stop() {
		const workerKeys = Object.keys(this.list)

		const promiseList = workerKeys.map(async key => {
			const worker: Worker = this.list[key]
			await worker.close()
		})

		return Promise.all(promiseList)
	}
}
