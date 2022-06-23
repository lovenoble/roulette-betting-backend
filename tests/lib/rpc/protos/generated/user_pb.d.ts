// package: user
// file: user.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class SetUserDataRequest extends jspb.Message { 
    getToken(): string;
    setToken(value: string): SetUserDataRequest;

    hasUsername(): boolean;
    clearUsername(): void;
    getUsername(): string | undefined;
    setUsername(value: string): SetUserDataRequest;

    hasEmail(): boolean;
    clearEmail(): void;
    getEmail(): string | undefined;
    setEmail(value: string): SetUserDataRequest;

    hasColortheme(): boolean;
    clearColortheme(): void;
    getColortheme(): UserColorTheme | undefined;
    setColortheme(value: UserColorTheme): SetUserDataRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SetUserDataRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SetUserDataRequest): SetUserDataRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SetUserDataRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SetUserDataRequest;
    static deserializeBinaryFromReader(message: SetUserDataRequest, reader: jspb.BinaryReader): SetUserDataRequest;
}

export namespace SetUserDataRequest {
    export type AsObject = {
        token: string,
        username?: string,
        email?: string,
        colortheme?: UserColorTheme,
    }
}

export class SetUserDataResponse extends jspb.Message { 
    getMessage(): string;
    setMessage(value: string): SetUserDataResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SetUserDataResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SetUserDataResponse): SetUserDataResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SetUserDataResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SetUserDataResponse;
    static deserializeBinaryFromReader(message: SetUserDataResponse, reader: jspb.BinaryReader): SetUserDataResponse;
}

export namespace SetUserDataResponse {
    export type AsObject = {
        message: string,
    }
}

export class GenerateNonceRequest extends jspb.Message { 
    getPublicaddress(): string;
    setPublicaddress(value: string): GenerateNonceRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GenerateNonceRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GenerateNonceRequest): GenerateNonceRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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
    getSigningmessage(): string;
    setSigningmessage(value: string): GenerateNonceResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GenerateNonceResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GenerateNonceResponse): GenerateNonceResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GenerateNonceResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GenerateNonceResponse;
    static deserializeBinaryFromReader(message: GenerateNonceResponse, reader: jspb.BinaryReader): GenerateNonceResponse;
}

export namespace GenerateNonceResponse {
    export type AsObject = {
        nonce: string,
        signingmessage: string,
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
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: VerifyTokenResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): VerifyTokenResponse;
    static deserializeBinaryFromReader(message: VerifyTokenResponse, reader: jspb.BinaryReader): VerifyTokenResponse;
}

export namespace VerifyTokenResponse {
    export type AsObject = {
        publicaddress: string,
    }
}

export class LogoutRequest extends jspb.Message { 
    getToken(): string;
    setToken(value: string): LogoutRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LogoutRequest.AsObject;
    static toObject(includeInstance: boolean, msg: LogoutRequest): LogoutRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
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
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LogoutResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LogoutResponse;
    static deserializeBinaryFromReader(message: LogoutResponse, reader: jspb.BinaryReader): LogoutResponse;
}

export namespace LogoutResponse {
    export type AsObject = {
        message: string,
    }
}

export enum UserColorTheme {
    BLUE = 0,
    ORANGE = 1,
    PINK = 2,
}
