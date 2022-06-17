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

export interface CreateBatchEntryRequest {
	authToken: string
	seedIdx: number
}

export interface CreateBatchEntryResponse {
	status: string
}

export interface SettleBatchEntryRequest {
	authToken: string
	roundId: number
	seedIdx: number
}

export interface SettleBatchEntryResponse {
	status: string
}

export interface PauseRoundRequest {
	authToken: string
	isPaused: boolean
}

export interface PauseRoundResponse {
	status: string
}

export interface ConcludeRoundRequest {
	authToken: string
}

export interface ConcludeRoundResponse {
	status: string
}

function createBaseCreateBatchEntryRequest(): CreateBatchEntryRequest {
	return { authToken: '', seedIdx: 0 }
}

export const CreateBatchEntryRequest = {
	encode(message: CreateBatchEntryRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
		if (message.authToken !== '') {
			writer.uint32(10).string(message.authToken)
		}
		if (message.seedIdx !== 0) {
			writer.uint32(16).int32(message.seedIdx)
		}
		return writer
	},

	decode(input: _m0.Reader | Uint8Array, length?: number): CreateBatchEntryRequest {
		const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
		let end = length === undefined ? reader.len : reader.pos + length
		const message = createBaseCreateBatchEntryRequest()
		while (reader.pos < end) {
			const tag = reader.uint32()
			switch (tag >>> 3) {
				case 1:
					message.authToken = reader.string()
					break
				case 2:
					message.seedIdx = reader.int32()
					break
				default:
					reader.skipType(tag & 7)
					break
			}
		}
		return message
	},

	fromJSON(object: any): CreateBatchEntryRequest {
		return {
			authToken: isSet(object.authToken) ? String(object.authToken) : '',
			seedIdx: isSet(object.seedIdx) ? Number(object.seedIdx) : 0,
		}
	},

	toJSON(message: CreateBatchEntryRequest): unknown {
		const obj: any = {}
		message.authToken !== undefined && (obj.authToken = message.authToken)
		message.seedIdx !== undefined && (obj.seedIdx = Math.round(message.seedIdx))
		return obj
	},

	fromPartial<I extends Exact<DeepPartial<CreateBatchEntryRequest>, I>>(
		object: I
	): CreateBatchEntryRequest {
		const message = createBaseCreateBatchEntryRequest()
		message.authToken = object.authToken ?? ''
		message.seedIdx = object.seedIdx ?? 0
		return message
	},
}

function createBaseCreateBatchEntryResponse(): CreateBatchEntryResponse {
	return { status: '' }
}

export const CreateBatchEntryResponse = {
	encode(
		message: CreateBatchEntryResponse,
		writer: _m0.Writer = _m0.Writer.create()
	): _m0.Writer {
		if (message.status !== '') {
			writer.uint32(10).string(message.status)
		}
		return writer
	},

	decode(input: _m0.Reader | Uint8Array, length?: number): CreateBatchEntryResponse {
		const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
		let end = length === undefined ? reader.len : reader.pos + length
		const message = createBaseCreateBatchEntryResponse()
		while (reader.pos < end) {
			const tag = reader.uint32()
			switch (tag >>> 3) {
				case 1:
					message.status = reader.string()
					break
				default:
					reader.skipType(tag & 7)
					break
			}
		}
		return message
	},

	fromJSON(object: any): CreateBatchEntryResponse {
		return {
			status: isSet(object.status) ? String(object.status) : '',
		}
	},

	toJSON(message: CreateBatchEntryResponse): unknown {
		const obj: any = {}
		message.status !== undefined && (obj.status = message.status)
		return obj
	},

	fromPartial<I extends Exact<DeepPartial<CreateBatchEntryResponse>, I>>(
		object: I
	): CreateBatchEntryResponse {
		const message = createBaseCreateBatchEntryResponse()
		message.status = object.status ?? ''
		return message
	},
}

function createBaseSettleBatchEntryRequest(): SettleBatchEntryRequest {
	return { authToken: '', roundId: 0, seedIdx: 0 }
}

