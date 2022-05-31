import { utils } from 'ethers'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import type { HandleCall } from '@grpc/grpc-js/build/src/server-call'
import { MethodDefinition } from '@grpc/proto-loader'

// Libraries
import store from '../../store'
import { PearHash } from '../../store/utils'
import { PROTO_PATH } from '../constants'

// @NOTE: Setup crypto directory to implement fauceting
// import { faucetFareMatic } from '../../pears/crypto'

class UserRpcService {
	protoPath = PROTO_PATH
	proto: grpc.ServiceDefinition<grpc.UntypedServiceImplementation>
	methods: grpc.UntypedServiceImplementation

	constructor() {
		const packageDefs = protoLoader.loadSync(this.protoPath, {
			keepCase: true,
			longs: String,
			enums: String,
			defaults: true,
			oneofs: true,
		})

		const { verifyToken, verifySignature, generateNonce, logout, login, create } =
			UserRpcService

		// @ts-ignore
		this.proto = grpc.loadPackageDefinition(packageDefs).player.Player.service
		this.methods = {
			create,
			login,
			logout,
			generateNonce,
			verifySignature,
			verifyToken,
		}
	}

	static generateNonce: HandleCall<any, any> = async (
		call: grpc.ServerReadableStream<any, any>,
		callback: grpc.sendUnaryData<any>
	) => {
		try {
			const { publicAddress } = call.request

			const { nonce, signingMessage } = await store.service.user.authPublicAddress(
				publicAddress
			)

			callback(null, { nonce, signingMessage })
		} catch (err) {
			callback({
				code: grpc.status.INTERNAL,
				status: grpc.status.INTERNAL,
				message: err.toString(),
			})
		}
	}

	static async verifyToken(call, callback) {
		// @NOTE Need error catching
		try {
			const { token } = call.request

			const decodedToken = await PearHash.decodeJwt(token)

			// @NOTE: Need to check if token is expired here

			if (!decodedToken.publicAddress) {
				return callback({
					code: grpc.status.PERMISSION_DENIED,
					status: grpc.status.PERMISSION_DENIED,
					message: 'Token is invalid',
				})
			}

			const playerExists = await store.service.user.playerExists(decodedToken.publicAddress)

			if (!playerExists) {
				return callback({
					code: grpc.status.PERMISSION_DENIED,
					status: grpc.status.PERMISSION_DENIED,
					message: 'Token is invalid',
				})
			}

			return callback(null, { publicAddress: decodedToken.publicAddress })
		} catch (err) {
			return callback({
				code: grpc.status.PERMISSION_DENIED,
				status: grpc.status.PERMISSION_DENIED,
				message: err.toString(),
			})
		}
	}

	static async verifySignature(call, callback) {
		try {
			const { publicAddress, signature } = call.request

			const nonceHex = await store.service.user.getUserNonce(publicAddress)
			// const msg = SIGNING_MESSAGE_TEXT + nonceHex

			const addressFromSignature = utils.verifyMessage(msg, signature)

			// Signature is valid
			if (addressFromSignature === publicAddress) {
				// @NOTES: Need to implement a verification that checks the nonce in the jwt with the nonce in the database
				// @NOTES: Need to implement token management process
				const createdJwt = await PearHash.generateJwt({
					publicAddress,
					nonce: nonceHex,
				})

				// @NOTE: faucetFareMatic HERE~!!!@#@!#!@#!
				// faucetFareMatic(publicAddress)

				return callback(null, { token: createdJwt })
			}

			// Signature is invalid
			return callback({
				code: grpc.status.PERMISSION_DENIED,
				status: grpc.status.PERMISSION_DENIED,
				message: 'Signature is invalid.',
			})
		} catch (err) {
			return callback({
				code: grpc.status.INTERNAL,
				status: grpc.status.INTERNAL,
				message: err.toString(),
			})
		}
	}

	static async create(call, callback) {
		try {
			const { publicAddress, username, password, sessionId } = call.request

			const createdUser = await store.service.user.create({
				publicAddress,
				username,
				password,
				sessionId,
			})

			callback(null, { token: createdUser._id, sessionId })
		} catch (err) {
			callback({
				code: grpc.status.INTERNAL,
				status: grpc.status.INTERNAL,
				message: err.toString(),
			})
		}
	}

	static async login(call, callback) {
		try {
			const { username, password } = call.request

			const player = await store.service.user.findByUsername(username)

			if (!player) {
				return callback({
					code: grpc.status.NOT_FOUND,
					status: grpc.status.NOT_FOUND,
					message: 'Invalid username or password',
				})
			}

			const doesPasswordMatch = await PearHash.compare(password, player.password)

			if (!doesPasswordMatch) {
				return callback({
					code: grpc.status.NOT_FOUND,
					status: grpc.status.NOT_FOUND,
					message: 'Invalid username or password',
				})
			}

			return callback(null, { token: player._id, sessionId: 'sessionId here' })
		} catch (err) {
			return callback({
				code: grpc.status.INTERNAL,
				status: grpc.status.INTERNAL,
				message: err.toString(),
			})
		}
	}

	// @NOTE: Need to add logic to remove token from the PlayerToken collection
	static logout(call, callback) {
		// call.request.token

		// Handle the request
		callback(null, { message: 'You have successfully logged out!' })
	}
}

export default new UserRpcService()
