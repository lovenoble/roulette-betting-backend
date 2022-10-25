import { sendUnaryData, ServerUnaryCall, status, UntypedHandleCall } from '@grpc/grpc-js'

import {
	HealthCheckResponse,
	HealthCheckResponse_ServingStatus,
	HealthCheckRequest,
	HealthServer,
} from '../models/health'
import { logger, ServiceError } from '../utils'

export const ServingStatus = HealthCheckResponse_ServingStatus
export const healthStatus: Map<string, HealthCheckResponse_ServingStatus> = new Map(
	Object.entries({
		'': ServingStatus.SERVING,
		'pear.Analytics': ServingStatus.SERVING,
		'pear.User': ServingStatus.SERVING,
	}),
)
export { HealthService } from '../models/health'

/**
 * gRPC Health Check
 * https://github.com/grpc/grpc-node/tree/master/packages/grpc-health-check
 */
export class Health implements HealthServer {
	[method: string]: UntypedHandleCall

	// public check: handleUnaryCall<HealthCheckRequest, HealthCheckResponse> = (call, callback) => {}
	public check(
		call: ServerUnaryCall<HealthCheckRequest, HealthCheckResponse>,
		callback: sendUnaryData<HealthCheckResponse>,
	): void {
		const { service } = call.request
		logger.info(`healthCheck ${service}`)

		const serviceStatus = healthStatus.get(service)
		if (!serviceStatus) {
			return callback(new ServiceError(status.NOT_FOUND, 'NotFoundService'), null)
		}

		return callback(null, {
			status: serviceStatus,
		})
	}
}
