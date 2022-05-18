import { Client } from 'redis-om'
import type { Schema, Entity, Repository } from 'redis-om'

// Schemas
import {
	eventLogSchema,
	fareTransferSchema,
	entrySchema,
	batchEntrySchema,
	roundSchema,
} from './schema'
import { EventLog, FareTransfer, Entry, BatchEntry, Round } from './schema/types'

const { REDIS_URL } = process.env

interface IRepoObj {
	eventLog?: Repository<EventLog>
	fareTransfer?: Repository<FareTransfer>
	entry?: Repository<Entry>
	batchEntry?: Repository<BatchEntry>
	round?: Repository<Round>
}

export class RedisStore {
	public omUrl = `${REDIS_URL}/0`
	public om!: Client
	public repo: IRepoObj = {}
	public schmea = {
		eventLog: eventLogSchema,
		fareTransfer: fareTransferSchema,
		entry: entrySchema,
		batchEntry: batchEntrySchema,
		round: roundSchema,
	}

	async initClient() {
		if (this.om?.isOpen) return this.om

		this.om = await new Client().open(this.omUrl)
		this.repo.eventLog = await this.initRepo(eventLogSchema)
		this.repo.fareTransfer = await this.initRepo(fareTransferSchema)
		this.repo.entry = await this.initRepo(entrySchema)
		this.repo.batchEntry = await this.initRepo(batchEntrySchema)
		this.repo.round = await this.initRepo(roundSchema)

		return this.om
	}

	async initRepo<T extends Entity>(schema: Schema<T>): Promise<Repository<T>> {
		const repo = this.om.fetchRepository<T>(schema)
		await repo.createIndex()
		return repo
	}

	async disconnectAll() {
		if (this.om?.isOpen) {
			await this.om.close()
		}
	}
}

const redisStore = new RedisStore()

await redisStore.initClient()

export default redisStore
