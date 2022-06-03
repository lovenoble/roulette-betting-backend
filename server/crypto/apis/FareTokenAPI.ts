import ethers from 'ethers'

import { fareTokenContract } from '../utils'

const {
	utils: { formatEther },
} = ethers

class FareTokenAPI {
	public contract = fareTokenContract

	public getAddress(): string {
		return this.contract.address
	}

	public async getByteCode(): Promise<string> {
		return this.contract.provider.getCode(this.getAddress())
	}

	public async getTotalSupply(): Promise<number> {
		const balance = Number(formatEther(await this.contract.totalSupply()))
		return balance
	}

	public async getFareBalance(address: string): Promise<string> {
		const balance = formatEther(await this.contract.balanceOf(address))
		return balance
	}

	public async getOwnerBalance(): Promise<string> {
		const balance = await this.getFareBalance(await this.contract.owner())
		return balance
	}

	public async getAvaxBalance(address: string): Promise<string> {
		const balance = formatEther(await this.contract.provider.getBalance(address))
		return balance
	}
}

export default FareTokenAPI
