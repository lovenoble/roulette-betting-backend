import { Client, Repository } from 'redis-om'
import type { Schema, Entity } from 'redis-om'

// Types
import type { SchemaAdditions, Repo } from './index.types'
import { User, EventLog, GameMode, FareTransfer, Entry, BatchEntry, Round } from './schema/types'

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

import { redisUrl } from './config'
import { numify } from './utils'

interface IRepoObj {
	eventLog?: Repository<EventLog>
	gameMode?: Repository<GameMode>
	fareTransfer?: Repository<FareTransfer>
	entry?: Repository<Entry>
	batchEntry?: Repository<BatchEntry>
	round?: Repository<Round>
	user?: Repository<User>
}

export class RedisStore {
	public omUrl = `${redisUrl}/0`
	public om!: Client
	public repo: IRepoObj = {}
	public schmea = {
		user: userSchema,
		eventLog: eventLogSchema,
		gameMode: gameModeSchema,
		fareTransfer: fareTransferSchema,
		entry: entrySchema,
		batchEntry: batchEntrySchema,
		round: roundSchema,
	}

	async initClient() {
		if (this.om?.isOpen) return this.om

		this.om = await new Client().open(this.omUrl)
		this.repo.user = await this.initRepo(userSchema)
		this.repo.eventLog = await this.initRepo(eventLogSchema)
		this.repo.gameMode = await this.initRepo(gameModeSchema)
		this.repo.fareTransfer = await this.initRepo(fareTransferSchema)
		this.repo.entry = await this.initRepo(entrySchema)
		this.repo.batchEntry = await this.initRepo(batchEntrySchema)
		this.repo.round = await this.initRepo(roundSchema)

		return this.om
	}

	async initRepo<T extends Entity>(schema: Schema<T>): Promise<Repo<T>> {
		const repo = this.om.fetchRepository<T>(schema) as Repo<T>
		await repo.createIndex()

		// @NOTE: Create a save version that casts BigNumbers to numbers safely
		repo.create = async obj => {
			const newObj = numify<T>(obj as T & SchemaAdditions)
			return repo.createAndSave(newObj)
		}

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
