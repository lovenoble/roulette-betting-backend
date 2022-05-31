import { utils } from 'ethers'

import ServiceBase from './ServiceBase'
import type { User, ICreateUserOptions } from '../types'
import { PearHash, log } from '../utils'

// export async function authenticate(setProvider: any): Promise<[string, string]> {
// 	try {
// 		if (!setProvider) throw new Error('Need setProvider')
// 		if (!window.ethereum) throw new Error('Metamask is not installed')
// 		let ethAddress = await getSelectedAddress()

// 		if (!ethAddress) throw new Error('Selected ETH address does not exist')

// 		// Get checksum ETH address
// 		ethAddress = utils.getAddress(ethAddress[0])

// 		// await addPolygonTestnetNetwork()
// 		// await addKovanTestnet()
// 		// await addFujiTestnetNetwork()

// 		setProvider(new providers.Web3Provider(window.ethereum))

// 		const request = new rpcClient.playerMessage.GenerateNonceRequest()
// 		request.setPublicaddress(ethAddress)
// 		const rpcNonceResp: any = await rpcClient.playerClient.generateNonce(request, null)

// 		const nonceHex = rpcNonceResp.getNonce()

// 		const signingMessage = constants.signingMsgText + nonceHex

// 		const signedMessage = await signMessage(ethAddress, signingMessage)
// 		if (!signedMessage) {
// 			throw new Error('Problem with signing auth message!')
// 		}

// 		const response = new rpcClient.playerMessage.VerifySignatureRequest()
// 		response.setPublicaddress(ethAddress)
// 		response.setSignature(signedMessage)
// 		const rpcVerifyResp = await rpcClient.playerClient.verifySignature(response, null)

// 		return [rpcVerifyResp.getToken(), ethAddress]
// 	} catch (err: any) {
// 		// @NOTE: Need error catching here
// 		console.error(err)
// 		throw new Error(err.message)
// 	}
// }

// Verify signature
// 		const { publicAddress, signature } = call.request

// 		const nonceHex = await store.service.user.getUserNonce(publicAddress)
// 		const msg = SIGNING_MESSAGE_TEXT + nonceHex

// 		const addressFromSignature = utils.verifyMessage(msg, signature)

// 		// Signature is valid
// 		if (addressFromSignature === publicAddress) {
// 			// @NOTES: Need to implement a verification that checks the nonce in the jwt with the nonce in the database
// 			// @NOTES: Need to implement token management process
// 			const createdJwt = await PearHash.generateJwt({
// 				publicAddress,
// 				nonce: nonceHex,
// 			})

// 			// @NOTE: faucetFareMatic HERE~!!!@#@!#!@#!
// 			// faucetFareMatic(publicAddress)

// 			return callback(null, { token: createdJwt })
// 		}

// 		// Signature is invalid
// 		return callback({
// 			code: grpc.status.PERMISSION_DENIED,
// 			status: grpc.status.PERMISSION_DENIED,
// 			message: 'Signature is invalid.',
// 		})

// Verify passwords
// 		const { username, password } = call.request

// 		const player = await store.service.user.findByUsername(username)

// 		if (!player) {
// 			return callback({
// 				code: grpc.status.NOT_FOUND,
// 				status: grpc.status.NOT_FOUND,
// 				message: 'Invalid username or password',
// 			})
// 		}

// 		const doesPasswordMatch = await PearHash.compare(password, player.password)

// 		if (!doesPasswordMatch) {
// 			return callback({
// 				code: grpc.status.NOT_FOUND,
// 				status: grpc.status.NOT_FOUND,
// 				message: 'Invalid username or password',
// 			})
// 		}

// 		return callback(null, { token: player._id, sessionId: 'sessionId here' })
// 	} catch (err) {
// 		return callback({
// 			code: grpc.status.INTERNAL,
// 			status: grpc.status.INTERNAL,
// 			message: err.toString(),
// 		})
// 	}

