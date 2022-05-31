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
import * as _m0 from 'protobufjs/minimal'

export interface GenerateNonceRequest {
	publicAddress: string
}

export interface GenerateNonceResponse {
	nonce: string
	signingMessage: string
}

export interface VerifySignatureRequest {
	publicAddress: string
	signature: string
}

export interface VerifySignatureResponse {
	token: string
}

export interface VerifyTokenRequest {
	token: string
}

export interface VerifyTokenResponse {
	publicAddress: string
}

export interface CreateRequest {
	username: string
	password: string
	sessionId: string
}

export interface CreateResponse {
	token: string
	sessionId: string
}

export interface LoginRequest {
	username: string
	password: string
}

export interface LoginResponse {
	token: string
	sessionId: string
}

export interface LogoutRequest {
	token: string
}

export interface LogoutResponse {
	message: string
}

function createBaseGenerateNonceRequest(): GenerateNonceRequest {
	return { publicAddress: '' }
}

export const GenerateNonceRequest = {
	encode(message: GenerateNonceRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
		if (message.publicAddress !== '') {
			writer.uint32(10).string(message.publicAddress)
		}
		return writer
	},

	decode(input: _m0.Reader | Uint8Array, length?: number): GenerateNonceRequest {
		const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
		let end = length === undefined ? reader.len : reader.pos + length
		const message = createBaseGenerateNonceRequest()
		while (reader.pos < end) {
			const tag = reader.uint32()
			switch (tag >>> 3) {
				case 1:
					message.publicAddress = reader.string()
					break
				default:
					reader.skipType(tag & 7)
					break
			}
		}
		return message
	},

	fromJSON(object: any): GenerateNonceRequest {
		return {
			publicAddress: isSet(object.publicAddress) ? String(object.publicAddress) : '',
		}
	},

	toJSON(message: GenerateNonceRequest): unknown {
		const obj: any = {}
		message.publicAddress !== undefined && (obj.publicAddress = message.publicAddress)
		return obj
	},

	fromPartial<I extends Exact<DeepPartial<GenerateNonceRequest>, I>>(
		object: I
	): GenerateNonceRequest {
		const message = createBaseGenerateNonceRequest()
		message.publicAddress = object.publicAddress ?? ''
		return message
	},
}

function createBaseGenerateNonceResponse(): GenerateNonceResponse {
	return { nonce: '', signingMessage: '' }
}

export const GenerateNonceResponse = {
	encode(message: GenerateNonceResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
		if (message.nonce !== '') {
			writer.uint32(10).string(message.nonce)
		}
		if (message.signingMessage !== '') {
			writer.uint32(18).string(message.signingMessage)
		}
		return writer
	},

	decode(input: _m0.Reader | Uint8Array, length?: number): GenerateNonceResponse {
		const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
		let end = length === undefined ? reader.len : reader.pos + length
		const message = createBaseGenerateNonceResponse()
		while (reader.pos < end) {
			const tag = reader.uint32()
			switch (tag >>> 3) {
				case 1:
					message.nonce = reader.string()
					break
				case 2:
					message.signingMessage = reader.string()
					break
				default:
					reader.skipType(tag & 7)
					break
			}
		}
		return message
	},

	fromJSON(object: any): GenerateNonceResponse {
		return {
			nonce: isSet(object.nonce) ? String(object.nonce) : '',
			signingMessage: isSet(object.signingMessage) ? String(object.signingMessage) : '',
		}
	},

	toJSON(message: GenerateNonceResponse): unknown {
		const obj: any = {}
		message.nonce !== undefined && (obj.nonce = message.nonce)
		message.signingMessage !== undefined && (obj.signingMessage = message.signingMessage)
		return obj
	},

	fromPartial<I extends Exact<DeepPartial<GenerateNonceResponse>, I>>(
		object: I
	): GenerateNonceResponse {
		const message = createBaseGenerateNonceResponse()
		message.nonce = object.nonce ?? ''
		message.signingMessage = object.signingMessage ?? ''
		return message
	},
}

function createBaseVerifySignatureRequest(): VerifySignatureRequest {
	return { publicAddress: '', signature: '' }
}

