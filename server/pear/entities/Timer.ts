import { Schema, type } from '@colyseus/schema'
import dayjs from 'dayjs'

export interface ITimer {
	runTimeMs: number
	elapsedTime: number
	timeDisplay: string
	paused: boolean
	isFinished: boolean
}

export class Timer extends Schema implements ITimer {
	@type('number') runTimeMs = dayjs().add(500_000, 'ms').unix()
	@type('number') elapsedTime = dayjs().unix()
	@type('string') timeDisplay = '---'
	@type('boolean') paused = false
	@type('boolean') isFinished = false

	constructor(options?: ITimer) {
		super()
		if (!options) return
		this.runTimeMs = options.runTimeMs
		this.elapsedTime = options.elapsedTime
		this.timeDisplay = options.timeDisplay
		this.paused = options.paused
		this.isFinished = options.isFinished
	}
}
