import { status } from '@grpc/grpc-js'
import type { sendUnaryData, ServerUnaryCall, UntypedHandleCall } from '@grpc/grpc-js'

import {
	AdminServer,
	CreateBatchEntryRequest,
	CreateBatchEntryResponse,
	SettleBatchEntryRequest,
	SettleBatchEntryResponse,
	PauseRoundRequest,
	PauseRoundResponse,
	ConcludeRoundRequest,
	ConcludeRoundResponse,
	GetSeedAccountsRequest,
	GetSeedAccountsResponse,
	CreateSeedAccountsRequest,
	CreateSeedAccountsResponse,
} from '../models/admin'

import { ServiceError, logger } from '../utils'
import { authAdminToken } from '../utils/auth'
import CryptoAdmin from '../../crypto/admin'

export { AdminService } from '../models/admin'

// @NOTE: Only run on local and testnet DO NOT RUN IN PRODUCTION
// Create instance of seed accounts and populate
if (process.env.NODE_ENV === 'development') {
	await CryptoAdmin.init()
}

export class Admin implements AdminServer {
	[method: string]: UntypedHandleCall

	public async createSeedAccounts(
		call: ServerUnaryCall<CreateSeedAccountsRequest, CreateSeedAccountsResponse>,
		callback: sendUnaryData<CreateSeedAccountsResponse>,
	) {
		try {
			logger.info(`createSeedAccounts requested @TIME: ${Date.now()}`)
			const { token, count } = call.request

			if (!authAdminToken(callback, token)) return

			if (count <= 0 || count >= 100) {
				return callback(
					new ServiceError(status.INVALID_ARGUMENT, 'Max/min accounts is 0 - 100'),
					null,
				)
			}
			await CryptoAdmin.seed.createSeedAccounts(count)
			const accounts = CryptoAdmin.seed.publicKeys
			const createdAccounts = accounts.slice(count * -1)

			const res: Partial<CreateSeedAccountsResponse> = {
				status: 'New seed accounts created!',
				accounts,
				createdAccounts,
			}

			return callback(null, CreateSeedAccountsResponse.fromJSON(res))
		} catch (err) {
			logger.warn(`createSeedAccounts error: ${err.toString()}, @TIME: ${Date.now()}`)
			return callback(new ServiceError(status.INTERNAL, err.toString()), null)
		}
	}

	public async getSeedAccounts(
		call: ServerUnaryCall<GetSeedAccountsRequest, GetSeedAccountsResponse>,
		callback: sendUnaryData<GetSeedAccountsResponse>,
	) {
		try {
			logger.info(`getSeedAccounts requested @TIME: ${Date.now()}`)
			const { token } = call.request

			if (!authAdminToken(callback, token)) return

			const accounts = CryptoAdmin.seed.publicKeys
			const res: Partial<GetSeedAccountsResponse> = {
				status: 'Fetched seed accounts (public keys)!',
				accounts,
			}

			// // // @NOTE: Look up user by entityId and send response with values
			return callback(null, GetSeedAccountsResponse.fromJSON(res))
		} catch (err) {
			logger.warn(`getSeedAccounts error: ${err.toString()}, @TIME: ${Date.now()}`)
			return callback(new ServiceError(status.INTERNAL, err.toString()), null)
		}
	}

	public async createBatchEntry(
		call: ServerUnaryCall<CreateBatchEntryRequest, CreateBatchEntryResponse>,
		callback: sendUnaryData<CreateBatchEntryResponse>,
	) {
		try {
			logger.info(`createBatchEntry requested @TIME: ${Date.now()}`)
			const { token, seedIdx } = call.request

			if (!authAdminToken(callback, token)) return

			await CryptoAdmin.createBatchEntry(seedIdx, [[10000, 0, 1]])
			const res: Partial<CreateBatchEntryResponse> = {
				status: 'Batch entry created!',
			}

			// // @NOTE: Look up user by entityId and send response with values
			return callback(null, CreateBatchEntryResponse.fromJSON(res))
		} catch (err) {
			logger.warn(`createBatchEntry error: ${err.toString()}, @TIME: ${Date.now()}`)
			return callback(new ServiceError(status.INTERNAL, err.toString()), null)
		}
	}

	public async settleBatchEntry(
		call: ServerUnaryCall<SettleBatchEntryRequest, SettleBatchEntryResponse>,
		callback: sendUnaryData<SettleBatchEntryResponse>,
	) {
		try {
			logger.info(`settleBatchEntry requested @TIME: ${Date.now()}`)
			const { token, roundId, seedIdx } = call.request

			if (!authAdminToken(callback, token)) return

			await CryptoAdmin.settleBatchEntry(seedIdx, roundId)

			const res: Partial<SettleBatchEntryResponse> = {
				status: 'Settled batch entry created!',
			}

			return callback(null, SettleBatchEntryResponse.fromJSON(res))
		} catch (err) {
			logger.warn(`settleBatchEntry error: ${err.toString()}, @TIME: ${Date.now()}`)
			return callback(new ServiceError(status.INTERNAL, err.toString()), null)
		}
	}

	public async pauseRound(
		call: ServerUnaryCall<PauseRoundRequest, PauseRoundResponse>,
		callback: sendUnaryData<PauseRoundResponse>,
	) {
		try {
			const { token, isPaused } = call.request
			logger.info(`pauseRound requested: ${isPaused}, @TIME: ${Date.now()}`)

			if (!authAdminToken(callback, token)) return

			await CryptoAdmin.pauseSpinRound(isPaused)

			const res: Partial<PauseRoundResponse> = {
				status: `Round paused -> ${isPaused}`,
			}
			return callback(null, PauseRoundResponse.fromJSON(res))
		} catch (err) {
			logger.warn(`pauseRound error: ${err.toString()}, @TIME: ${Date.now()}`)
			return callback(new ServiceError(status.INTERNAL, err.toString()), null)
		}
	}

	public async concludeRound(
		call: ServerUnaryCall<ConcludeRoundRequest, ConcludeRoundResponse>,
		callback: sendUnaryData<ConcludeRoundResponse>,
	) {
		try {
			logger.info(`concludeRound requested @TIME: ${Date.now()}`)
			const { token } = call.request

			if (!authAdminToken(callback, token)) return

			await CryptoAdmin.concludeRound()

			const res: Partial<ConcludeRoundResponse> = {
				status: `Round concluded`,
			}
			return callback(null, PauseRoundResponse.fromJSON(res))
		} catch (err) {
			logger.warn(`concludeRound error: ${err.toString()}, @TIME: ${Date.now()}`)
			return callback(new ServiceError(status.INTERNAL, err.toString()), null)
		}
	}
}
