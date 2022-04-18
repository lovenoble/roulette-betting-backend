import { Router } from 'express'
import ContractController from './controllers/ContractController'

const router = Router()

router.get('/api/item/:id', ContractController.getItemMetadata)

export default router