export const VerifySignatureRequest = {
	encode(message: VerifySignatureRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
		if (message.publicAddress !== '') {
			writer.uint32(10).string(message.publicAddress)
		}
		if (message.signature !== '') {
			writer.uint32(18).string(message.signature)
		}
		return writer
	},

	decode(input: _m0.Reader | Uint8Array, length?: number): VerifySignatureRequest {
		const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
		let end = length === undefined ? reader.len : reader.pos + length
		const message = createBaseVerifySignatureRequest()
		while (reader.pos < end) {
			const tag = reader.uint32()
			switch (tag >>> 3) {
				case 1:
					message.publicAddress = reader.string()
					break
				case 2:
					message.signature = reader.string()
					break
				default:
					reader.skipType(tag & 7)
					break
			}
		}
		return message
	},

	fromJSON(object: any): VerifySignatureRequest {
		return {
			publicAddress: isSet(object.publicAddress) ? String(object.publicAddress) : '',
			signature: isSet(object.signature) ? String(object.signature) : '',
		}
	},

	toJSON(message: VerifySignatureRequest): unknown {
		const obj: any = {}
		message.publicAddress !== undefined && (obj.publicAddress = message.publicAddress)
		message.signature !== undefined && (obj.signature = message.signature)
		return obj
	},

	fromPartial<I extends Exact<DeepPartial<VerifySignatureRequest>, I>>(
		object: I
	): VerifySignatureRequest {
		const message = createBaseVerifySignatureRequest()
		message.publicAddress = object.publicAddress ?? ''
		message.signature = object.signature ?? ''
		return message
	},
}

function createBaseVerifySignatureResponse(): VerifySignatureResponse {
	return { token: '' }
}

export const VerifySignatureResponse = {
	encode(message: VerifySignatureResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
		if (message.token !== '') {
			writer.uint32(10).string(message.token)
		}
		return writer
	},

	decode(input: _m0.Reader | Uint8Array, length?: number): VerifySignatureResponse {
		const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
		let end = length === undefined ? reader.len : reader.pos + length
		const message = createBaseVerifySignatureResponse()
		while (reader.pos < end) {
			const tag = reader.uint32()
			switch (tag >>> 3) {
				case 1:
					message.token = reader.string()
					break
				default:
					reader.skipType(tag & 7)
					break
			}
		}
		return message
	},

	fromJSON(object: any): VerifySignatureResponse {
		return {
			token: isSet(object.token) ? String(object.token) : '',
		}
	},

	toJSON(message: VerifySignatureResponse): unknown {
		const obj: any = {}
		message.token !== undefined && (obj.token = message.token)
		return obj
	},

	fromPartial<I extends Exact<DeepPartial<VerifySignatureResponse>, I>>(
		object: I
	): VerifySignatureResponse {
		const message = createBaseVerifySignatureResponse()
		message.token = object.token ?? ''
		return message
	},
}

function createBaseVerifyTokenRequest(): VerifyTokenRequest {
	return { token: '' }
}

export const VerifyTokenRequest = {
	encode(message: VerifyTokenRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
		if (message.token !== '') {
			writer.uint32(10).string(message.token)
		}
		return writer
	},

	decode(input: _m0.Reader | Uint8Array, length?: number): VerifyTokenRequest {
		const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
		let end = length === undefined ? reader.len : reader.pos + length
		const message = createBaseVerifyTokenRequest()
		while (reader.pos < end) {
			const tag = reader.uint32()
			switch (tag >>> 3) {
				case 1:
					message.token = reader.string()
					break
				default:
					reader.skipType(tag & 7)
					break
			}
		}
		return message
	},

	fromJSON(object: any): VerifyTokenRequest {
		return {
			token: isSet(object.token) ? String(object.token) : '',
		}
	},

	toJSON(message: VerifyTokenRequest): unknown {
		const obj: any = {}
		message.token !== undefined && (obj.token = message.token)
		return obj
	},

	fromPartial<I extends Exact<DeepPartial<VerifyTokenRequest>, I>>(
		object: I
	): VerifyTokenRequest {
		const message = createBaseVerifyTokenRequest()
		message.token = object.token ?? ''
		return message
	},
}

function createBaseVerifyTokenResponse(): VerifyTokenResponse {
	return { publicAddress: '' }
}

