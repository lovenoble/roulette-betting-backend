import { SlackBoltApp } from './types'

export const createSlackCommands = (slackBoltApp: SlackBoltApp) => {
	slackBoltApp.message('hello', async ({ message, say }: any) => {
		console.log('Working')
		await say({
			blocks: [
				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: `Hey there <@${message.user}>!`,
					},
					accessory: {
						type: 'button',
						text: {
							type: 'plain_text',
							text: 'Click Me',
						},
						action_id: 'button_click',
					},
				},
			],
			text: `Hey there <@${message.user}>!`,
		})
	})

	slackBoltApp.action('button_click', async ({ body, ack, say }: any) => {
		await ack()
		await say(`<${body.user.id}> clicked the button`)
	})
}
