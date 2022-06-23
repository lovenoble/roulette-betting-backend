// package: analytics
// file: analytics.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class UserProfileRequest extends jspb.Message { 
    getEntityid(): string;
    setEntityid(value: string): UserProfileRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UserProfileRequest.AsObject;
    static toObject(includeInstance: boolean, msg: UserProfileRequest): UserProfileRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UserProfileRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UserProfileRequest;
    static deserializeBinaryFromReader(message: UserProfileRequest, reader: jspb.BinaryReader): UserProfileRequest;
}

export namespace UserProfileRequest {
    export type AsObject = {
        entityid: string,
    }
}

export class UserProfileResponse extends jspb.Message { 
    getFareamount(): string;
    setFareamount(value: string): UserProfileResponse;
    getTotalwins(): number;
    setTotalwins(value: number): UserProfileResponse;
    getTotallosses(): number;
    setTotallosses(value: number): UserProfileResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UserProfileResponse.AsObject;
    static toObject(includeInstance: boolean, msg: UserProfileResponse): UserProfileResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UserProfileResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UserProfileResponse;
    static deserializeBinaryFromReader(message: UserProfileResponse, reader: jspb.BinaryReader): UserProfileResponse;
}

export namespace UserProfileResponse {
    export type AsObject = {
        fareamount: string,
        totalwins: number,
        totallosses: number,
    }
}
