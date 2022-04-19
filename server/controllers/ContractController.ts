import { Request, Response } from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'node:fs/promises'
import nConstants from 'node:constants'

const __dirname = dirname(fileURLToPath(import.meta.url))

const metadataPath = path.join(__dirname, 'metadata')

async function exists(filePath: string): Promise<boolean> {
	try {
		await fs.access(filePath, nConstants.F_OK)
		return true
	} catch {
		return false
	}
}

const data = {
	name: 'lootbox',
	properties: [
		{
			name: 'prop1',
		},
		{
			name: 'prop2',
		},
		{
			name: 'prop3',
		},
	],
}

function createMetadata(startIdx: number, endIdx) {
	try {
		for (let idx = startIdx; idx < endIdx; idx += 1) {
			data.name = `lootbox${idx}`
			fs.writeFile(`${metadataPath}/lootbox/${idx}.json`, JSON.stringify(data), 'utf8')
		}
	} catch (err: any) {
		console.error(err)
		throw new Error(err)
	}
}

export default class ContractController {
	public static async getItemMetadata(req: Request, res: Response) {
		try {
			const [id, ext] = req.params.id.split('.')
			const itemMetadataPath = `${metadataPath}/item/${req.params.id}`

			if (Number.isNaN(Number(id))) {
				return res.status(500).json({
					message: 'Invalid id',
				})
			}

			if (ext !== 'json') {
				return res.status(500).json({
					message: 'Invalid file extension. (Must be .json)',
				})
			}

			const doesExist = await exists(itemMetadataPath)
			if (!doesExist)
				return res.status(404).json({ message: 'Item metadata does not exist.' })

			const metadata = await fs.readFile(itemMetadataPath, 'utf8')

			res.setHeader('Content-type', 'application/json')

			return res.status(200).send(metadata)
		} catch (err) {
			return res.status(500).json({
				err: err.toString(),
			})
		}
	}
}
