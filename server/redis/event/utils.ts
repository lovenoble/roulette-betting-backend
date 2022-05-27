import ethers from 'ethers'
import type { BigNumber, BigNumberish } from 'ethers'

export const zeroAddress = '0x0000000000000000000000000000000000000000'
export const upperETHLimit = ethers.BigNumber.from('1000000000')

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

export const formatBN = (bn: BigNumberish, decimals = 0) => ethers.utils.formatUnits(bn, decimals)
export const formatETH = ethers.utils.formatEther
export const BNToNumber = (bn: BigNumber) => {
	try {
		return bn.toNumber()
	} catch (err) {
		console.error(err)
		return Number(formatBN(bn))
	}
}
export const toEth = (bn: string) => ethers.utils.parseEther(bn)
export const BN = ethers.BigNumber.from

export const checkMintBurn = (from: string, to: string) => {
	let isMintBurn = ''
	if (from === zeroAddress) {
		isMintBurn = 'mint'
	} else if (to === zeroAddress) {
		isMintBurn = 'burn'
	}

	return isMintBurn
}
