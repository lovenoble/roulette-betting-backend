// package: admin
// file: admin.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class CreateSeedAccountsRequest extends jspb.Message { 
    getToken(): string;
    setToken(value: string): CreateSeedAccountsRequest;
    getCount(): number;
    setCount(value: number): CreateSeedAccountsRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateSeedAccountsRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CreateSeedAccountsRequest): CreateSeedAccountsRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateSeedAccountsRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateSeedAccountsRequest;
    static deserializeBinaryFromReader(message: CreateSeedAccountsRequest, reader: jspb.BinaryReader): CreateSeedAccountsRequest;
}

export namespace CreateSeedAccountsRequest {
    export type AsObject = {
        token: string,
        count: number,
    }
}

export class CreateSeedAccountsResponse extends jspb.Message { 
    getStatus(): string;
    setStatus(value: string): CreateSeedAccountsResponse;
    clearAccountsList(): void;
    getAccountsList(): Array<string>;
    setAccountsList(value: Array<string>): CreateSeedAccountsResponse;
    addAccounts(value: string, index?: number): string;
    clearCreatedaccountsList(): void;
    getCreatedaccountsList(): Array<string>;
    setCreatedaccountsList(value: Array<string>): CreateSeedAccountsResponse;
    addCreatedaccounts(value: string, index?: number): string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateSeedAccountsResponse.AsObject;
    static toObject(includeInstance: boolean, msg: CreateSeedAccountsResponse): CreateSeedAccountsResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateSeedAccountsResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateSeedAccountsResponse;
    static deserializeBinaryFromReader(message: CreateSeedAccountsResponse, reader: jspb.BinaryReader): CreateSeedAccountsResponse;
}

export namespace CreateSeedAccountsResponse {
    export type AsObject = {
        status: string,
        accountsList: Array<string>,
        createdaccountsList: Array<string>,
    }
}

export class GetSeedAccountsRequest extends jspb.Message { 
    getToken(): string;
    setToken(value: string): GetSeedAccountsRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetSeedAccountsRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetSeedAccountsRequest): GetSeedAccountsRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetSeedAccountsRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetSeedAccountsRequest;
    static deserializeBinaryFromReader(message: GetSeedAccountsRequest, reader: jspb.BinaryReader): GetSeedAccountsRequest;
}

export namespace GetSeedAccountsRequest {
    export type AsObject = {
        token: string,
    }
}

export class GetSeedAccountsResponse extends jspb.Message { 
    getStatus(): string;
    setStatus(value: string): GetSeedAccountsResponse;
    clearAccountsList(): void;
    getAccountsList(): Array<string>;
    setAccountsList(value: Array<string>): GetSeedAccountsResponse;
    addAccounts(value: string, index?: number): string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetSeedAccountsResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetSeedAccountsResponse): GetSeedAccountsResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetSeedAccountsResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetSeedAccountsResponse;
    static deserializeBinaryFromReader(message: GetSeedAccountsResponse, reader: jspb.BinaryReader): GetSeedAccountsResponse;
}

export namespace GetSeedAccountsResponse {
    export type AsObject = {
        status: string,
        accountsList: Array<string>,
    }
}

export class CreateBatchEntryRequest extends jspb.Message { 
    getToken(): string;
    setToken(value: string): CreateBatchEntryRequest;
    getSeedidx(): number;
    setSeedidx(value: number): CreateBatchEntryRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateBatchEntryRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CreateBatchEntryRequest): CreateBatchEntryRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateBatchEntryRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateBatchEntryRequest;
    static deserializeBinaryFromReader(message: CreateBatchEntryRequest, reader: jspb.BinaryReader): CreateBatchEntryRequest;
}

export namespace CreateBatchEntryRequest {
    export type AsObject = {
        token: string,
        seedidx: number,
    }
}

