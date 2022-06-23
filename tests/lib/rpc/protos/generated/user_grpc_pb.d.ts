// package: user
// file: user.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as user_pb from "./user_pb";

interface IUserService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    generateNonce: IUserService_IGenerateNonce;
    logout: IUserService_ILogout;
    verifySignature: IUserService_IVerifySignature;
    verifyToken: IUserService_IVerifyToken;
    setUserData: IUserService_ISetUserData;
}

interface IUserService_IGenerateNonce extends grpc.MethodDefinition<user_pb.GenerateNonceRequest, user_pb.GenerateNonceResponse> {
    path: "/user.User/GenerateNonce";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<user_pb.GenerateNonceRequest>;
    requestDeserialize: grpc.deserialize<user_pb.GenerateNonceRequest>;
    responseSerialize: grpc.serialize<user_pb.GenerateNonceResponse>;
    responseDeserialize: grpc.deserialize<user_pb.GenerateNonceResponse>;
}
interface IUserService_ILogout extends grpc.MethodDefinition<user_pb.LogoutRequest, user_pb.LogoutResponse> {
    path: "/user.User/Logout";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<user_pb.LogoutRequest>;
    requestDeserialize: grpc.deserialize<user_pb.LogoutRequest>;
    responseSerialize: grpc.serialize<user_pb.LogoutResponse>;
    responseDeserialize: grpc.deserialize<user_pb.LogoutResponse>;
}
interface IUserService_IVerifySignature extends grpc.MethodDefinition<user_pb.VerifySignatureRequest, user_pb.VerifySignatureResponse> {
    path: "/user.User/VerifySignature";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<user_pb.VerifySignatureRequest>;
    requestDeserialize: grpc.deserialize<user_pb.VerifySignatureRequest>;
    responseSerialize: grpc.serialize<user_pb.VerifySignatureResponse>;
    responseDeserialize: grpc.deserialize<user_pb.VerifySignatureResponse>;
}
interface IUserService_IVerifyToken extends grpc.MethodDefinition<user_pb.VerifyTokenRequest, user_pb.VerifyTokenResponse> {
    path: "/user.User/VerifyToken";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<user_pb.VerifyTokenRequest>;
    requestDeserialize: grpc.deserialize<user_pb.VerifyTokenRequest>;
    responseSerialize: grpc.serialize<user_pb.VerifyTokenResponse>;
    responseDeserialize: grpc.deserialize<user_pb.VerifyTokenResponse>;
}
interface IUserService_ISetUserData extends grpc.MethodDefinition<user_pb.SetUserDataRequest, user_pb.SetUserDataResponse> {
    path: "/user.User/SetUserData";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<user_pb.SetUserDataRequest>;
    requestDeserialize: grpc.deserialize<user_pb.SetUserDataRequest>;
    responseSerialize: grpc.serialize<user_pb.SetUserDataResponse>;
    responseDeserialize: grpc.deserialize<user_pb.SetUserDataResponse>;
}

export const UserService: IUserService;

export interface IUserServer {
    generateNonce: grpc.handleUnaryCall<user_pb.GenerateNonceRequest, user_pb.GenerateNonceResponse>;
    logout: grpc.handleUnaryCall<user_pb.LogoutRequest, user_pb.LogoutResponse>;
    verifySignature: grpc.handleUnaryCall<user_pb.VerifySignatureRequest, user_pb.VerifySignatureResponse>;
    verifyToken: grpc.handleUnaryCall<user_pb.VerifyTokenRequest, user_pb.VerifyTokenResponse>;
    setUserData: grpc.handleUnaryCall<user_pb.SetUserDataRequest, user_pb.SetUserDataResponse>;
}

