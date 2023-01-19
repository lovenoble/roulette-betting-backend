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

export interface UserProfileRequest {
  entityId: string
}

export interface UserProfileResponse {
  fareAmount: string
  totalMints: number
  totalBurns: number
}

function createBaseUserProfileRequest(): UserProfileRequest {
  return { entityId: '' }
}

export const UserProfileRequest = {
  encode(message: UserProfileRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.entityId !== '') {
      writer.uint32(10).string(message.entityId)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserProfileRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseUserProfileRequest()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.entityId = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): UserProfileRequest {
    return {
      entityId: isSet(object.entityId) ? String(object.entityId) : '',
    }
  },

  toJSON(message: UserProfileRequest): unknown {
    const obj: any = {}
    message.entityId !== undefined && (obj.entityId = message.entityId)
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<UserProfileRequest>, I>>(object: I): UserProfileRequest {
    const message = createBaseUserProfileRequest()
    message.entityId = object.entityId ?? ''
    return message
  },
}

function createBaseUserProfileResponse(): UserProfileResponse {
  return { fareAmount: '', totalMints: 0, totalBurns: 0 }
}

export const UserProfileResponse = {
  encode(message: UserProfileResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.fareAmount !== '') {
      writer.uint32(10).string(message.fareAmount)
    }
    if (message.totalMints !== 0) {
      writer.uint32(16).int32(message.totalMints)
    }
    if (message.totalBurns !== 0) {
      writer.uint32(24).int32(message.totalBurns)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserProfileResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseUserProfileResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.fareAmount = reader.string()
          break
        case 2:
          message.totalMints = reader.int32()
          break
        case 3:
          message.totalBurns = reader.int32()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): UserProfileResponse {
    return {
      fareAmount: isSet(object.fareAmount) ? String(object.fareAmount) : '',
      totalMints: isSet(object.totalMints) ? Number(object.totalMints) : 0,
      totalBurns: isSet(object.totalBurns) ? Number(object.totalBurns) : 0,
    }
  },

  toJSON(message: UserProfileResponse): unknown {
    const obj: any = {}
    message.fareAmount !== undefined && (obj.fareAmount = message.fareAmount)
    message.totalMints !== undefined && (obj.totalMints = Math.round(message.totalMints))
    message.totalBurns !== undefined && (obj.totalBurns = Math.round(message.totalBurns))
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<UserProfileResponse>, I>>(
    object: I,
  ): UserProfileResponse {
    const message = createBaseUserProfileResponse()
    message.fareAmount = object.fareAmount ?? ''
    message.totalMints = object.totalMints ?? 0
    message.totalBurns = object.totalBurns ?? 0
    return message
  },
}

export type AnalyticsService = typeof AnalyticsService
export const AnalyticsService = {
  userProfile: {
    path: '/analytics.Analytics/UserProfile',
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UserProfileRequest) =>
      Buffer.from(UserProfileRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => UserProfileRequest.decode(value),
    responseSerialize: (value: UserProfileResponse) =>
      Buffer.from(UserProfileResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => UserProfileResponse.decode(value),
  },
} as const

export interface AnalyticsServer extends UntypedServiceImplementation {
  userProfile: handleUnaryCall<UserProfileRequest, UserProfileResponse>
}

export interface AnalyticsClient extends Client {
  userProfile(
    request: UserProfileRequest,
    callback: (error: ServiceError | null, response: UserProfileResponse) => void,
  ): ClientUnaryCall
  userProfile(
    request: UserProfileRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: UserProfileResponse) => void,
  ): ClientUnaryCall
  userProfile(
    request: UserProfileRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: UserProfileResponse) => void,
  ): ClientUnaryCall
}

export const AnalyticsClient = makeGenericClientConstructor(
  AnalyticsService,
  'analytics.Analytics',
) as unknown as {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ChannelOptions>,
  ): AnalyticsClient
  service: typeof AnalyticsService
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