export const SettleBatchEntryRequest = {
	encode(message: SettleBatchEntryRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
		if (message.authToken !== '') {
			writer.uint32(10).string(message.authToken)
		}
		if (message.roundId !== 0) {
			writer.uint32(16).int32(message.roundId)
		}
		if (message.seedIdx !== 0) {
			writer.uint32(24).int32(message.seedIdx)
		}
		return writer
	},

	decode(input: _m0.Reader | Uint8Array, length?: number): SettleBatchEntryRequest {
		const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
		let end = length === undefined ? reader.len : reader.pos + length
		const message = createBaseSettleBatchEntryRequest()
		while (reader.pos < end) {
			const tag = reader.uint32()
			switch (tag >>> 3) {
				case 1:
					message.authToken = reader.string()
					break
				case 2:
					message.roundId = reader.int32()
					break
				case 3:
					message.seedIdx = reader.int32()
					break
				default:
					reader.skipType(tag & 7)
					break
			}
		}
		return message
	},

	fromJSON(object: any): SettleBatchEntryRequest {
		return {
			authToken: isSet(object.authToken) ? String(object.authToken) : '',
			roundId: isSet(object.roundId) ? Number(object.roundId) : 0,
			seedIdx: isSet(object.seedIdx) ? Number(object.seedIdx) : 0,
		}
	},

	toJSON(message: SettleBatchEntryRequest): unknown {
		const obj: any = {}
		message.authToken !== undefined && (obj.authToken = message.authToken)
		message.roundId !== undefined && (obj.roundId = Math.round(message.roundId))
		message.seedIdx !== undefined && (obj.seedIdx = Math.round(message.seedIdx))
		return obj
	},

	fromPartial<I extends Exact<DeepPartial<SettleBatchEntryRequest>, I>>(
		object: I
	): SettleBatchEntryRequest {
		const message = createBaseSettleBatchEntryRequest()
		message.authToken = object.authToken ?? ''
		message.roundId = object.roundId ?? 0
		message.seedIdx = object.seedIdx ?? 0
		return message
	},
}

function createBaseSettleBatchEntryResponse(): SettleBatchEntryResponse {
	return { status: '' }
}

export const SettleBatchEntryResponse = {
	encode(
		message: SettleBatchEntryResponse,
		writer: _m0.Writer = _m0.Writer.create()
	): _m0.Writer {
		if (message.status !== '') {
			writer.uint32(10).string(message.status)
		}
		return writer
	},

	decode(input: _m0.Reader | Uint8Array, length?: number): SettleBatchEntryResponse {
		const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
		let end = length === undefined ? reader.len : reader.pos + length
		const message = createBaseSettleBatchEntryResponse()
		while (reader.pos < end) {
			const tag = reader.uint32()
			switch (tag >>> 3) {
				case 1:
					message.status = reader.string()
					break
				default:
					reader.skipType(tag & 7)
					break
			}
		}
		return message
	},

	fromJSON(object: any): SettleBatchEntryResponse {
		return {
			status: isSet(object.status) ? String(object.status) : '',
		}
	},

	toJSON(message: SettleBatchEntryResponse): unknown {
		const obj: any = {}
		message.status !== undefined && (obj.status = message.status)
		return obj
	},

	fromPartial<I extends Exact<DeepPartial<SettleBatchEntryResponse>, I>>(
		object: I
	): SettleBatchEntryResponse {
		const message = createBaseSettleBatchEntryResponse()
		message.status = object.status ?? ''
		return message
	},
}

function createBasePauseRoundRequest(): PauseRoundRequest {
	return { authToken: '', isPaused: false }
}

export const PauseRoundRequest = {
	encode(message: PauseRoundRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
		if (message.authToken !== '') {
			writer.uint32(10).string(message.authToken)
		}
		if (message.isPaused === true) {
			writer.uint32(16).bool(message.isPaused)
		}
		return writer
	},

	decode(input: _m0.Reader | Uint8Array, length?: number): PauseRoundRequest {
		const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
		let end = length === undefined ? reader.len : reader.pos + length
		const message = createBasePauseRoundRequest()
		while (reader.pos < end) {
			const tag = reader.uint32()
			switch (tag >>> 3) {
				case 1:
					message.authToken = reader.string()
					break
				case 2:
					message.isPaused = reader.bool()
					break
				default:
					reader.skipType(tag & 7)
					break
			}
		}
		return message
	},

	fromJSON(object: any): PauseRoundRequest {
		return {
			authToken: isSet(object.authToken) ? String(object.authToken) : '',
			isPaused: isSet(object.isPaused) ? Boolean(object.isPaused) : false,
		}
	},

	toJSON(message: PauseRoundRequest): unknown {
		const obj: any = {}
		message.authToken !== undefined && (obj.authToken = message.authToken)
		message.isPaused !== undefined && (obj.isPaused = message.isPaused)
		return obj
	},

	fromPartial<I extends Exact<DeepPartial<PauseRoundRequest>, I>>(object: I): PauseRoundRequest {
		const message = createBasePauseRoundRequest()
		message.authToken = object.authToken ?? ''
		message.isPaused = object.isPaused ?? false
		return message
	},
}

function createBasePauseRoundResponse(): PauseRoundResponse {
	return { status: '' }
}

