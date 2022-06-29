/* eslint-disable */
import Long from 'long'
import {
	makeGenericClientConstructor,
	ChannelCredentials,
	ChannelOptions,
	UntypedServiceImplementation,
	handleUnaryCall,
	Client,
	ClientUnaryCall,
	Metadata,
	CallOptions,
	ServiceError,
} from '@grpc/grpc-js'
import _m0 from 'protobufjs/minimal'

/**
 * https://github.com/grpc/grpc/blob/master/doc/health-checking.md
 * https://github.com/grpc/grpc/blob/master/src/proto/grpc/health/v1/health.proto
 */

export interface HealthCheckRequest {
	service: string
}

export interface HealthCheckResponse {
	status: HealthCheckResponse_ServingStatus
}

export enum HealthCheckResponse_ServingStatus {
	UNKNOWN = 0,
	SERVING = 1,
	NOT_SERVING = 2,
	UNRECOGNIZED = -1,
}

export function healthCheckResponse_ServingStatusFromJSON(
	object: any
): HealthCheckResponse_ServingStatus {
	switch (object) {
		case 0:
		case 'UNKNOWN':
			return HealthCheckResponse_ServingStatus.UNKNOWN
		case 1:
		case 'SERVING':
			return HealthCheckResponse_ServingStatus.SERVING
		case 2:
		case 'NOT_SERVING':
			return HealthCheckResponse_ServingStatus.NOT_SERVING
		case -1:
		case 'UNRECOGNIZED':
		default:
			return HealthCheckResponse_ServingStatus.UNRECOGNIZED
	}
}

export function healthCheckResponse_ServingStatusToJSON(
	object: HealthCheckResponse_ServingStatus
): string {
	switch (object) {
		case HealthCheckResponse_ServingStatus.UNKNOWN:
			return 'UNKNOWN'
		case HealthCheckResponse_ServingStatus.SERVING:
			return 'SERVING'
		case HealthCheckResponse_ServingStatus.NOT_SERVING:
			return 'NOT_SERVING'
		case HealthCheckResponse_ServingStatus.UNRECOGNIZED:
		default:
			return 'UNRECOGNIZED'
	}
}

function createBaseHealthCheckRequest(): HealthCheckRequest {
	return { service: '' }
}

export const HealthCheckRequest = {
	encode(message: HealthCheckRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
		if (message.service !== '') {
			writer.uint32(10).string(message.service)
		}
		return writer
	},

	decode(input: _m0.Reader | Uint8Array, length?: number): HealthCheckRequest {
		const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
		let end = length === undefined ? reader.len : reader.pos + length
		const message = createBaseHealthCheckRequest()
		while (reader.pos < end) {
			const tag = reader.uint32()
			switch (tag >>> 3) {
				case 1:
					message.service = reader.string()
					break
				default:
					reader.skipType(tag & 7)
					break
			}
		}
		return message
	},

	fromJSON(object: any): HealthCheckRequest {
		return {
			service: isSet(object.service) ? String(object.service) : '',
		}
	},

	toJSON(message: HealthCheckRequest): unknown {
		const obj: any = {}
		message.service !== undefined && (obj.service = message.service)
		return obj
	},

	fromPartial<I extends Exact<DeepPartial<HealthCheckRequest>, I>>(
		object: I
	): HealthCheckRequest {
		const message = createBaseHealthCheckRequest()
		message.service = object.service ?? ''
		return message
	},
}

function createBaseHealthCheckResponse(): HealthCheckResponse {
	return { status: 0 }
}

export const HealthCheckResponse = {
	encode(message: HealthCheckResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
		if (message.status !== 0) {
			writer.uint32(8).int32(message.status)
		}
		return writer
	},

	decode(input: _m0.Reader | Uint8Array, length?: number): HealthCheckResponse {
		const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
		let end = length === undefined ? reader.len : reader.pos + length
		const message = createBaseHealthCheckResponse()
		while (reader.pos < end) {
			const tag = reader.uint32()
			switch (tag >>> 3) {
				case 1:
					message.status = reader.int32() as any
					break
				default:
					reader.skipType(tag & 7)
					break
			}
		}
		return message
	},

	fromJSON(object: any): HealthCheckResponse {
		return {
			status: isSet(object.status)
				? healthCheckResponse_ServingStatusFromJSON(object.status)
				: 0,
		}
	},

	toJSON(message: HealthCheckResponse): unknown {
		const obj: any = {}
		message.status !== undefined &&
			(obj.status = healthCheckResponse_ServingStatusToJSON(message.status))
		return obj
	},

	fromPartial<I extends Exact<DeepPartial<HealthCheckResponse>, I>>(
		object: I
	): HealthCheckResponse {
		const message = createBaseHealthCheckResponse()
		message.status = object.status ?? 0
		return message
	},
}

export type HealthService = typeof HealthService
export const HealthService = {
	check: {
		path: '/grpc.health.v1.Health/Check',
		requestStream: false,
		responseStream: false,
		requestSerialize: (value: HealthCheckRequest) =>
			Buffer.from(HealthCheckRequest.encode(value).finish()),
		requestDeserialize: (value: Buffer) => HealthCheckRequest.decode(value),
		responseSerialize: (value: HealthCheckResponse) =>
			Buffer.from(HealthCheckResponse.encode(value).finish()),
		responseDeserialize: (value: Buffer) => HealthCheckResponse.decode(value),
	},
} as const

export interface HealthServer extends UntypedServiceImplementation {
	check: handleUnaryCall<HealthCheckRequest, HealthCheckResponse>
}

export interface HealthClient extends Client {
	check(
		request: HealthCheckRequest,
		callback: (error: ServiceError | null, response: HealthCheckResponse) => void
	): ClientUnaryCall
	check(
		request: HealthCheckRequest,
		metadata: Metadata,
		callback: (error: ServiceError | null, response: HealthCheckResponse) => void
	): ClientUnaryCall
	check(
		request: HealthCheckRequest,
		metadata: Metadata,
		options: Partial<CallOptions>,
		callback: (error: ServiceError | null, response: HealthCheckResponse) => void
	): ClientUnaryCall
}

export const HealthClient = makeGenericClientConstructor(
	HealthService,
	'grpc.health.v1.Health'
) as unknown as {
	new (
		address: string,
		credentials: ChannelCredentials,
		options?: Partial<ChannelOptions>
	): HealthClient
	service: typeof HealthService
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined

type DeepPartial<T> = T extends Builtin
	? T
	: T extends Array<infer U>
	? Array<DeepPartial<U>>
	: T extends ReadonlyArray<infer U>
	? ReadonlyArray<DeepPartial<U>>
	: T extends {}
	? { [K in keyof T]?: DeepPartial<T[K]> }
	: Partial<T>

type KeysOfUnion<T> = T extends T ? keyof T : never
type Exact<P, I extends P> = P extends Builtin
	? P
	: P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<Exclude<keyof I, KeysOfUnion<P>>, never>

if (_m0.util.Long !== Long) {
	_m0.util.Long = Long as any
	_m0.configure()
}

function isSet(value: any): boolean {
	return value !== null && value !== undefined
}
