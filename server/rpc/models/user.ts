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

export enum UserColorTheme {
	BLUE = 0,
	ORANGE = 1,
	PINK = 2,
	UNRECOGNIZED = -1,
}

export function userColorThemeFromJSON(object: any): UserColorTheme {
	switch (object) {
		case 0:
		case 'BLUE':
			return UserColorTheme.BLUE
		case 1:
		case 'ORANGE':
			return UserColorTheme.ORANGE
		case 2:
		case 'PINK':
			return UserColorTheme.PINK
		case -1:
		case 'UNRECOGNIZED':
		default:
			return UserColorTheme.UNRECOGNIZED
	}
}

export function userColorThemeToJSON(object: UserColorTheme): string {
	switch (object) {
		case UserColorTheme.BLUE:
			return 'BLUE'
		case UserColorTheme.ORANGE:
			return 'ORANGE'
		case UserColorTheme.PINK:
			return 'PINK'
		case UserColorTheme.UNRECOGNIZED:
		default:
			return 'UNRECOGNIZED'
	}
}

export interface SetUserDataRequest {
	token: string
	username?: string | undefined
	email?: string | undefined
	colorTheme?: UserColorTheme | undefined
}

export interface SetUserDataResponse {
	message: string
}

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

export interface LogoutRequest {
	token: string
}

export interface LogoutResponse {
	message: string
}

function createBaseSetUserDataRequest(): SetUserDataRequest {
	return { token: '', username: undefined, email: undefined, colorTheme: undefined }
}

export const SetUserDataRequest = {
	encode(message: SetUserDataRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
		if (message.token !== '') {
			writer.uint32(10).string(message.token)
		}
		if (message.username !== undefined) {
			writer.uint32(18).string(message.username)
		}
		if (message.email !== undefined) {
			writer.uint32(26).string(message.email)
		}
		if (message.colorTheme !== undefined) {
			writer.uint32(32).int32(message.colorTheme)
		}
		return writer
	},

	decode(input: _m0.Reader | Uint8Array, length?: number): SetUserDataRequest {
		const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
		let end = length === undefined ? reader.len : reader.pos + length
		const message = createBaseSetUserDataRequest()
		while (reader.pos < end) {
			const tag = reader.uint32()
			switch (tag >>> 3) {
				case 1:
					message.token = reader.string()
					break
				case 2:
					message.username = reader.string()
					break
				case 3:
					message.email = reader.string()
					break
				case 4:
					message.colorTheme = reader.int32() as any
					break
				default:
					reader.skipType(tag & 7)
					break
			}
		}
		return message
	},

	fromJSON(object: any): SetUserDataRequest {
		return {
			token: isSet(object.token) ? String(object.token) : '',
			username: isSet(object.username) ? String(object.username) : undefined,
			email: isSet(object.email) ? String(object.email) : undefined,
			colorTheme: isSet(object.colorTheme)
				? userColorThemeFromJSON(object.colorTheme)
				: undefined,
		}
	},

	toJSON(message: SetUserDataRequest): unknown {
		const obj: any = {}
		message.token !== undefined && (obj.token = message.token)
		message.username !== undefined && (obj.username = message.username)
		message.email !== undefined && (obj.email = message.email)
		message.colorTheme !== undefined &&
			(obj.colorTheme =
				message.colorTheme !== undefined
					? userColorThemeToJSON(message.colorTheme)
					: undefined)
		return obj
	},

	fromPartial<I extends Exact<DeepPartial<SetUserDataRequest>, I>>(
		object: I,
	): SetUserDataRequest {
		const message = createBaseSetUserDataRequest()
		message.token = object.token ?? ''
		message.username = object.username ?? undefined
		message.email = object.email ?? undefined
		message.colorTheme = object.colorTheme ?? undefined
		return message
	},
}

function createBaseSetUserDataResponse(): SetUserDataResponse {
	return { message: '' }
}

