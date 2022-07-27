import { ISlackBot } from './types'

export const createSlackEvents = (slackBot: ISlackBot) => {
	slackBot.server.event('app_mention', async ({ payload }) => {
		console.log(payload, payload.channel == slackBot.metaverseLogChannelId)
	})
}
