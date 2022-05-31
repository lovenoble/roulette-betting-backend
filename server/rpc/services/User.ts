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
            logger.info('generateNonce requested', Date.now())
            const res: Partial<GenerateNonceResponse> = {}
            const { publicAddress } = call.request

            const { nonce, signingMessage } = await store.service.user.authPublicAddress(
                publicAddress
            )

            res.nonce = nonce
            res.signingMessage = signingMessage

            return callback(null, GenerateNonceResponse.fromJSON(res))
        } catch (err) {
            logger.info('generateNonce error', err.toString(), Date.now())
            return callback(new ServiceError(status.INTERNAL, err.toString()), null)
        }
    }

    public async verifyToken(
        call: ServerUnaryCall<VerifyTokenRequest, VerifyTokenResponse>,
        callback: sendUnaryData<VerifyTokenResponse>
    ) {
        // @NOTE Need error catching
        try {
            logger.info('verifyToken requested', Date.now())
            const { token } = call.request

            const res: Partial<VerifyTokenResponse> = {}

            const decodedToken = await PearHash.decodeJwt(token)

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

            // @NOTE: we could save a lastVerifiedAt field to update repo everytime token is verified

            res.publicAddress = decodedToken.publicAddress

            return callback(
                null,
                VerifyTokenResponse.fromJSON({ publicAddress: decodedToken.publicAddress })
            )
        } catch (err) {
            logger.info('verifyToken error', err.toString(), Date.now())
            return callback(new ServiceError(status.INTERNAL, err.toString()), null)
        }
    }

    public async verifySignature(
        call: ServerUnaryCall<VerifySignatureRequest, VerifySignatureResponse>,
        callback: sendUnaryData<VerifySignatureResponse>
    ) {
        try {
            logger.info('verifySignature requested', Date.now())

            const res: Partial<VerifySignatureResponse> = {}
            const { publicAddress, signature } = call.request

            const { nonce, signingMessage } = await store.service.user.getUserNonce(publicAddress)

            const addressFromSignature = utils.verifyMessage(signingMessage, signature)

            // Signature is valid
            if (addressFromSignature === publicAddress) {
                // @NOTES: Need to implement a verification that checks the nonce in the jwt with the nonce in the database
                // @NOTES: Need to implement token management process
                const createdJwt = await PearHash.generateJwt({
                    publicAddress,
                    nonce,
                })

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
            logger.info('verifySignature error', err.toString(), Date.now())
            return callback(new ServiceError(status.INTERNAL, err.toString()), null)
        }
    }

    public async logout(
        call: ServerUnaryCall<LogoutRequest, LogoutResponse>,
        callback: sendUnaryData<LogoutResponse>
    ) {
        try {
            logger.info('logout requested', Date.now())
            const { token } = call.request

            const res: Partial<LogoutResponse> = {}

            const decodedToken = await PearHash.decodeJwt(token)
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
            logger.info('logout error', err.toString(), Date.now())
            return callback(new ServiceError(status.INTERNAL, err.toString()), null)
        }
    }
}
