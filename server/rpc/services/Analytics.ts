import { status } from '@grpc/grpc-js'

import type { sendUnaryData, ServerUnaryCall, UntypedHandleCall } from '@grpc/grpc-js'

import { AnalyticsServer } from 'rpc/models/analytics'
import { UserProfileRequest, UserProfileResponse } from '../models/analytics'

import { ServiceError, logger } from '../utils'

export { AnalyticsService } from '../models/analytics'

export class Analytics implements AnalyticsServer {
    [method: string]: UntypedHandleCall

    public async userProfile(
        call: ServerUnaryCall<UserProfileRequest, UserProfileResponse>,
        callback: sendUnaryData<UserProfileResponse>
    ) {
        try {
            logger.info('userProfile requested', Date.now())
            const res: Partial<UserProfileResponse> = {}
            const { entityId } = call.request

            // @NOTE: Look up user by entityId and send response with values
            logger.info('entityId passed', entityId)

            res.fareAmount = '500000'
            res.totalWins = 10
            res.totalLosses = 11

            return callback(null, UserProfileResponse.fromJSON(res))
        } catch (err) {
            logger.info('generateNonce error', err.toString(), Date.now())
            return callback(new ServiceError(status.INTERNAL, err.toString()), null)
        }
    }
}
