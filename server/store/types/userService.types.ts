export interface ICreateUserOptions {
	publicAddress: string
	username?: string
	email?: string
	password?: string
	colorTheme?: string // @NOTE: Need to define enum for colorTheme
	sessionId?: string // @NOTE: If value is present, the user is actually connected to the websocket
	createdAt?: number // Unix timestamp when the user signed up
	lastAuthed?: number // Unix timestamp when the user last logged in
	nonce?: string // Nonce sent to the client for the user to sign. This value is updated every time the user authenticates.
}
