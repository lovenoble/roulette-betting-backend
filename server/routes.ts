import { Router } from 'express'

import NFTController from './controllers/NFTController'
import TokenController from './controllers/TokenController'

const router = Router()

// Token routes
router.get('/api/fare/balance/:address', TokenController.getFareBalance)

// NFT routes
router.get('/api/item/:id', NFTController.getItemMetadata)
router.get('/api/nft/breakdown', NFTController.getNftBreakdown)

export default router