export const VerifyTokenResponse = {
	encode(message: VerifyTokenResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
		if (message.publicAddress !== '') {
			writer.uint32(10).string(message.publicAddress)
		}
		return writer
	},

	decode(input: _m0.Reader | Uint8Array, length?: number): VerifyTokenResponse {
		const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
		let end = length === undefined ? reader.len : reader.pos + length
		const message = createBaseVerifyTokenResponse()
		while (reader.pos < end) {
			const tag = reader.uint32()
			switch (tag >>> 3) {
				case 1:
					message.publicAddress = reader.string()
					break
				default:
					reader.skipType(tag & 7)
					break
			}
		}
		return message
	},

	fromJSON(object: any): VerifyTokenResponse {
		return {
			publicAddress: isSet(object.publicAddress) ? String(object.publicAddress) : '',
		}
	},

	toJSON(message: VerifyTokenResponse): unknown {
		const obj: any = {}
		message.publicAddress !== undefined && (obj.publicAddress = message.publicAddress)
		return obj
	},

	fromPartial<I extends Exact<DeepPartial<VerifyTokenResponse>, I>>(
		object: I
	): VerifyTokenResponse {
		const message = createBaseVerifyTokenResponse()
		message.publicAddress = object.publicAddress ?? ''
		return message
	},
}

function createBaseCreateRequest(): CreateRequest {
	return { username: '', password: '', sessionId: '' }
}

export const CreateRequest = {
	encode(message: CreateRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
		if (message.username !== '') {
			writer.uint32(10).string(message.username)
		}
		if (message.password !== '') {
			writer.uint32(18).string(message.password)
		}
		if (message.sessionId !== '') {
			writer.uint32(26).string(message.sessionId)
		}
		return writer
	},

	decode(input: _m0.Reader | Uint8Array, length?: number): CreateRequest {
		const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
		let end = length === undefined ? reader.len : reader.pos + length
		const message = createBaseCreateRequest()
		while (reader.pos < end) {
			const tag = reader.uint32()
			switch (tag >>> 3) {
				case 1:
					message.username = reader.string()
					break
				case 2:
					message.password = reader.string()
					break
				case 3:
					message.sessionId = reader.string()
					break
				default:
					reader.skipType(tag & 7)
					break
			}
		}
		return message
	},

	fromJSON(object: any): CreateRequest {
		return {
			username: isSet(object.username) ? String(object.username) : '',
			password: isSet(object.password) ? String(object.password) : '',
			sessionId: isSet(object.sessionId) ? String(object.sessionId) : '',
		}
	},

	toJSON(message: CreateRequest): unknown {
		const obj: any = {}
		message.username !== undefined && (obj.username = message.username)
		message.password !== undefined && (obj.password = message.password)
		message.sessionId !== undefined && (obj.sessionId = message.sessionId)
		return obj
	},

	fromPartial<I extends Exact<DeepPartial<CreateRequest>, I>>(object: I): CreateRequest {
		const message = createBaseCreateRequest()
		message.username = object.username ?? ''
		message.password = object.password ?? ''
		message.sessionId = object.sessionId ?? ''
		return message
	},
}

function createBaseCreateResponse(): CreateResponse {
	return { token: '', sessionId: '' }
}

export const CreateResponse = {
	encode(message: CreateResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
		if (message.token !== '') {
			writer.uint32(10).string(message.token)
		}
		if (message.sessionId !== '') {
			writer.uint32(18).string(message.sessionId)
		}
		return writer
	},

	decode(input: _m0.Reader | Uint8Array, length?: number): CreateResponse {
		const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
		let end = length === undefined ? reader.len : reader.pos + length
		const message = createBaseCreateResponse()
		while (reader.pos < end) {
			const tag = reader.uint32()
			switch (tag >>> 3) {
				case 1:
					message.token = reader.string()
					break
				case 2:
					message.sessionId = reader.string()
					break
				default:
					reader.skipType(tag & 7)
					break
			}
		}
		return message
	},

	fromJSON(object: any): CreateResponse {
		return {
			token: isSet(object.token) ? String(object.token) : '',
			sessionId: isSet(object.sessionId) ? String(object.sessionId) : '',
		}
	},

	toJSON(message: CreateResponse): unknown {
		const obj: any = {}
		message.token !== undefined && (obj.token = message.token)
		message.sessionId !== undefined && (obj.sessionId = message.sessionId)
		return obj
	},

	fromPartial<I extends Exact<DeepPartial<CreateResponse>, I>>(object: I): CreateResponse {
		const message = createBaseCreateResponse()
		message.token = object.token ?? ''
		message.sessionId = object.sessionId ?? ''
		return message
	},
}

