import { Repository } from 'redis-om'
import type { Entity } from 'redis-om'

export type Diff<T extends keyof any, U extends keyof any> = ({ [P in T]: P } & {
	[P in U]: never
} & {
	[x: string]: never
})[T]
export type Overwrite<T, U> = Pick<T, Diff<keyof T, keyof U>> & U

export interface SchemaAdditions {
	ethFields: string[]
	timestamp: number
}

export abstract class Repo<T extends Entity> extends Repository<T> {
	create: (obj: T) => Promise<T>
}