export class CreateBatchEntryResponse extends jspb.Message { 
    getStatus(): string;
    setStatus(value: string): CreateBatchEntryResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateBatchEntryResponse.AsObject;
    static toObject(includeInstance: boolean, msg: CreateBatchEntryResponse): CreateBatchEntryResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateBatchEntryResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateBatchEntryResponse;
    static deserializeBinaryFromReader(message: CreateBatchEntryResponse, reader: jspb.BinaryReader): CreateBatchEntryResponse;
}

export namespace CreateBatchEntryResponse {
    export type AsObject = {
        status: string,
    }
}

export class SettleBatchEntryRequest extends jspb.Message { 
    getToken(): string;
    setToken(value: string): SettleBatchEntryRequest;
    getRoundid(): number;
    setRoundid(value: number): SettleBatchEntryRequest;
    getSeedidx(): number;
    setSeedidx(value: number): SettleBatchEntryRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SettleBatchEntryRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SettleBatchEntryRequest): SettleBatchEntryRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SettleBatchEntryRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SettleBatchEntryRequest;
    static deserializeBinaryFromReader(message: SettleBatchEntryRequest, reader: jspb.BinaryReader): SettleBatchEntryRequest;
}

export namespace SettleBatchEntryRequest {
    export type AsObject = {
        token: string,
        roundid: number,
        seedidx: number,
    }
}

export class SettleBatchEntryResponse extends jspb.Message { 
    getStatus(): string;
    setStatus(value: string): SettleBatchEntryResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SettleBatchEntryResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SettleBatchEntryResponse): SettleBatchEntryResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SettleBatchEntryResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SettleBatchEntryResponse;
    static deserializeBinaryFromReader(message: SettleBatchEntryResponse, reader: jspb.BinaryReader): SettleBatchEntryResponse;
}

export namespace SettleBatchEntryResponse {
    export type AsObject = {
        status: string,
    }
}

export class PauseRoundRequest extends jspb.Message { 
    getToken(): string;
    setToken(value: string): PauseRoundRequest;
    getIspaused(): boolean;
    setIspaused(value: boolean): PauseRoundRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PauseRoundRequest.AsObject;
    static toObject(includeInstance: boolean, msg: PauseRoundRequest): PauseRoundRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PauseRoundRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PauseRoundRequest;
    static deserializeBinaryFromReader(message: PauseRoundRequest, reader: jspb.BinaryReader): PauseRoundRequest;
}

export namespace PauseRoundRequest {
    export type AsObject = {
        token: string,
        ispaused: boolean,
    }
}

export class PauseRoundResponse extends jspb.Message { 
    getStatus(): string;
    setStatus(value: string): PauseRoundResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PauseRoundResponse.AsObject;
    static toObject(includeInstance: boolean, msg: PauseRoundResponse): PauseRoundResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PauseRoundResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PauseRoundResponse;
    static deserializeBinaryFromReader(message: PauseRoundResponse, reader: jspb.BinaryReader): PauseRoundResponse;
}

export namespace PauseRoundResponse {
    export type AsObject = {
        status: string,
    }
}

export class ConcludeRoundRequest extends jspb.Message { 
    getToken(): string;
    setToken(value: string): ConcludeRoundRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConcludeRoundRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ConcludeRoundRequest): ConcludeRoundRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConcludeRoundRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConcludeRoundRequest;
    static deserializeBinaryFromReader(message: ConcludeRoundRequest, reader: jspb.BinaryReader): ConcludeRoundRequest;
}

export namespace ConcludeRoundRequest {
    export type AsObject = {
        token: string,
    }
}

export class ConcludeRoundResponse extends jspb.Message { 
    getStatus(): string;
    setStatus(value: string): ConcludeRoundResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConcludeRoundResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ConcludeRoundResponse): ConcludeRoundResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConcludeRoundResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConcludeRoundResponse;
    static deserializeBinaryFromReader(message: ConcludeRoundResponse, reader: jspb.BinaryReader): ConcludeRoundResponse;
}

export namespace ConcludeRoundResponse {
    export type AsObject = {
        status: string,
    }
}
