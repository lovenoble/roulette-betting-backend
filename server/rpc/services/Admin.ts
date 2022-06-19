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
import { PearHash } from '../../store/utils'
import cryptoAdmin from '../../crypto/admin'

export { AdminService } from '../models/admin'

export class Admin implements AdminServer {
	[method: string]: UntypedHandleCall

	public async createSeedAccounts(
		call: ServerUnaryCall<CreateSeedAccountsRequest, CreateSeedAccountsResponse>,
		callback: sendUnaryData<CreateSeedAccountsResponse>
	) {
		try {
			logger.info(`createSeedAccounts requested: ${Date.now()}`)
			const { authToken, count } = call.request
			const publicAddress = PearHash.getAddressFromToken(authToken)

			if (publicAddress !== '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
				return callback(
					new ServiceError(status.PERMISSION_DENIED, 'Only admins can make this request'),
					null
				)

			if (count <= 0 || count >= 100) {
				return callback(
					new ServiceError(status.INVALID_ARGUMENT, 'Max/min accounts is 0 - 100'),
					null
				)
			}
			await cryptoAdmin.seed.createSeedAccounts(count)
			const accounts = cryptoAdmin.seed.publicKeys
			const createdAccounts = accounts.slice(count * -1)

			const res: Partial<CreateSeedAccountsResponse> = {
				status: 'New seed accounts created!',
				accounts,
				createdAccounts,
			}

			return callback(null, CreateSeedAccountsResponse.fromJSON(res))
		} catch (err) {
			logger.warn('createSeedAccounts error', err.toString(), Date.now())
			return callback(new ServiceError(status.INTERNAL, err.toString()), null)
		}
	}

	public async getSeedAccounts(
		call: ServerUnaryCall<GetSeedAccountsRequest, GetSeedAccountsResponse>,
		callback: sendUnaryData<GetSeedAccountsResponse>
	) {
		try {
			logger.info(`getSeedAccounts requested: ${Date.now()}`)
			const { authToken } = call.request
			const publicAddress = PearHash.getAddressFromToken(authToken)

			if (publicAddress !== '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
				return callback(
					new ServiceError(status.PERMISSION_DENIED, 'Only admins can make this request'),
					null
				)

			const accounts = cryptoAdmin.seed.publicKeys
			const res: Partial<GetSeedAccountsResponse> = {
				status: 'Fetched seed accounts (public keys)!',
				accounts,
			}

			// // // @NOTE: Look up user by entityId and send response with values
			return callback(null, GetSeedAccountsResponse.fromJSON(res))
		} catch (err) {
			logger.warn('getSeedAccounts error', err.toString(), Date.now())
			return callback(new ServiceError(status.INTERNAL, err.toString()), null)
		}
	}

	public async createBatchEntry(
		call: ServerUnaryCall<CreateBatchEntryRequest, CreateBatchEntryResponse>,
		callback: sendUnaryData<CreateBatchEntryResponse>
	) {
		try {
			logger.info(`createBatchEntry requested: ${Date.now()}`)
			const { authToken, seedIdx } = call.request
			const publicAddress = PearHash.getAddressFromToken(authToken)

			if (publicAddress !== '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
				return callback(
					new ServiceError(status.PERMISSION_DENIED, 'Only admins can make this request'),
					null
				)

			await cryptoAdmin.createBatchEntry(seedIdx, [[10000, 0, 1]])
			const res: Partial<CreateBatchEntryResponse> = {
				status: 'Batch entry created!',
			}

			// // @NOTE: Look up user by entityId and send response with values
			return callback(null, CreateBatchEntryResponse.fromJSON(res))
		} catch (err) {
			logger.warn('createBatchEntry error', err.toString(), Date.now())
			return callback(new ServiceError(status.INTERNAL, err.toString()), null)
		}
	}

	public async settleBatchEntry(
		call: ServerUnaryCall<SettleBatchEntryRequest, SettleBatchEntryResponse>,
		callback: sendUnaryData<SettleBatchEntryResponse>
	) {
		try {
			logger.info(`settleBatchEntry requested: ${Date.now()}`)
			const { authToken, roundId, seedIdx } = call.request
			const publicAddress = PearHash.getAddressFromToken(authToken)

			if (publicAddress !== '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
				return callback(
					new ServiceError(status.PERMISSION_DENIED, 'Only admins can make this request'),
					null
				)

			await cryptoAdmin.settleBatchEntry(seedIdx, roundId)

			const res: Partial<SettleBatchEntryResponse> = {
				status: 'Settled batch entry created!',
			}

			return callback(null, SettleBatchEntryResponse.fromJSON(res))
		} catch (err) {
			logger.warn('settleBatchEntry error', err.toString(), Date.now())
			return callback(new ServiceError(status.INTERNAL, err.toString()), null)
		}
	}

	public async pauseRound(
		call: ServerUnaryCall<PauseRoundRequest, PauseRoundResponse>,
		callback: sendUnaryData<PauseRoundResponse>
	) {
		try {
			const { authToken, isPaused } = call.request
			logger.info(`pauseRound requested -> ${isPaused} -> ${Date.now()}`)
			const publicAddress = PearHash.getAddressFromToken(authToken)

			if (publicAddress !== '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
				return callback(
					new ServiceError(status.PERMISSION_DENIED, 'Only admins can make this request'),
					null
				)

			await cryptoAdmin.pauseSpinRound(isPaused)

			const res: Partial<PauseRoundResponse> = {
				status: `Round paused -> ${isPaused}`,
			}
			return callback(null, PauseRoundResponse.fromJSON(res))
		} catch (err) {
			logger.warn('pauseRound error', err.toString(), Date.now())
			return callback(new ServiceError(status.INTERNAL, err.toString()), null)
		}
	}

	public async concludeRound(
		call: ServerUnaryCall<ConcludeRoundRequest, ConcludeRoundResponse>,
		callback: sendUnaryData<ConcludeRoundResponse>
	) {
		try {
			logger.info(`concludeRound requested: ${Date.now()}`)
			const { authToken } = call.request
			const publicAddress = PearHash.getAddressFromToken(authToken)

			if (publicAddress !== '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
				return callback(
					new ServiceError(status.PERMISSION_DENIED, 'Only admins can make this request'),
					null
				)

			await cryptoAdmin.concludeRound()

			const res: Partial<ConcludeRoundResponse> = {
				status: `Round concluded`,
			}
			return callback(null, PauseRoundResponse.fromJSON(res))
		} catch (err) {
			logger.warn('concludeRound error', err.toString(), Date.now())
			return callback(new ServiceError(status.INTERNAL, err.toString()), null)
		}
	}
}
