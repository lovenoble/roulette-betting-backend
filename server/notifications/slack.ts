/* eslint-disable import/no-internal-modules */
import SlackBolt from '@slack/bolt'

import { createSlackCommands } from './commands'
import { createSlackEvents } from './events'
import { SlackBoltApp, ISlackBot, SlackChannels } from './types'

const {
	SLACK_OAUTH_TOKEN: token,
	SLACK_APP_TOKEN: appToken,
	SLACK_BOT_PORT: port = 4255,
} = process.env

const App = SlackBolt.App

class SlackBot implements ISlackBot {
	#server?: SlackBoltApp
	channelIdMap = new Map<string, string>()
	isConnected = false

	get server() {
		return this.#server
	}

	get token() {
		return token
	}

	get metaverseLogChannelId() {
		return this.channelIdMap.get(SlackChannels.MetaverseEnvLogs)
	}

	constructor() {
		this.#server = new App({
			token,
			appToken,
			socketMode: true,
			logLevel: SlackBolt.LogLevel.WARN,
		})
	}

	async initServer() {
		try {
			console.info('Initializing Slack Server Bot...')
			if (!token || !appToken) {
				console.info(
					'No SLACK_BOT_TOKEN or SLACK_BOT_SIGNING_SECRET present. Stopping initialization.'
				)
				return
			}

			// Initialize Slack Bot Server
			await this.server.start(Number(port))
			this.isConnected = true
			console.info(`Slack Server Bot started on port ${port}...`)

			// Populate channelName: channelId Map
			await this.populateChannelIdMap()

			// Create interactions
			createSlackCommands(this)
			createSlackEvents(this)

			return this.#server
		} catch (err) {
			this.isConnected = false
			console.error(err)
		}
	}

	async populateChannelIdMap() {
		try {
			const result = await this.server.client.conversations.list({
				token,
			})

			for (const channel of result.channels) {
				this.channelIdMap.set(channel.name, channel.id)
			}
		} catch (err) {
			console.error(err)
		}
	}

	getIdByName(name: string | SlackChannels) {
		return this.channelIdMap.get(name)
	}

	async sendChannelMessage(
		text: string,
		channelName: string | SlackChannels = SlackChannels.MetaverseEnvLogs
	) {
		try {
			const channel = this.channelIdMap.get(channelName)
			if (!channel) {
				throw new Error('Channel name not found')
			}

			const result = await this.server.client.chat.postMessage({
				token,
				channel,
				text,
			})

			console.log(result)
		} catch (err) {
			console.error(err)
		}
	}

	async createUploadFile(fileName: string, buf: string | Buffer) {
		try {
			let fileBuffer = buf
			if (!(fileBuffer instanceof Buffer)) {
				fileBuffer = Buffer.from(buf as string, 'utf8')
			}
			await this.server.client.files.upload({
				channels: this.metaverseLogChannelId,
				title: 'Error Message',
				initial_comment: 'Error output:',
				content: `${fileName}.json`,
				filename: `${fileName}.json`,
				filetype: 'json',
				file: fileBuffer,
			})
		} catch (err) {
			console.error(err)
		}
	}
}

const slackBotServer = new SlackBot()
await slackBotServer.initServer()

export default slackBotServer
