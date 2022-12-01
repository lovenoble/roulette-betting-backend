import { providers, utils, BigNumber } from 'ethers'
import numeral from 'numeral'

import type { FlatEntry } from '../types'
import { Logger } from '../../utils'

export const logger = Logger.create({ logType: 'Crypto', theme: ['gold'] })

export const BNToNumber = (bn: BigNumber, decimals = 0) => Number(utils.formatUnits(bn, decimals))

export const prettyNumber = (num: number | string | BigNumber, decimals = 18) => {
  if (num instanceof BigNumber) {
    const _num = utils.formatUnits(num, decimals)
    return numeral(_num).format('(0,0)')
  }

  return numeral(num).format('(0,0)')
}

export const BN = BigNumber.from

export const ensureNumber = (val: BigNumber | number): number =>
  val instanceof BN ? BNToNumber(val as BigNumber) : (val as number)

export function createEntry(amount: number, contractModeId: 0 | 1 | 2, pickedNumber: number) {
  return {
    amount: utils.parseEther(amount.toString()),
    contractModeId: BN(contractModeId),
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

export const getRevertedReason = async (
  transtionHash: string,
  provider: providers.JsonRpcProvider,
) => {
  const tx = await provider.getTransaction(transtionHash)
  try {
    let code = await provider.call(tx, tx.blockNumber)
    return code
  } catch (err: any) {
    const code = err.data.replace('Reverted ', '')
    console.log({ err })
    let reason = utils.toUtf8String('0x' + code.substr(138))
    console.log('revert reason:', reason)
    return reason
  }
}
