export enum ContractNames {
	FareToken = 'FareToken',
	FareSpinGame = 'FareSpinGame',
}

export enum EventNames {
	Transfer = 'Transfer',
	GameModeUpdated = 'GameModeUpdated',
	EntrySubmitted = 'EntrySubmitted',
	EntrySettled = 'EntrySettled',
	RoundConcluded = 'RoundConcluded',
	RandomNumberRequested = 'RandomNumberRequested',
	NFTWon = 'NFTWon',
}

export enum QueueNames {
	FareContractEvent = 'FareContractEvent',
	SpinContractEvent = 'SpinContractEvent',
	PearState = 'PearState',
	Latency = 'Latency',
}

export const SIGNING_MESSAGE_TEXT =
	'Pear connects would like to authenticate your account. Please sign the following: '

export const USERNAME_MAX_LENGTH = 24
export const USERNAME_MIN_LENGTH = 4
