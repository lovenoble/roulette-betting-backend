export enum ContractNames {
	FareToken = 'FareToken',
	FareSpin = 'FareSpin',
}

export enum EventNames {
	Transfer = 'Transfer',
	EnsureBalance = 'EnsureBalance',
	ContractModeUpdated = 'ContractModeUpdated',
	EntrySubmitted = 'EntrySubmitted',
	EntrySettled = 'EntrySettled',
	RoundPausedChanged = 'RoundPausedChanged',
	RoundConcluded = 'RoundConcluded',
	RandomNumberRequested = 'RandomNumberRequested',
	NFTMint = 'NFTMint',
}

export enum QueueNames {
	FareContractEvent = 'FareContractEvent',
	SpinContractEvent = 'SpinContractEvent',
	User = 'User',
}

export enum GlobalRedisKey {
	FareTotalSupply = 'FareTotalSupply',
	CurrentRoundId = 'CurrentRoundId',
	IsSpinRoundPaused = 'IsSpinRoundPaused',
	SpinCountdownTimer = 'SpinCountdownTimer',
	SpinRoomStatus = 'SpinRoomStatus',
}

export const SIGNING_MESSAGE_TEXT = `Fareplay.io would like to authenticate your account.
Please sign the following: `

export const USERNAME_MAX_LENGTH = 24
export const USERNAME_MIN_LENGTH = 4