export const PauseRoundResponse = {
	encode(message: PauseRoundResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
		if (message.status !== '') {
			writer.uint32(10).string(message.status)
		}
		return writer
	},

	decode(input: _m0.Reader | Uint8Array, length?: number): PauseRoundResponse {
		const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
		let end = length === undefined ? reader.len : reader.pos + length
		const message = createBasePauseRoundResponse()
		while (reader.pos < end) {
			const tag = reader.uint32()
			switch (tag >>> 3) {
				case 1:
					message.status = reader.string()
					break
				default:
					reader.skipType(tag & 7)
					break
			}
		}
		return message
	},

	fromJSON(object: any): PauseRoundResponse {
		return {
			status: isSet(object.status) ? String(object.status) : '',
		}
	},

	toJSON(message: PauseRoundResponse): unknown {
		const obj: any = {}
		message.status !== undefined && (obj.status = message.status)
		return obj
	},

	fromPartial<I extends Exact<DeepPartial<PauseRoundResponse>, I>>(
		object: I
	): PauseRoundResponse {
		const message = createBasePauseRoundResponse()
		message.status = object.status ?? ''
		return message
	},
}

function createBaseConcludeRoundRequest(): ConcludeRoundRequest {
	return { authToken: '' }
}

export const ConcludeRoundRequest = {
	encode(message: ConcludeRoundRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
		if (message.authToken !== '') {
			writer.uint32(10).string(message.authToken)
		}
		return writer
	},

	decode(input: _m0.Reader | Uint8Array, length?: number): ConcludeRoundRequest {
		const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
		let end = length === undefined ? reader.len : reader.pos + length
		const message = createBaseConcludeRoundRequest()
		while (reader.pos < end) {
			const tag = reader.uint32()
			switch (tag >>> 3) {
				case 1:
					message.authToken = reader.string()
					break
				default:
					reader.skipType(tag & 7)
					break
			}
		}
		return message
	},

	fromJSON(object: any): ConcludeRoundRequest {
		return {
			authToken: isSet(object.authToken) ? String(object.authToken) : '',
		}
	},

	toJSON(message: ConcludeRoundRequest): unknown {
		const obj: any = {}
		message.authToken !== undefined && (obj.authToken = message.authToken)
		return obj
	},

	fromPartial<I extends Exact<DeepPartial<ConcludeRoundRequest>, I>>(
		object: I
	): ConcludeRoundRequest {
		const message = createBaseConcludeRoundRequest()
		message.authToken = object.authToken ?? ''
		return message
	},
}

function createBaseConcludeRoundResponse(): ConcludeRoundResponse {
	return { status: '' }
}

export const ConcludeRoundResponse = {
	encode(message: ConcludeRoundResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
		if (message.status !== '') {
			writer.uint32(10).string(message.status)
		}
		return writer
	},

	decode(input: _m0.Reader | Uint8Array, length?: number): ConcludeRoundResponse {
		const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
		let end = length === undefined ? reader.len : reader.pos + length
		const message = createBaseConcludeRoundResponse()
		while (reader.pos < end) {
			const tag = reader.uint32()
			switch (tag >>> 3) {
				case 1:
					message.status = reader.string()
					break
				default:
					reader.skipType(tag & 7)
					break
			}
		}
		return message
	},

	fromJSON(object: any): ConcludeRoundResponse {
		return {
			status: isSet(object.status) ? String(object.status) : '',
		}
	},

	toJSON(message: ConcludeRoundResponse): unknown {
		const obj: any = {}
		message.status !== undefined && (obj.status = message.status)
		return obj
	},

	fromPartial<I extends Exact<DeepPartial<ConcludeRoundResponse>, I>>(
		object: I
	): ConcludeRoundResponse {
		const message = createBaseConcludeRoundResponse()
		message.status = object.status ?? ''
		return message
	},
}

