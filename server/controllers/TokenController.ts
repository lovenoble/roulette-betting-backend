import { Request, Response } from 'express'
import { ethers } from 'ethers'

import { fareToken, fmtn } from '../pears/crypto/contracts'

export default class NFTController {
	public static async getFareBalance(req: Request, res: Response) {
		try {
			const { address } = req.params

			if (!address || !ethers.utils.isAddress(address)) {
				return res.status(500).json({ message: 'Invalid address' })
			}

			const balance = fmtn(
				await fareToken.balanceOf('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
			)

			return res.status(200).json({ balance })
		} catch (err) {
			return res.status(500).json({
				err: err.toString(),
			})
		}
	}
}