// get nonce
// getSigningText
// getAddress from msg + signature
// generateJwt
// faucetFareMatic if ETH and/or FARTE is low
export default class UserService extends ServiceBase<User> {
	// Fetch userEntity by publicAddress
	public async getUserByAddress(publicAddress: string) {
		return this.repo.search().where('publicAddress').eq(publicAddress).returnFirst()
	}

	public async getUserByUsername(username: string) {
		return this.repo.search().where('username').eq(username).returnFirst()
	}

	// const createdUser = await store.service.user.create({
	public async create(userData: ICreateUserOptions) {
		const createUserObj: User = {
			createdAt: Date.now(),
			...userData,
		}

		return this.repo.createAndSave(createUserObj)
	}

	// Check if publicAddress exists.
	// If true, generate a new nonce, update the player record, and return the nonce
	// If false, generate a new nonce, create a new player record, and return the none
	public async authPublicAddress(publicAddress: string) {
		if (!utils.isAddress(publicAddress)) throw new Error('Public address is not valid')
		const { nonce, signingMessage } = PearHash.generateNonceWithSigningMessage()

		const userEntity = await this.getUserByAddress(publicAddress)

		// If userEntity doesn't exist, create a new user entity and pass in generated nonce
		if (!userEntity) {
			await this.repo.createAndSave({
				publicAddress,
				nonce,
				isDisabled: false,
				createdAt: Date.now(),
			})

			log('Generated new player record for:', publicAddress)

			// else update nonce for current user
		} else {
			userEntity.nonce = nonce
			await this.repo.save(userEntity)

			log('Updated nonce for player:', publicAddress)
		}

		return { nonce, signingMessage }
	}

	// Fetch userEntity nonce by publicAddress
	public async getUserNonce(publicAddress: string) {
		if (!utils.isAddress(publicAddress)) throw new Error('Public address is not valid')

		const userEntity = await this.getUserByAddress(publicAddress)

		if (!userEntity) {
			throw new Error(`User does not exist with publicAddress: ${publicAddress}`)
		}

		return userEntity.nonce
	}

	// Checks if user exists by publicAddress
	public async playerExists(publicAddress: string) {
		const count = await this.repo
			.search()
			.where('publicAddress')
			.eq(publicAddress)
			.returnCount()

		return count > 0
	}
}

// protoPath = PROTO_PATH
// proto: grpc.ServiceDefinition<grpc.UntypedServiceImplementation>
// methods: grpc.UntypedServiceImplementation

// constructor() {
// 	const packageDefs = protoLoader.loadSync(this.protoPath, {
// 		keepCase: true,
// 		longs: String,
// 		enums: String,
// 		defaults: true,
// 		oneofs: true,
// 	})

// 	const { verifyToken, verifySignature, generateNonce, logout, login, create } =
// 		PlayerRpcService

// 	// @ts-ignore
// 	this.proto = grpc.loadPackageDefinition(packageDefs).player.Player.service
// 	this.methods = {
// 		create,
// 		login,
// 		logout,
// 		generateNonce,
// 		verifySignature,
// 		verifyToken,
// 	}
// }

// static async generateNonce(call, callback) {
// 	try {
// 		const { publicAddress } = call.request

// 		console.log('GENERATE NONCE WORKED')

// 		const nonceHex = await store.service.user.authPublicAddress(publicAddress)

// 		callback(null, { nonce: nonceHex })
// 	} catch (err) {
// 		callback({
// 			code: grpc.status.INTERNAL,
// 			status: grpc.status.INTERNAL,
// 			message: err.toString(),
// 		})
// 	}
// }

// static async verifyToken(call, callback) {
// 	// @NOTE Need error catching
// 	try {
// 		const { token } = call.request

// 		const decodedToken = await PearHash.decodeJwt(token)

// 		// @NOTE: Need to check if token is expired here