export type AdminService = typeof AdminService
export const AdminService = {
	createBatchEntry: {
		path: '/admin.Admin/CreateBatchEntry',
		requestStream: false,
		responseStream: false,
		requestSerialize: (value: CreateBatchEntryRequest) =>
			Buffer.from(CreateBatchEntryRequest.encode(value).finish()),
		requestDeserialize: (value: Buffer) => CreateBatchEntryRequest.decode(value),
		responseSerialize: (value: CreateBatchEntryResponse) =>
			Buffer.from(CreateBatchEntryResponse.encode(value).finish()),
		responseDeserialize: (value: Buffer) => CreateBatchEntryResponse.decode(value),
	},
	settleBatchEntry: {
		path: '/admin.Admin/SettleBatchEntry',
		requestStream: false,
		responseStream: false,
		requestSerialize: (value: SettleBatchEntryRequest) =>
			Buffer.from(SettleBatchEntryRequest.encode(value).finish()),
		requestDeserialize: (value: Buffer) => SettleBatchEntryRequest.decode(value),
		responseSerialize: (value: SettleBatchEntryResponse) =>
			Buffer.from(SettleBatchEntryResponse.encode(value).finish()),
		responseDeserialize: (value: Buffer) => SettleBatchEntryResponse.decode(value),
	},
	pauseRound: {
		path: '/admin.Admin/PauseRound',
		requestStream: false,
		responseStream: false,
		requestSerialize: (value: PauseRoundRequest) =>
			Buffer.from(PauseRoundRequest.encode(value).finish()),
		requestDeserialize: (value: Buffer) => PauseRoundRequest.decode(value),
		responseSerialize: (value: PauseRoundResponse) =>
			Buffer.from(PauseRoundResponse.encode(value).finish()),
		responseDeserialize: (value: Buffer) => PauseRoundResponse.decode(value),
	},
	concludeRound: {
		path: '/admin.Admin/ConcludeRound',
		requestStream: false,
		responseStream: false,
		requestSerialize: (value: ConcludeRoundRequest) =>
			Buffer.from(ConcludeRoundRequest.encode(value).finish()),
		requestDeserialize: (value: Buffer) => ConcludeRoundRequest.decode(value),
		responseSerialize: (value: ConcludeRoundResponse) =>
			Buffer.from(ConcludeRoundResponse.encode(value).finish()),
		responseDeserialize: (value: Buffer) => ConcludeRoundResponse.decode(value),
	},
} as const

export interface AdminServer extends UntypedServiceImplementation {
	createBatchEntry: handleUnaryCall<CreateBatchEntryRequest, CreateBatchEntryResponse>
	settleBatchEntry: handleUnaryCall<SettleBatchEntryRequest, SettleBatchEntryResponse>
	pauseRound: handleUnaryCall<PauseRoundRequest, PauseRoundResponse>
	concludeRound: handleUnaryCall<ConcludeRoundRequest, ConcludeRoundResponse>
}

export interface AdminClient extends Client {
	createBatchEntry(
		request: CreateBatchEntryRequest,
		callback: (error: ServiceError | null, response: CreateBatchEntryResponse) => void
	): ClientUnaryCall
	createBatchEntry(
		request: CreateBatchEntryRequest,
		metadata: Metadata,
		callback: (error: ServiceError | null, response: CreateBatchEntryResponse) => void
	): ClientUnaryCall
	createBatchEntry(
		request: CreateBatchEntryRequest,
		metadata: Metadata,
		options: Partial<CallOptions>,
		callback: (error: ServiceError | null, response: CreateBatchEntryResponse) => void
	): ClientUnaryCall
	settleBatchEntry(
		request: SettleBatchEntryRequest,
		callback: (error: ServiceError | null, response: SettleBatchEntryResponse) => void
	): ClientUnaryCall
	settleBatchEntry(
		request: SettleBatchEntryRequest,
		metadata: Metadata,
		callback: (error: ServiceError | null, response: SettleBatchEntryResponse) => void
	): ClientUnaryCall
	settleBatchEntry(
		request: SettleBatchEntryRequest,
		metadata: Metadata,
		options: Partial<CallOptions>,
		callback: (error: ServiceError | null, response: SettleBatchEntryResponse) => void
	): ClientUnaryCall
	pauseRound(
		request: PauseRoundRequest,
		callback: (error: ServiceError | null, response: PauseRoundResponse) => void
	): ClientUnaryCall
	pauseRound(
		request: PauseRoundRequest,
		metadata: Metadata,
		callback: (error: ServiceError | null, response: PauseRoundResponse) => void
	): ClientUnaryCall
	pauseRound(
		request: PauseRoundRequest,
		metadata: Metadata,
		options: Partial<CallOptions>,
		callback: (error: ServiceError | null, response: PauseRoundResponse) => void
	): ClientUnaryCall
	concludeRound(
		request: ConcludeRoundRequest,
		callback: (error: ServiceError | null, response: ConcludeRoundResponse) => void
	): ClientUnaryCall
	concludeRound(
		request: ConcludeRoundRequest,
		metadata: Metadata,
		callback: (error: ServiceError | null, response: ConcludeRoundResponse) => void
	): ClientUnaryCall
	concludeRound(
		request: ConcludeRoundRequest,
		metadata: Metadata,
		options: Partial<CallOptions>,
		callback: (error: ServiceError | null, response: ConcludeRoundResponse) => void
	): ClientUnaryCall
}

export const AdminClient = makeGenericClientConstructor(AdminService, 'admin.Admin') as unknown as {
	new (
		address: string,
		credentials: ChannelCredentials,
		options?: Partial<ChannelOptions>
	): AdminClient
	service: typeof AdminService
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
