/* eslint-disable import/no-internal-modules */
import SlackBolt from '@slack/bolt'

import { createSlackCommands } from './commands'

import { SlackBoltApp } from './types'

import Logger from '../utils/logger'

const {
	SLACK_BOT_TOKEN: token,
	SLACK_BOT_APP_TOKEN: appToken,
	SLACK_BOT_PORT: port = 4255,
	// SLACK_SIGNING_SECRET: signingSecret,
} = process.env

const App = SlackBolt.App

class SlackBot {
	#server?: SlackBoltApp

	get server() {
		return this.#server
	}

	constructor() {
		this.#server = new App({
			token,
			appToken,
			socketMode: true,
			logLevel: SlackBolt.LogLevel.WARN,
			// signingSecret,
		})
	}

	async initServer() {
		try {
			Logger.info('Initializing Slack Server Bot...')
			if (!token || !appToken) {
				Logger.info(
					'No SLACK_BOT_TOKEN or SLACK_BOT_SIGNING_SECRET present. Stopping initialization.'
				)
				return
			}
			createSlackCommands(this.#server)

			this.#server.use(async ({ next }) => {
				console.log('Incoming request')
				await next()
			})

			this.#server.use

			await this.#server.start(Number(port))
			Logger.info(`Slack Server Bot started on port ${port}...`)

			return this.#server
		} catch (err) {
			Logger.error(err)
		}
	}
}

const slackBotServer = await new SlackBot().initServer()

export default slackBotServer