function createBaseLoginRequest(): LoginRequest {
	return { username: '', password: '' }
}

export const LoginRequest = {
	encode(message: LoginRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
		if (message.username !== '') {
			writer.uint32(10).string(message.username)
		}
		if (message.password !== '') {
			writer.uint32(18).string(message.password)
		}
		return writer
	},

	decode(input: _m0.Reader | Uint8Array, length?: number): LoginRequest {
		const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
		let end = length === undefined ? reader.len : reader.pos + length
		const message = createBaseLoginRequest()
		while (reader.pos < end) {
			const tag = reader.uint32()
			switch (tag >>> 3) {
				case 1:
					message.username = reader.string()
					break
				case 2:
					message.password = reader.string()
					break
				default:
					reader.skipType(tag & 7)
					break
			}
		}
		return message
	},

	fromJSON(object: any): LoginRequest {
		return {
			username: isSet(object.username) ? String(object.username) : '',
			password: isSet(object.password) ? String(object.password) : '',
		}
	},

	toJSON(message: LoginRequest): unknown {
		const obj: any = {}
		message.username !== undefined && (obj.username = message.username)
		message.password !== undefined && (obj.password = message.password)
		return obj
	},

	fromPartial<I extends Exact<DeepPartial<LoginRequest>, I>>(object: I): LoginRequest {
		const message = createBaseLoginRequest()
		message.username = object.username ?? ''
		message.password = object.password ?? ''
		return message
	},
}

function createBaseLoginResponse(): LoginResponse {
	return { token: '', sessionId: '' }
}

export const LoginResponse = {
	encode(message: LoginResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
		if (message.token !== '') {
			writer.uint32(10).string(message.token)
		}
		if (message.sessionId !== '') {
			writer.uint32(18).string(message.sessionId)
		}
		return writer
	},

	decode(input: _m0.Reader | Uint8Array, length?: number): LoginResponse {
		const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
		let end = length === undefined ? reader.len : reader.pos + length
		const message = createBaseLoginResponse()
		while (reader.pos < end) {
			const tag = reader.uint32()
			switch (tag >>> 3) {
				case 1:
					message.token = reader.string()
					break
				case 2:
					message.sessionId = reader.string()
					break
				default:
					reader.skipType(tag & 7)
					break
			}
		}
		return message
	},

	fromJSON(object: any): LoginResponse {
		return {
			token: isSet(object.token) ? String(object.token) : '',
			sessionId: isSet(object.sessionId) ? String(object.sessionId) : '',
		}
	},

	toJSON(message: LoginResponse): unknown {
		const obj: any = {}
		message.token !== undefined && (obj.token = message.token)
		message.sessionId !== undefined && (obj.sessionId = message.sessionId)
		return obj
	},

	fromPartial<I extends Exact<DeepPartial<LoginResponse>, I>>(object: I): LoginResponse {
		const message = createBaseLoginResponse()
		message.token = object.token ?? ''
		message.sessionId = object.sessionId ?? ''
		return message
	},
}

function createBaseLogoutRequest(): LogoutRequest {
	return { token: '' }
}

export const LogoutRequest = {
	encode(message: LogoutRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
		if (message.token !== '') {
			writer.uint32(10).string(message.token)
		}
		return writer
	},

	decode(input: _m0.Reader | Uint8Array, length?: number): LogoutRequest {
		const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
		let end = length === undefined ? reader.len : reader.pos + length
		const message = createBaseLogoutRequest()
		while (reader.pos < end) {
			const tag = reader.uint32()
			switch (tag >>> 3) {
				case 1:
					message.token = reader.string()
					break
				default:
					reader.skipType(tag & 7)
					break
			}
		}
		return message
	},

	fromJSON(object: any): LogoutRequest {
		return {
			token: isSet(object.token) ? String(object.token) : '',
		}
	},

	toJSON(message: LogoutRequest): unknown {
		const obj: any = {}
		message.token !== undefined && (obj.token = message.token)
		return obj
	},

	fromPartial<I extends Exact<DeepPartial<LogoutRequest>, I>>(object: I): LogoutRequest {
		const message = createBaseLogoutRequest()
		message.token = object.token ?? ''
		return message
	},
}

