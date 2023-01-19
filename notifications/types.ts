import SlackBolt from '@slack/bolt'

export type SlackBoltApp = InstanceType<typeof SlackBolt.App>

export enum SlackChannels {
  MetaverseEnvLogs = 'metaverse-environment-logs',
}

export interface ISlackBot {
  server: SlackBoltApp
  channelIdMap: Map<string, string>
  token: string
  metaverseLogChannelId: string
  getIdByName: (name: string | SlackChannels) => string
  createUploadFile: (name: string, buf: string | Buffer) => void
}
