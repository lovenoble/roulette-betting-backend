import * as jspb from 'google-protobuf'



export class GenerateNonceRequest extends jspb.Message {
  getPublicaddress(): string;
  setPublicaddress(value: string): GenerateNonceRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GenerateNonceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GenerateNonceRequest): GenerateNonceRequest.AsObject;
  static serializeBinaryToWriter(message: GenerateNonceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GenerateNonceRequest;
  static deserializeBinaryFromReader(message: GenerateNonceRequest, reader: jspb.BinaryReader): GenerateNonceRequest;
}

export namespace GenerateNonceRequest {
  export type AsObject = {
    publicaddress: string,
  }
}

export class GenerateNonceResponse extends jspb.Message {
  getNonce(): string;
  setNonce(value: string): GenerateNonceResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GenerateNonceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GenerateNonceResponse): GenerateNonceResponse.AsObject;
  static serializeBinaryToWriter(message: GenerateNonceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GenerateNonceResponse;
  static deserializeBinaryFromReader(message: GenerateNonceResponse, reader: jspb.BinaryReader): GenerateNonceResponse;
}

export namespace GenerateNonceResponse {
  export type AsObject = {
    nonce: string,
  }
}

export class VerifySignatureRequest extends jspb.Message {
  getPublicaddress(): string;
  setPublicaddress(value: string): VerifySignatureRequest;

  getSignature(): string;
  setSignature(value: string): VerifySignatureRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VerifySignatureRequest.AsObject;
  static toObject(includeInstance: boolean, msg: VerifySignatureRequest): VerifySignatureRequest.AsObject;
  static serializeBinaryToWriter(message: VerifySignatureRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VerifySignatureRequest;
  static deserializeBinaryFromReader(message: VerifySignatureRequest, reader: jspb.BinaryReader): VerifySignatureRequest;
}

export namespace VerifySignatureRequest {
  export type AsObject = {
    publicaddress: string,
    signature: string,
  }
}

export class VerifySignatureResponse extends jspb.Message {
  getToken(): string;
  setToken(value: string): VerifySignatureResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VerifySignatureResponse.AsObject;
  static toObject(includeInstance: boolean, msg: VerifySignatureResponse): VerifySignatureResponse.AsObject;
  static serializeBinaryToWriter(message: VerifySignatureResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VerifySignatureResponse;
  static deserializeBinaryFromReader(message: VerifySignatureResponse, reader: jspb.BinaryReader): VerifySignatureResponse;
}

export namespace VerifySignatureResponse {
  export type AsObject = {
    token: string,
  }
}

export class VerifyTokenRequest extends jspb.Message {
  getToken(): string;
  setToken(value: string): VerifyTokenRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VerifyTokenRequest.AsObject;
  static toObject(includeInstance: boolean, msg: VerifyTokenRequest): VerifyTokenRequest.AsObject;
  static serializeBinaryToWriter(message: VerifyTokenRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VerifyTokenRequest;
  static deserializeBinaryFromReader(message: VerifyTokenRequest, reader: jspb.BinaryReader): VerifyTokenRequest;
}

export namespace VerifyTokenRequest {
  export type AsObject = {
    token: string,
  }
}

export class VerifyTokenResponse extends jspb.Message {
  getPublicaddress(): string;
  setPublicaddress(value: string): VerifyTokenResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VerifyTokenResponse.AsObject;
  static toObject(includeInstance: boolean, msg: VerifyTokenResponse): VerifyTokenResponse.AsObject;
  static serializeBinaryToWriter(message: VerifyTokenResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VerifyTokenResponse;
  static deserializeBinaryFromReader(message: VerifyTokenResponse, reader: jspb.BinaryReader): VerifyTokenResponse;
}

export namespace VerifyTokenResponse {
  export type AsObject = {
    publicaddress: string,
  }
}

export class CreateRequest extends jspb.Message {
  getUsername(): string;
  setUsername(value: string): CreateRequest;

  getPassword(): string;
  setPassword(value: string): CreateRequest;

  getSessionid(): string;
  setSessionid(value: string): CreateRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateRequest): CreateRequest.AsObject;
  static serializeBinaryToWriter(message: CreateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateRequest;
  static deserializeBinaryFromReader(message: CreateRequest, reader: jspb.BinaryReader): CreateRequest;
}

export namespace CreateRequest {
  export type AsObject = {
    username: string,
    password: string,
    sessionid: string,
  }
}

export class CreateResponse extends jspb.Message {
  getToken(): string;
  setToken(value: string): CreateResponse;

  getSessionid(): string;
  setSessionid(value: string): CreateResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateResponse): CreateResponse.AsObject;
  static serializeBinaryToWriter(message: CreateResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateResponse;
  static deserializeBinaryFromReader(message: CreateResponse, reader: jspb.BinaryReader): CreateResponse;
}

export namespace CreateResponse {
  export type AsObject = {
    token: string,
    sessionid: string,
  }
}

export class LoginRequest extends jspb.Message {
  getUsername(): string;
  setUsername(value: string): LoginRequest;

  getPassword(): string;
  setPassword(value: string): LoginRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LoginRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LoginRequest): LoginRequest.AsObject;
  static serializeBinaryToWriter(message: LoginRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LoginRequest;
  static deserializeBinaryFromReader(message: LoginRequest, reader: jspb.BinaryReader): LoginRequest;
}

export namespace LoginRequest {
  export type AsObject = {
    username: string,
    password: string,
  }
}

export class LoginResponse extends jspb.Message {
  getToken(): string;
  setToken(value: string): LoginResponse;

  getSessionid(): string;
  setSessionid(value: string): LoginResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LoginResponse.AsObject;
  static toObject(includeInstance: boolean, msg: LoginResponse): LoginResponse.AsObject;
  static serializeBinaryToWriter(message: LoginResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LoginResponse;
  static deserializeBinaryFromReader(message: LoginResponse, reader: jspb.BinaryReader): LoginResponse;
}

export namespace LoginResponse {
  export type AsObject = {
    token: string,
    sessionid: string,
  }
}

export class LogoutRequest extends jspb.Message {
  getToken(): string;
  setToken(value: string): LogoutRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LogoutRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LogoutRequest): LogoutRequest.AsObject;
  static serializeBinaryToWriter(message: LogoutRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LogoutRequest;
  static deserializeBinaryFromReader(message: LogoutRequest, reader: jspb.BinaryReader): LogoutRequest;
}

export namespace LogoutRequest {
  export type AsObject = {
    token: string,
  }
}

export class LogoutResponse extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): LogoutResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LogoutResponse.AsObject;
  static toObject(includeInstance: boolean, msg: LogoutResponse): LogoutResponse.AsObject;
  static serializeBinaryToWriter(message: LogoutResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LogoutResponse;
  static deserializeBinaryFromReader(message: LogoutResponse, reader: jspb.BinaryReader): LogoutResponse;
}

export namespace LogoutResponse {
  export type AsObject = {
    message: string,
  }
}

