import { utils, BigNumber } from 'ethers'
import numeral from 'numeral'

export const BNToNumber = (bn: BigNumber, decimals = 0) => Number(utils.formatUnits(bn, decimals))

export const prettyNumber = (num: number | string | BigNumber, decimals = 18) => {
	if (num instanceof BigNumber) {
		const _num = utils.formatUnits(num, decimals)
		return numeral(_num).format('(0,0)')
	}

	return numeral(num).format('(0,0)')
}

export const BN = BigNumber.from
