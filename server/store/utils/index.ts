import { utils, BigNumber } from 'ethers'
import type { Entity } from 'redis-om'

import type { SchemaAdditions } from '../types'
import { Logger } from '../../utils'

export { default as PearHash } from './PearHash'

export const logger = new Logger('brightPink')
export const workerLogger = new Logger('pink')

// Definitions
// @NOTE: A lot of these should move to the crypto directory
export const zeroAddress = '0x0000000000000000000000000000000000000000'
export const formatETH = utils.formatEther
export const formatBN = (bn: BigNumber, decimals = 0) => utils.formatUnits(bn, decimals)
export const toEth = (bn: string) => utils.parseEther(bn)
export const BN = BigNumber.from
export const upperETHLimit = BN('1000000000')

export const BNToNumber = (bn: BigNumber) => {
    try {
        return bn.toNumber()
    } catch (err) {
        console.error(err)
        return Number(formatBN(bn))
    }
}

export const ensureNumber = (val: BigNumber | number): number =>
    val instanceof BN ? BNToNumber(val as BigNumber) : (val as number)

export const sleep = (ms: any) => new Promise(resolve => setTimeout(resolve, ms))

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
            newObj.bn[key] = utils.parseUnits(String(obj[key]), 'wei')
        }
    })

    return newObj
}