export const SetUserDataResponse = {
	encode(message: SetUserDataResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
		if (message.message !== '') {
			writer.uint32(10).string(message.message)
		}
		return writer
	},

	decode(input: _m0.Reader | Uint8Array, length?: number): SetUserDataResponse {
		const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
		let end = length === undefined ? reader.len : reader.pos + length
		const message = createBaseSetUserDataResponse()
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

	fromJSON(object: any): SetUserDataResponse {
		return {
			message: isSet(object.message) ? String(object.message) : '',
		}
	},

	toJSON(message: SetUserDataResponse): unknown {
		const obj: any = {}
		message.message !== undefined && (obj.message = message.message)
		return obj
	},

	fromPartial<I extends Exact<DeepPartial<SetUserDataResponse>, I>>(
		object: I,
	): SetUserDataResponse {
		const message = createBaseSetUserDataResponse()
		message.message = object.message ?? ''
		return message
	},
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
		object: I,
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
		object: I,
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
		object: I,
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
		object: I,
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
		object: I,
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
		object: I,
	): VerifyTokenResponse {
		const message = createBaseVerifyTokenResponse()
		message.publicAddress = object.publicAddress ?? ''
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

export type UserService = typeof UserService
export const UserService = {
	generateNonce: {
		path: '/user.User/GenerateNonce',
		requestStream: false,
		responseStream: false,
		requestSerialize: (value: GenerateNonceRequest) =>
			Buffer.from(GenerateNonceRequest.encode(value).finish()),
		requestDeserialize: (value: Buffer) => GenerateNonceRequest.decode(value),
		responseSerialize: (value: GenerateNonceResponse) =>
			Buffer.from(GenerateNonceResponse.encode(value).finish()),
		responseDeserialize: (value: Buffer) => GenerateNonceResponse.decode(value),
	},
	logout: {
		path: '/user.User/Logout',
		requestStream: false,
		responseStream: false,
		requestSerialize: (value: LogoutRequest) =>
			Buffer.from(LogoutRequest.encode(value).finish()),
		requestDeserialize: (value: Buffer) => LogoutRequest.decode(value),
		responseSerialize: (value: LogoutResponse) =>
			Buffer.from(LogoutResponse.encode(value).finish()),
		responseDeserialize: (value: Buffer) => LogoutResponse.decode(value),
	},
	verifySignature: {
		path: '/user.User/VerifySignature',
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
		path: '/user.User/VerifyToken',
		requestStream: false,
		responseStream: false,
		requestSerialize: (value: VerifyTokenRequest) =>
			Buffer.from(VerifyTokenRequest.encode(value).finish()),
		requestDeserialize: (value: Buffer) => VerifyTokenRequest.decode(value),
		responseSerialize: (value: VerifyTokenResponse) =>
			Buffer.from(VerifyTokenResponse.encode(value).finish()),
		responseDeserialize: (value: Buffer) => VerifyTokenResponse.decode(value),
	},
	setUserData: {
		path: '/user.User/SetUserData',
		requestStream: false,
		responseStream: false,
		requestSerialize: (value: SetUserDataRequest) =>
			Buffer.from(SetUserDataRequest.encode(value).finish()),
		requestDeserialize: (value: Buffer) => SetUserDataRequest.decode(value),
		responseSerialize: (value: SetUserDataResponse) =>
			Buffer.from(SetUserDataResponse.encode(value).finish()),
		responseDeserialize: (value: Buffer) => SetUserDataResponse.decode(value),
	},
} as const

export interface UserServer extends UntypedServiceImplementation {
	generateNonce: handleUnaryCall<GenerateNonceRequest, GenerateNonceResponse>
	logout: handleUnaryCall<LogoutRequest, LogoutResponse>
	verifySignature: handleUnaryCall<VerifySignatureRequest, VerifySignatureResponse>
	verifyToken: handleUnaryCall<VerifyTokenRequest, VerifyTokenResponse>
	setUserData: handleUnaryCall<SetUserDataRequest, SetUserDataResponse>
}

export interface UserClient extends Client {
	generateNonce(
		request: GenerateNonceRequest,
		callback: (error: ServiceError | null, response: GenerateNonceResponse) => void,
	): ClientUnaryCall
	generateNonce(
		request: GenerateNonceRequest,
		metadata: Metadata,
		callback: (error: ServiceError | null, response: GenerateNonceResponse) => void,
	): ClientUnaryCall
	generateNonce(
		request: GenerateNonceRequest,
		metadata: Metadata,
		options: Partial<CallOptions>,
		callback: (error: ServiceError | null, response: GenerateNonceResponse) => void,
	): ClientUnaryCall
	logout(
		request: LogoutRequest,
		callback: (error: ServiceError | null, response: LogoutResponse) => void,
	): ClientUnaryCall
	logout(
		request: LogoutRequest,
		metadata: Metadata,
		callback: (error: ServiceError | null, response: LogoutResponse) => void,
	): ClientUnaryCall
	logout(
		request: LogoutRequest,
		metadata: Metadata,
		options: Partial<CallOptions>,
		callback: (error: ServiceError | null, response: LogoutResponse) => void,
	): ClientUnaryCall
	verifySignature(
		request: VerifySignatureRequest,
		callback: (error: ServiceError | null, response: VerifySignatureResponse) => void,
	): ClientUnaryCall
	verifySignature(
		request: VerifySignatureRequest,
		metadata: Metadata,
		callback: (error: ServiceError | null, response: VerifySignatureResponse) => void,
	): ClientUnaryCall
	verifySignature(
		request: VerifySignatureRequest,
		metadata: Metadata,
		options: Partial<CallOptions>,
		callback: (error: ServiceError | null, response: VerifySignatureResponse) => void,
	): ClientUnaryCall
	verifyToken(
		request: VerifyTokenRequest,
		callback: (error: ServiceError | null, response: VerifyTokenResponse) => void,
	): ClientUnaryCall
	verifyToken(
		request: VerifyTokenRequest,
		metadata: Metadata,
		callback: (error: ServiceError | null, response: VerifyTokenResponse) => void,
	): ClientUnaryCall
	verifyToken(
		request: VerifyTokenRequest,
		metadata: Metadata,
		options: Partial<CallOptions>,
		callback: (error: ServiceError | null, response: VerifyTokenResponse) => void,
	): ClientUnaryCall
	setUserData(
		request: SetUserDataRequest,
		callback: (error: ServiceError | null, response: SetUserDataResponse) => void,
	): ClientUnaryCall
	setUserData(
		request: SetUserDataRequest,
		metadata: Metadata,
		callback: (error: ServiceError | null, response: SetUserDataResponse) => void,
	): ClientUnaryCall
	setUserData(
		request: SetUserDataRequest,
		metadata: Metadata,
		options: Partial<CallOptions>,
		callback: (error: ServiceError | null, response: SetUserDataResponse) => void,
	): ClientUnaryCall
}

export const UserClient = makeGenericClientConstructor(UserService, 'user.User') as unknown as {
	new (
		address: string,
		credentials: ChannelCredentials,
		options?: Partial<ChannelOptions>,
	): UserClient
	service: typeof UserService
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
