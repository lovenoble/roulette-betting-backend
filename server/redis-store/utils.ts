import ethers, { BigNumber } from 'ethers'
import type { Entity } from 'redis-om'
import { SchemaAdditions } from './index.types'

export const upperETHLimit = BigNumber.from('1000000000')
export const formatETH = ethers.utils.formatEther
export const formatBN = (bn: BigNumber) => ethers.utils.formatUnits(bn, 0)

export function numify<T extends Entity>(obj: T & SchemaAdditions) {
	const newObj: any = {}

	if (!obj.timestamp) newObj.timestamp = Date.now()

	Object.keys(obj).forEach(key => {
		const val = obj[key]
		if (val instanceof BigNumber) {
			if (val.gt(upperETHLimit)) {
				newObj[key] = formatETH(obj[key])
			} else {
				newObj[key] = formatBN(obj[key])
			}
		} else {
			newObj[key] = obj[key]
		}
	})

	return newObj
}

export function bnify<T extends Entity>(obj: T & SchemaAdditions, includeKeys: string[] = []) {
	const newObj: any = Object.assign(obj, {
		bn: {},
	})
	const keys = [...includeKeys, ...obj.ethFields]
	keys.forEach(key => {
		if (obj[key]) {
			newObj.bn[key] = ethers.utils.parseUnits(String(obj[key]), 'wei')
		}
	})

	return newObj
}