// 		if (!decodedToken.publicAddress) {
// 			return callback({
// 				code: grpc.status.PERMISSION_DENIED,
// 				status: grpc.status.PERMISSION_DENIED,
// 				message: 'Token is invalid',
// 			})
// 		}

// 		const playerExists = await store.service.user.playerExists(decodedToken.publicAddress)

// 		if (!playerExists) {
// 			return callback({
// 				code: grpc.status.PERMISSION_DENIED,
// 				status: grpc.status.PERMISSION_DENIED,
// 				message: 'Token is invalid',
// 			})
// 		}

// 		return callback(null, { publicAddress: decodedToken.publicAddress })
// 	} catch (err) {
// 		return callback({
// 			code: grpc.status.PERMISSION_DENIED,
// 			status: grpc.status.PERMISSION_DENIED,
// 			message: err.toString(),
// 		})
// 	}
// }

// static async verifySignature(call, callback) {
// 	try {
// 		const { publicAddress, signature } = call.request

// 		const nonceHex = await store.service.user.getUserNonce(publicAddress)
// 		const msg = SIGNING_MESSAGE_TEXT + nonceHex

// 		const addressFromSignature = utils.verifyMessage(msg, signature)

// 		// Signature is valid
// 		if (addressFromSignature === publicAddress) {
// 			// @NOTES: Need to implement a verification that checks the nonce in the jwt with the nonce in the database
// 			// @NOTES: Need to implement token management process
// 			const createdJwt = await PearHash.generateJwt({
// 				publicAddress,
// 				nonce: nonceHex,
// 			})

// 			// @NOTE: faucetFareMatic HERE~!!!@#@!#!@#!
// 			// faucetFareMatic(publicAddress)

// 			return callback(null, { token: createdJwt })
// 		}

// 		// Signature is invalid
// 		return callback({
// 			code: grpc.status.PERMISSION_DENIED,
// 			status: grpc.status.PERMISSION_DENIED,
// 			message: 'Signature is invalid.',
// 		})
// 	} catch (err) {
// 		return callback({
// 			code: grpc.status.INTERNAL,
// 			status: grpc.status.INTERNAL,
// 			message: err.toString(),
// 		})
// 	}
// }

// static async create(call, callback) {
// 	try {
// 		const { username, password, sessionId } = call.request

// 		const createdUser = await store.service.user.create({
// 			username,
// 			password,
// 			sessionId,
// 		})

// 		callback(null, { token: createdUser._id, sessionId })
// 	} catch (err) {
// 		callback({
// 			code: grpc.status.INTERNAL,
// 			status: grpc.status.INTERNAL,
// 			message: err.toString(),
// 		})
// 	}
// }

// static async login(call, callback) {
// 	try {
// 		const { username, password } = call.request

// 		const player = await store.service.user.findByUsername(username)

// 		if (!player) {
// 			return callback({
// 				code: grpc.status.NOT_FOUND,
// 				status: grpc.status.NOT_FOUND,
// 				message: 'Invalid username or password',
// 			})
// 		}

// 		const doesPasswordMatch = await PearHash.compare(password, player.password)

// 		if (!doesPasswordMatch) {
// 			return callback({
// 				code: grpc.status.NOT_FOUND,
// 				status: grpc.status.NOT_FOUND,
// 				message: 'Invalid username or password',
// 			})
// 		}

// 		return callback(null, { token: player._id, sessionId: 'sessionId here' })
// 	} catch (err) {
// 		return callback({
// 			code: grpc.status.INTERNAL,
// 			status: grpc.status.INTERNAL,
// 			message: err.toString(),
// 		})
// 	}
// }

// Create these
// const createdUser = await store.service.user.create({
// const player = await store.service.user.findByUsername(username)

// static async verifySignature(call, callback) {
// logout
// login
// create
// const { username, password, sessionId } = call.request
// static async generateNonce(call, callback) {
// static async verifyToken(call, callback) {