export interface IUserClient {
    generateNonce(request: user_pb.GenerateNonceRequest, callback: (error: grpc.ServiceError | null, response: user_pb.GenerateNonceResponse) => void): grpc.ClientUnaryCall;
    generateNonce(request: user_pb.GenerateNonceRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: user_pb.GenerateNonceResponse) => void): grpc.ClientUnaryCall;
    generateNonce(request: user_pb.GenerateNonceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: user_pb.GenerateNonceResponse) => void): grpc.ClientUnaryCall;
    logout(request: user_pb.LogoutRequest, callback: (error: grpc.ServiceError | null, response: user_pb.LogoutResponse) => void): grpc.ClientUnaryCall;
    logout(request: user_pb.LogoutRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: user_pb.LogoutResponse) => void): grpc.ClientUnaryCall;
    logout(request: user_pb.LogoutRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: user_pb.LogoutResponse) => void): grpc.ClientUnaryCall;
    verifySignature(request: user_pb.VerifySignatureRequest, callback: (error: grpc.ServiceError | null, response: user_pb.VerifySignatureResponse) => void): grpc.ClientUnaryCall;
    verifySignature(request: user_pb.VerifySignatureRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: user_pb.VerifySignatureResponse) => void): grpc.ClientUnaryCall;
    verifySignature(request: user_pb.VerifySignatureRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: user_pb.VerifySignatureResponse) => void): grpc.ClientUnaryCall;
    verifyToken(request: user_pb.VerifyTokenRequest, callback: (error: grpc.ServiceError | null, response: user_pb.VerifyTokenResponse) => void): grpc.ClientUnaryCall;
    verifyToken(request: user_pb.VerifyTokenRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: user_pb.VerifyTokenResponse) => void): grpc.ClientUnaryCall;
    verifyToken(request: user_pb.VerifyTokenRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: user_pb.VerifyTokenResponse) => void): grpc.ClientUnaryCall;
    setUserData(request: user_pb.SetUserDataRequest, callback: (error: grpc.ServiceError | null, response: user_pb.SetUserDataResponse) => void): grpc.ClientUnaryCall;
    setUserData(request: user_pb.SetUserDataRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: user_pb.SetUserDataResponse) => void): grpc.ClientUnaryCall;
    setUserData(request: user_pb.SetUserDataRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: user_pb.SetUserDataResponse) => void): grpc.ClientUnaryCall;
}

export class UserClient extends grpc.Client implements IUserClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public generateNonce(request: user_pb.GenerateNonceRequest, callback: (error: grpc.ServiceError | null, response: user_pb.GenerateNonceResponse) => void): grpc.ClientUnaryCall;
    public generateNonce(request: user_pb.GenerateNonceRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: user_pb.GenerateNonceResponse) => void): grpc.ClientUnaryCall;
    public generateNonce(request: user_pb.GenerateNonceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: user_pb.GenerateNonceResponse) => void): grpc.ClientUnaryCall;
    public logout(request: user_pb.LogoutRequest, callback: (error: grpc.ServiceError | null, response: user_pb.LogoutResponse) => void): grpc.ClientUnaryCall;
    public logout(request: user_pb.LogoutRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: user_pb.LogoutResponse) => void): grpc.ClientUnaryCall;
    public logout(request: user_pb.LogoutRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: user_pb.LogoutResponse) => void): grpc.ClientUnaryCall;
    public verifySignature(request: user_pb.VerifySignatureRequest, callback: (error: grpc.ServiceError | null, response: user_pb.VerifySignatureResponse) => void): grpc.ClientUnaryCall;
    public verifySignature(request: user_pb.VerifySignatureRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: user_pb.VerifySignatureResponse) => void): grpc.ClientUnaryCall;
    public verifySignature(request: user_pb.VerifySignatureRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: user_pb.VerifySignatureResponse) => void): grpc.ClientUnaryCall;
    public verifyToken(request: user_pb.VerifyTokenRequest, callback: (error: grpc.ServiceError | null, response: user_pb.VerifyTokenResponse) => void): grpc.ClientUnaryCall;
    public verifyToken(request: user_pb.VerifyTokenRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: user_pb.VerifyTokenResponse) => void): grpc.ClientUnaryCall;
    public verifyToken(request: user_pb.VerifyTokenRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: user_pb.VerifyTokenResponse) => void): grpc.ClientUnaryCall;
    public setUserData(request: user_pb.SetUserDataRequest, callback: (error: grpc.ServiceError | null, response: user_pb.SetUserDataResponse) => void): grpc.ClientUnaryCall;
    public setUserData(request: user_pb.SetUserDataRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: user_pb.SetUserDataResponse) => void): grpc.ClientUnaryCall;
    public setUserData(request: user_pb.SetUserDataRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: user_pb.SetUserDataResponse) => void): grpc.ClientUnaryCall;
}
