import { RoomName } from '../constants'

export interface IRoomOptions {
	name: string
	desc: string
	password: string | null
}

export type RoomDef<T> = {
	name: RoomName
	def: T
	options: IRoomOptions
}
