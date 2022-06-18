import { utils, BigNumber } from 'ethers'

import { Logger } from '../../../utils'
import type { FlatEntry } from '../../types'

export const logger = Logger.create({ logType: 'CryptoAdmin', theme: ['palePink'] })

export const BN = BigNumber.from

export function createEntry(amount: number, gameModeId: 0 | 1 | 2, pickedNumber: number) {
	return {
		amount: utils.parseEther(amount.toString()),
		gameModeId: BN(gameModeId),
		pickedNumber: BN(pickedNumber),
	}
}

export function createBatchEntry(entries: FlatEntry[]) {
	return entries.map(entry => createEntry(...entry))
}

/* eslint-disable */
export function randomHexString(bits: number) {
	if (bits === undefined) {
		bits = 64
	}

	if (!Number.isInteger(bits) || bits < 1) {
		throw new Error('Invalid number of bits to generate. Bits must be a positive integer.')
	}

	const nibbles = Math.floor(bits / 4)
	const remainder = bits % 4
	let hex = ''

	if (remainder) {
		hex = Math.floor(Math.random() * (1 << remainder)).toString(16)
	}

	for (let i = 0; i < nibbles; i++) {
		hex += Math.floor(Math.random() * 15).toString(16)
	}

	return `0x${hex}`
}
