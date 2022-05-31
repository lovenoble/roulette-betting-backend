import chalk from 'chalk'

const colorThemes = {
	blue: '#0277BD',
	pink: '#AB47BC',
	purple: '#A760FF',
	lightGreen: '#B4FF9F',
	neonGreen: '#1DE9B6',
}

export function createLog(
	topic: string,
	theme: 'blue' | 'pink' | 'purple' | 'lightGreen' | 'neonGreen',
	topicParam?: string
) {
	const logColor = chalk.hex(colorThemes[theme]).bold
	const logTopic = topicParam ? `[${topic}(${topicParam})]:` : `[${topic}]:`

	return (...args: any) => console.log(logColor(logTopic, ...args))
}
