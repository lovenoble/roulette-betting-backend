import express from 'express'
import cors from 'cors'
import { createServer } from 'http'

import router from './routes'

// Initialize express HTTP server
export const app = express()
const server = createServer(app)

// Middleware
app.use(express.json())
app.use(cors())

// API
app.use(router)

export default server