function createBaseLogoutResponse(): LogoutResponse {
	return { message: '' }
}

export const LogoutResponse = {
	encode(message: LogoutResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
		if (message.message !== '') {
			writer.uint32(10).string(message.message)
		}
		return writer
	},

	decode(input: _m0.Reader | Uint8Array, length?: number): LogoutResponse {
		const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
		let end = length === undefined ? reader.len : reader.pos + length
		const message = createBaseLogoutResponse()
		while (reader.pos < end) {
			const tag = reader.uint32()
			switch (tag >>> 3) {
				case 1:
					message.message = reader.string()
					break
				default:
					reader.skipType(tag & 7)
					break
			}
		}
		return message
	},

	fromJSON(object: any): LogoutResponse {
		return {
			message: isSet(object.message) ? String(object.message) : '',
		}
	},

	toJSON(message: LogoutResponse): unknown {
		const obj: any = {}
		message.message !== undefined && (obj.message = message.message)
		return obj
	},

	fromPartial<I extends Exact<DeepPartial<LogoutResponse>, I>>(object: I): LogoutResponse {
		const message = createBaseLogoutResponse()
		message.message = object.message ?? ''
		return message
	},
}

export type PlayerService = typeof PlayerService
export const PlayerService = {
	create: {
		path: '/player.Player/Create',
		requestStream: false,
		responseStream: false,
		requestSerialize: (value: CreateRequest) =>
			Buffer.from(CreateRequest.encode(value).finish()),
		requestDeserialize: (value: Buffer) => CreateRequest.decode(value),
		responseSerialize: (value: CreateResponse) =>
			Buffer.from(CreateResponse.encode(value).finish()),
		responseDeserialize: (value: Buffer) => CreateResponse.decode(value),
	},
	login: {
		path: '/player.Player/Login',
		requestStream: false,
		responseStream: false,
		requestSerialize: (value: LoginRequest) => Buffer.from(LoginRequest.encode(value).finish()),
		requestDeserialize: (value: Buffer) => LoginRequest.decode(value),
		responseSerialize: (value: LoginResponse) =>
			Buffer.from(LoginResponse.encode(value).finish()),
		responseDeserialize: (value: Buffer) => LoginResponse.decode(value),
	},
	logout: {
		path: '/player.Player/Logout',
		requestStream: false,
		responseStream: false,
		requestSerialize: (value: LogoutRequest) =>
			Buffer.from(LogoutRequest.encode(value).finish()),
		requestDeserialize: (value: Buffer) => LogoutRequest.decode(value),
		responseSerialize: (value: LogoutResponse) =>
			Buffer.from(LogoutResponse.encode(value).finish()),
		responseDeserialize: (value: Buffer) => LogoutResponse.decode(value),
	},
	generateNonce: {
		path: '/player.Player/GenerateNonce',
		requestStream: false,
		responseStream: false,
		requestSerialize: (value: GenerateNonceRequest) =>
			Buffer.from(GenerateNonceRequest.encode(value).finish()),
		requestDeserialize: (value: Buffer) => GenerateNonceRequest.decode(value),
		responseSerialize: (value: GenerateNonceResponse) =>
			Buffer.from(GenerateNonceResponse.encode(value).finish()),
		responseDeserialize: (value: Buffer) => GenerateNonceResponse.decode(value),
	},
	verifySignature: {
		path: '/player.Player/VerifySignature',
		requestStream: false,
		responseStream: false,
		requestSerialize: (value: VerifySignatureRequest) =>
			Buffer.from(VerifySignatureRequest.encode(value).finish()),
		requestDeserialize: (value: Buffer) => VerifySignatureRequest.decode(value),
		responseSerialize: (value: VerifySignatureResponse) =>
			Buffer.from(VerifySignatureResponse.encode(value).finish()),
		responseDeserialize: (value: Buffer) => VerifySignatureResponse.decode(value),
	},
	verifyToken: {
		path: '/player.Player/VerifyToken',
		requestStream: false,
		responseStream: false,
		requestSerialize: (value: VerifyTokenRequest) =>
			Buffer.from(VerifyTokenRequest.encode(value).finish()),
		requestDeserialize: (value: Buffer) => VerifyTokenRequest.decode(value),
		responseSerialize: (value: VerifyTokenResponse) =>
			Buffer.from(VerifyTokenResponse.encode(value).finish()),
		responseDeserialize: (value: Buffer) => VerifyTokenResponse.decode(value),
	},
} as const

