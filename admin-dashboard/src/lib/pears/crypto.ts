import { utils } from 'ethers'

export async function fromUtf8ToHex(str: string) {
    return utils.hexlify(utils.toUtf8Bytes(str))
}