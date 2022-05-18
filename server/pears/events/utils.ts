import ethers from 'ethers'
import type { Event, BigNumber, BigNumberish } from 'ethers'

import redisStore from '../../redis-store'

const { repo } = redisStore

export const zeroAddress = '0x0000000000000000000000000000000000000000'

export enum ContractNames {
	FareToken = 'FareToken',
	FareSpinGame = 'FareSpinGame',
}

export enum EventNames {
	Transfer = 'Transfer',
	EntrySubmitted = 'EntrySubmitted',
	EntrySettled = 'EntrySettled',
	RoundConcluded = 'RoundConcluded',
	RandomNumberRequested = 'RandomNumberRequested',
	NFTWon = 'NFTWon',
}

export const formatBN = (bn: BigNumberish, decimals = 0) => ethers.utils.formatUnits(bn, decimals)
export const formatETH = ethers.utils.formatEther
export const BNToNumber = (bn: BigNumber) => bn.toNumber()

export const gmMultiplierMap = [2, 10, 100]

export async function handleEventLog(event: Event, contractName: ContractNames): Promise<string> {
	const doesExist = await repo.eventLog
		.search()
		.where('transactionHash')
		.equals(event.transactionHash)
		.where('logIndex')
		.equals(event.logIndex)
		.returnCount()

	if (doesExist > 0) return ''

	const eventLogEntry = await repo.eventLog.createAndSave({
		contractName,
		transactionHash: event.transactionHash,
		logIndex: event.logIndex,
		event: event.event,
		topics: event.topics,
		timestamp: Date.now(),
	})

	return eventLogEntry.entityId
}

export const checkMintBurn = (from: string, to: string) => {
	let isMintBurn = ''
	if (from === zeroAddress) {
		isMintBurn = 'mint'
	} else if (to === zeroAddress) {
		isMintBurn = 'burn'
	}

	return isMintBurn
}
