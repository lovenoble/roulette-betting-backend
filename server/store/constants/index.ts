export enum ContractNames {
	FareToken = 'FareToken',
	FareSpinGame = 'FareSpinGame',
}

export enum EventNames {
	Transfer = 'Transfer',
	EnsureBalance = 'EnsureBalance',
	GameModeUpdated = 'GameModeUpdated',
	EntrySubmitted = 'EntrySubmitted',
	EntrySettled = 'EntrySettled',
	RoundPausedChanged = 'RoundPausedChanged',
	RoundConcluded = 'RoundConcluded',
	RandomNumberRequested = 'RandomNumberRequested',
	NFTWon = 'NFTWon',
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

export const SIGNING_MESSAGE_TEXT =
	'Pear connects would like to authenticate your account. Please sign the following: '

export const USERNAME_MAX_LENGTH = 24
export const USERNAME_MIN_LENGTH = 4