export interface PlayerServer extends UntypedServiceImplementation {
	create: handleUnaryCall<CreateRequest, CreateResponse>
	login: handleUnaryCall<LoginRequest, LoginResponse>
	logout: handleUnaryCall<LogoutRequest, LogoutResponse>
	generateNonce: handleUnaryCall<GenerateNonceRequest, GenerateNonceResponse>
	verifySignature: handleUnaryCall<VerifySignatureRequest, VerifySignatureResponse>
	verifyToken: handleUnaryCall<VerifyTokenRequest, VerifyTokenResponse>
}

export interface PlayerClient extends Client {
	create(
		request: CreateRequest,
		callback: (error: ServiceError | null, response: CreateResponse) => void
	): ClientUnaryCall
	create(
		request: CreateRequest,
		metadata: Metadata,
		callback: (error: ServiceError | null, response: CreateResponse) => void
	): ClientUnaryCall
	create(
		request: CreateRequest,
		metadata: Metadata,
		options: Partial<CallOptions>,
		callback: (error: ServiceError | null, response: CreateResponse) => void
	): ClientUnaryCall
	login(
		request: LoginRequest,
		callback: (error: ServiceError | null, response: LoginResponse) => void
	): ClientUnaryCall
	login(
		request: LoginRequest,
		metadata: Metadata,
		callback: (error: ServiceError | null, response: LoginResponse) => void
	): ClientUnaryCall
	login(
		request: LoginRequest,
		metadata: Metadata,
		options: Partial<CallOptions>,
		callback: (error: ServiceError | null, response: LoginResponse) => void
	): ClientUnaryCall
	logout(
		request: LogoutRequest,
		callback: (error: ServiceError | null, response: LogoutResponse) => void
	): ClientUnaryCall
	logout(
		request: LogoutRequest,
		metadata: Metadata,
		callback: (error: ServiceError | null, response: LogoutResponse) => void
	): ClientUnaryCall
	logout(
		request: LogoutRequest,
		metadata: Metadata,
		options: Partial<CallOptions>,
		callback: (error: ServiceError | null, response: LogoutResponse) => void
	): ClientUnaryCall
	generateNonce(
		request: GenerateNonceRequest,
		callback: (error: ServiceError | null, response: GenerateNonceResponse) => void
	): ClientUnaryCall
	generateNonce(
		request: GenerateNonceRequest,
		metadata: Metadata,
		callback: (error: ServiceError | null, response: GenerateNonceResponse) => void
	): ClientUnaryCall
	generateNonce(
		request: GenerateNonceRequest,
		metadata: Metadata,
		options: Partial<CallOptions>,
		callback: (error: ServiceError | null, response: GenerateNonceResponse) => void
	): ClientUnaryCall
	verifySignature(
		request: VerifySignatureRequest,
		callback: (error: ServiceError | null, response: VerifySignatureResponse) => void
	): ClientUnaryCall
	verifySignature(
		request: VerifySignatureRequest,
		metadata: Metadata,
		callback: (error: ServiceError | null, response: VerifySignatureResponse) => void
	): ClientUnaryCall
	verifySignature(
		request: VerifySignatureRequest,
		metadata: Metadata,
		options: Partial<CallOptions>,
		callback: (error: ServiceError | null, response: VerifySignatureResponse) => void
	): ClientUnaryCall
	verifyToken(
		request: VerifyTokenRequest,
		callback: (error: ServiceError | null, response: VerifyTokenResponse) => void
	): ClientUnaryCall
	verifyToken(
		request: VerifyTokenRequest,
		metadata: Metadata,
		callback: (error: ServiceError | null, response: VerifyTokenResponse) => void
	): ClientUnaryCall
	verifyToken(
		request: VerifyTokenRequest,
		metadata: Metadata,
		options: Partial<CallOptions>,
		callback: (error: ServiceError | null, response: VerifyTokenResponse) => void
	): ClientUnaryCall
}

export const PlayerClient = makeGenericClientConstructor(
	PlayerService,
	'player.Player'
) as unknown as {
	new (
		address: string,
		credentials: ChannelCredentials,
		options?: Partial<ChannelOptions>
	): PlayerClient
	service: typeof PlayerService
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
