import { Client } from 'redis-om'

import StoreWorker from './worker'
import SmartContractListener from './listener'
import { logger } from './utils'
import storeQueue, { StoreQueue } from './queue'
import {
	BatchEntryService,
	EntryService,
	EventLogService,
	FareTransferService,
	GameModeService,
	RoundService,
	UserService,
} from './service'
import { IRepoObj, IServiceObj } from './types'

// Schemas
import {
	userSchema,
	eventLogSchema,
	gameModeSchema,
	fareTransferSchema,
	entrySchema,
	batchEntrySchema,
	roundSchema,
} from './schema'

import { redisUri, redisStoreUri } from '../config'

export class RedisStore {
	redisBaseUri = redisUri
	omUrl = redisStoreUri
	om!: Client
	repo: IRepoObj = {}
	service: IServiceObj = {}
	queue!: StoreQueue
	worker!: StoreWorker
	listener!: SmartContractListener

	async initialize() {
		if (this.om?.isOpen) return this.om

		this.om = await new Client().open(this.omUrl)
		logger.info('Connection to RedisStore established!')

		await this.initServices()
		logger.info('Services have been constructed!')

		await this.initRepos(this.om)
		const repoCount = Object.keys(this.repo).length
		logger.info(`Repos, Entities, and Indexes validated! (${repoCount} repos)`)

		logger.info(`RedisStore initialization finished!`)

		return this.om
	}

	private async initRepos(om: Client) {
		this.repo.eventLog = await this.service.eventLog.init(om, eventLogSchema)
		this.repo.gameMode = await this.service.gameMode.init(om, gameModeSchema)
		this.repo.fareTransfer = await this.service.fareTransfer.init(om, fareTransferSchema)
		this.repo.entry = await this.service.entry.init(om, entrySchema)
		this.repo.batchEntry = await this.service.batchEntry.init(om, batchEntrySchema)
		this.repo.round = await this.service.round.init(om, roundSchema)
		this.repo.user = await this.service.user.init(om, userSchema)
	}

	private async initServices() {
		this.service.eventLog = new EventLogService()
		this.service.gameMode = new GameModeService()
		this.service.fareTransfer = new FareTransferService()
		this.service.entry = new EntryService()
		this.service.batchEntry = new BatchEntryService(this.service.entry)
		this.service.round = new RoundService(
			this.service.gameMode,
			this.service.batchEntry,
			this.service.entry
		)
		this.service.user = new UserService()
	}

	async initQueue() {
		if (!this.queue) {
			this.queue = storeQueue
			logger.info(`StoreQueues have been initialized!`)
		}

		if (!this.worker) {
			this.worker = new StoreWorker(this.service)
			await this.worker.start()
			const storeWorkerCount = Object.keys(this.worker.list).length
			logger.info(`StoreWorkers are up and running! (${storeWorkerCount} workers)`)
		}
	}

	async initSmartContractListeners() {
		this.listener = new SmartContractListener(this.service, this.queue)
		await this.listener.start()
		logger.info(`Smart contract listeners started! (${this.listener.listenerCount} listeners)`)
	}

	async disconnectAll() {
		if (this.om?.isOpen) {
			await this.om.close()
		}
	}
}

const redisStore = new RedisStore()

export default redisStore
