import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { utils } from 'ethers'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

// Libraries
import PlayerDBService from '../../store/services/Player'
import PearHash from '../../pears/utils/PearHash'
import { faucetFareMatic } from '../../pears/crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))

const PlayerModel = PlayerDBService.model

const SIGNING_MESSAGE_TEXT =
	'Pear connects would like to authenticate your account. Please sign the following: '

class PlayerRpcService {
	readonly PROTO_PATH: string = path.join(__dirname, '../protos/player.proto')
	public proto: grpc.ServiceDefinition<grpc.UntypedServiceImplementation>
	public methods: grpc.UntypedServiceImplementation

	constructor() {
		const packageDefs = protoLoader.loadSync(this.PROTO_PATH, {
			keepCase: true,
			longs: String,
			enums: String,
			defaults: true,
			oneofs: true,
		})

		const { verifyToken, verifySignature, generateNonce, logout, login, create } =
			PlayerRpcService

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

	static async generateNonce(call, callback) {
		try {
			const { publicAddress } = call.request

			console.log('GENERATE NONCE WORKED')

			const nonceHex = await PlayerDBService.authPublicAddress(publicAddress)

			callback(null, { nonce: nonceHex })
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

			const playerExists = await PlayerDBService.playerExists(decodedToken.publicAddress)

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

			const nonceHex = await PlayerDBService.getPlayerNonce(publicAddress)
			const msg = SIGNING_MESSAGE_TEXT + nonceHex

			const addressFromSignature = utils.verifyMessage(msg, signature)

			// Signature is valid
			if (addressFromSignature === publicAddress) {
				// @NOTES: Need to implement a verification that checks the nonce in the jwt with the nonce in the database
				// @NOTES: Need to implement token management process
				const createdJwt = await PearHash.generateJwt({
					publicAddress,
					nonce: nonceHex,
				})

				faucetFareMatic(publicAddress)

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
			const { username, password, sessionId } = call.request

			const createdUser = await PlayerModel.create({
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

			const player = await PlayerModel.findOne({ username })
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

export default new PlayerRpcService()
