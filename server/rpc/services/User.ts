import { utils } from 'ethers'
import { status } from '@grpc/grpc-js'

import type { sendUnaryData, ServerUnaryCall, UntypedHandleCall } from '@grpc/grpc-js'

import {
	GenerateNonceRequest,
	GenerateNonceResponse,
	VerifySignatureRequest,
	VerifySignatureResponse,
	VerifyTokenRequest,
	VerifyTokenResponse,
	LogoutRequest,
	LogoutResponse,
	SetUserDataRequest,
	SetUserDataResponse,
	UserServer,
} from '../models/user'

import store from '../../store'
import { ServiceError, logger } from '../utils'
import { PearHash } from '../../store/utils'

// @NOTE: Setup crypto directory to implement fauceting
// import { faucetFareMatic } from '../../pears/crypto'

export { UserService } from '../models/user'

export class User implements UserServer {
	[method: string]: UntypedHandleCall

	public async generateNonce(
		call: ServerUnaryCall<GenerateNonceRequest, GenerateNonceResponse>,
		callback: sendUnaryData<GenerateNonceResponse>
	) {
		try {
			logger.info('generateNonce requested')
			const res: Partial<GenerateNonceResponse> = {}
			const { publicAddress } = call.request

			const { nonce, signingMessage } = await store.service.user.authPublicAddress(
				publicAddress
			)

			res.nonce = nonce
			res.signingMessage = signingMessage

			return callback(null, GenerateNonceResponse.fromJSON(res))
		} catch (err) {
			logger.error('generateNonce error', err.toString())
			return callback(new ServiceError(status.INTERNAL, err.toString()), null)
		}
	}

	public async verifyToken(
		call: ServerUnaryCall<VerifyTokenRequest, VerifyTokenResponse>,
		callback: sendUnaryData<VerifyTokenResponse>
	) {
		// @NOTE Need error catching
		try {
			logger.info('verifyToken requested')
			const { token } = call.request

			const res: Partial<VerifyTokenResponse> = {}

			const publicAddress = PearHash.getAddressFromToken(token)

			// @NOTE: Need to check if token is expired here
			// @NOTE: If token is invalid or expired send a message to client to clear out token in localStorage
			if (!publicAddress) {
				return callback(
					new ServiceError(status.PERMISSION_DENIED, 'Token is invalid'),
					null
				)
			}

			const doesExist = await store.service.user.exists(publicAddress)

			// @NOTE: Need to send message to client to redirect user to connect wallet and reverify
			if (!doesExist) {
				return callback(
					new ServiceError(status.PERMISSION_DENIED, 'User does not exist'),
					null
				)
			}

			// @NOTE: we could save a lastVerifiedAt field to update repo everytime token is verified

			res.publicAddress = publicAddress

			return callback(null, VerifyTokenResponse.fromJSON({ publicAddress }))
		} catch (err) {
			logger.error('verifyToken error', err.toString())
			return callback(new ServiceError(status.INTERNAL, err.toString()), null)
		}
	}

	public async verifySignature(
		call: ServerUnaryCall<VerifySignatureRequest, VerifySignatureResponse>,
		callback: sendUnaryData<VerifySignatureResponse>
	) {
		try {
			logger.info('verifySignature requested')

			const res: Partial<VerifySignatureResponse> = {}
			const { publicAddress, signature } = call.request

			const { nonce, signingMessage } = await store.service.user.getUserNonce(publicAddress)

			const addressFromSignature = utils.verifyMessage(signingMessage, signature)

			// Signature is valid
			if (addressFromSignature === publicAddress) {
				const createdJwt = PearHash.generateJwt({
					publicAddress,
					nonce,
				})

				// Update user lastAuthed timestamp
				await store.service.user.userAuthed(addressFromSignature)

				// @NOTE: Generate unique sessionId and update userEntity here

				// @NOTE: faucetFareMatic HERE~!!!@#@!#!@#!
				// faucetFareMatic(publicAddress)
				res.token = createdJwt
				return callback(null, VerifySignatureResponse.fromJSON({ token: createdJwt }))
			}

			// Signature is invalid
			return callback(
				new ServiceError(status.PERMISSION_DENIED, 'Signature is invalid'),
				null
			)
		} catch (err) {
			logger.error('verifySignature error', err.toString())
			return callback(new ServiceError(status.INTERNAL, err.toString()), null)
		}
	}

	public async logout(
		call: ServerUnaryCall<LogoutRequest, LogoutResponse>,
		callback: sendUnaryData<LogoutResponse>
	) {
		try {
			logger.info('logout requested')
			const { token } = call.request

			const res: Partial<LogoutResponse> = {}

			const decodedToken = PearHash.decodeJwt(token)
			// @NOTE: Need to check if token is expired here
			// @NOTE: If token is invalid or expired send a message to client to clear out token in localStorage
			if (!decodedToken.publicAddress) {
				return callback(
					new ServiceError(status.PERMISSION_DENIED, 'Token is invalid'),
					null
				)
			}

			const doesExist = await store.service.user.exists(decodedToken.publicAddress)

			// @NOTE: Need to send message to client to redirect user to connect wallet and reverify
			if (!doesExist) {
				return callback(
					new ServiceError(status.PERMISSION_DENIED, 'User does not exist'),
					null
				)
			}

			// @NOTE: Need to add logic to invalidate the previous JWT token
			await store.service.user.logout(decodedToken.publicAddress)

			res.message = 'User has been successfully logged out'

			return callback(null, LogoutResponse.fromJSON(res))
		} catch (err) {
			logger.error('logout error', err.toString())
			return callback(new ServiceError(status.INTERNAL, err.toString()), null)
		}
	}

	public async setUserData(
		call: ServerUnaryCall<SetUserDataRequest, SetUserDataResponse>,
		callback: sendUnaryData<SetUserDataResponse>
	) {
		try {
			logger.info('setUserData requested')
			const { token, username, email, colorTheme } = call.request

			const res: Partial<SetUserDataResponse> = {}

			const publicAddress = PearHash.getAddressFromToken(token)

			await store.service.user.setUserData(publicAddress, {
				username,
				email,
				colorTheme,
			})

			res.message = 'User data has been updated.'

			return callback(null, SetUserDataResponse.fromJSON(res))
		} catch (err) {
			logger.error('setUserData error', err.toString())
			return callback(new ServiceError(status.INTERNAL, err.toString()), null)
		}
	}
}
