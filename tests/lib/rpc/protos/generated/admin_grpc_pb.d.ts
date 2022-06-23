// package: admin
// file: admin.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as admin_pb from "./admin_pb";

interface IAdminService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getSeedAccounts: IAdminService_IGetSeedAccounts;
    createSeedAccounts: IAdminService_ICreateSeedAccounts;
    createBatchEntry: IAdminService_ICreateBatchEntry;
    settleBatchEntry: IAdminService_ISettleBatchEntry;
    pauseRound: IAdminService_IPauseRound;
    concludeRound: IAdminService_IConcludeRound;
}

interface IAdminService_IGetSeedAccounts extends grpc.MethodDefinition<admin_pb.GetSeedAccountsRequest, admin_pb.GetSeedAccountsResponse> {
    path: "/admin.Admin/GetSeedAccounts";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<admin_pb.GetSeedAccountsRequest>;
    requestDeserialize: grpc.deserialize<admin_pb.GetSeedAccountsRequest>;
    responseSerialize: grpc.serialize<admin_pb.GetSeedAccountsResponse>;
    responseDeserialize: grpc.deserialize<admin_pb.GetSeedAccountsResponse>;
}
interface IAdminService_ICreateSeedAccounts extends grpc.MethodDefinition<admin_pb.CreateSeedAccountsRequest, admin_pb.CreateSeedAccountsResponse> {
    path: "/admin.Admin/CreateSeedAccounts";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<admin_pb.CreateSeedAccountsRequest>;
    requestDeserialize: grpc.deserialize<admin_pb.CreateSeedAccountsRequest>;
    responseSerialize: grpc.serialize<admin_pb.CreateSeedAccountsResponse>;
    responseDeserialize: grpc.deserialize<admin_pb.CreateSeedAccountsResponse>;
}
interface IAdminService_ICreateBatchEntry extends grpc.MethodDefinition<admin_pb.CreateBatchEntryRequest, admin_pb.CreateBatchEntryResponse> {
    path: "/admin.Admin/CreateBatchEntry";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<admin_pb.CreateBatchEntryRequest>;
    requestDeserialize: grpc.deserialize<admin_pb.CreateBatchEntryRequest>;
    responseSerialize: grpc.serialize<admin_pb.CreateBatchEntryResponse>;
    responseDeserialize: grpc.deserialize<admin_pb.CreateBatchEntryResponse>;
}
interface IAdminService_ISettleBatchEntry extends grpc.MethodDefinition<admin_pb.SettleBatchEntryRequest, admin_pb.SettleBatchEntryResponse> {
    path: "/admin.Admin/SettleBatchEntry";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<admin_pb.SettleBatchEntryRequest>;
    requestDeserialize: grpc.deserialize<admin_pb.SettleBatchEntryRequest>;
    responseSerialize: grpc.serialize<admin_pb.SettleBatchEntryResponse>;
    responseDeserialize: grpc.deserialize<admin_pb.SettleBatchEntryResponse>;
}
interface IAdminService_IPauseRound extends grpc.MethodDefinition<admin_pb.PauseRoundRequest, admin_pb.PauseRoundResponse> {
    path: "/admin.Admin/PauseRound";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<admin_pb.PauseRoundRequest>;
    requestDeserialize: grpc.deserialize<admin_pb.PauseRoundRequest>;
    responseSerialize: grpc.serialize<admin_pb.PauseRoundResponse>;
    responseDeserialize: grpc.deserialize<admin_pb.PauseRoundResponse>;
}
interface IAdminService_IConcludeRound extends grpc.MethodDefinition<admin_pb.ConcludeRoundRequest, admin_pb.ConcludeRoundResponse> {
    path: "/admin.Admin/ConcludeRound";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<admin_pb.ConcludeRoundRequest>;
    requestDeserialize: grpc.deserialize<admin_pb.ConcludeRoundRequest>;
    responseSerialize: grpc.serialize<admin_pb.ConcludeRoundResponse>;
    responseDeserialize: grpc.deserialize<admin_pb.ConcludeRoundResponse>;
}

export const AdminService: IAdminService;

export interface IAdminServer {
    getSeedAccounts: grpc.handleUnaryCall<admin_pb.GetSeedAccountsRequest, admin_pb.GetSeedAccountsResponse>;
    createSeedAccounts: grpc.handleUnaryCall<admin_pb.CreateSeedAccountsRequest, admin_pb.CreateSeedAccountsResponse>;
    createBatchEntry: grpc.handleUnaryCall<admin_pb.CreateBatchEntryRequest, admin_pb.CreateBatchEntryResponse>;
    settleBatchEntry: grpc.handleUnaryCall<admin_pb.SettleBatchEntryRequest, admin_pb.SettleBatchEntryResponse>;
    pauseRound: grpc.handleUnaryCall<admin_pb.PauseRoundRequest, admin_pb.PauseRoundResponse>;
    concludeRound: grpc.handleUnaryCall<admin_pb.ConcludeRoundRequest, admin_pb.ConcludeRoundResponse>;
}

export interface IAdminClient {
    getSeedAccounts(request: admin_pb.GetSeedAccountsRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.GetSeedAccountsResponse) => void): grpc.ClientUnaryCall;
    getSeedAccounts(request: admin_pb.GetSeedAccountsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.GetSeedAccountsResponse) => void): grpc.ClientUnaryCall;
    getSeedAccounts(request: admin_pb.GetSeedAccountsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.GetSeedAccountsResponse) => void): grpc.ClientUnaryCall;
    createSeedAccounts(request: admin_pb.CreateSeedAccountsRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.CreateSeedAccountsResponse) => void): grpc.ClientUnaryCall;
    createSeedAccounts(request: admin_pb.CreateSeedAccountsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.CreateSeedAccountsResponse) => void): grpc.ClientUnaryCall;
    createSeedAccounts(request: admin_pb.CreateSeedAccountsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.CreateSeedAccountsResponse) => void): grpc.ClientUnaryCall;
    createBatchEntry(request: admin_pb.CreateBatchEntryRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.CreateBatchEntryResponse) => void): grpc.ClientUnaryCall;
    createBatchEntry(request: admin_pb.CreateBatchEntryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.CreateBatchEntryResponse) => void): grpc.ClientUnaryCall;
    createBatchEntry(request: admin_pb.CreateBatchEntryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.CreateBatchEntryResponse) => void): grpc.ClientUnaryCall;
    settleBatchEntry(request: admin_pb.SettleBatchEntryRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.SettleBatchEntryResponse) => void): grpc.ClientUnaryCall;
    settleBatchEntry(request: admin_pb.SettleBatchEntryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.SettleBatchEntryResponse) => void): grpc.ClientUnaryCall;
    settleBatchEntry(request: admin_pb.SettleBatchEntryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.SettleBatchEntryResponse) => void): grpc.ClientUnaryCall;
    pauseRound(request: admin_pb.PauseRoundRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.PauseRoundResponse) => void): grpc.ClientUnaryCall;
    pauseRound(request: admin_pb.PauseRoundRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.PauseRoundResponse) => void): grpc.ClientUnaryCall;
    pauseRound(request: admin_pb.PauseRoundRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.PauseRoundResponse) => void): grpc.ClientUnaryCall;
    concludeRound(request: admin_pb.ConcludeRoundRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.ConcludeRoundResponse) => void): grpc.ClientUnaryCall;
    concludeRound(request: admin_pb.ConcludeRoundRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.ConcludeRoundResponse) => void): grpc.ClientUnaryCall;
    concludeRound(request: admin_pb.ConcludeRoundRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.ConcludeRoundResponse) => void): grpc.ClientUnaryCall;
}

export class AdminClient extends grpc.Client implements IAdminClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getSeedAccounts(request: admin_pb.GetSeedAccountsRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.GetSeedAccountsResponse) => void): grpc.ClientUnaryCall;
    public getSeedAccounts(request: admin_pb.GetSeedAccountsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.GetSeedAccountsResponse) => void): grpc.ClientUnaryCall;
    public getSeedAccounts(request: admin_pb.GetSeedAccountsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.GetSeedAccountsResponse) => void): grpc.ClientUnaryCall;
    public createSeedAccounts(request: admin_pb.CreateSeedAccountsRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.CreateSeedAccountsResponse) => void): grpc.ClientUnaryCall;
    public createSeedAccounts(request: admin_pb.CreateSeedAccountsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.CreateSeedAccountsResponse) => void): grpc.ClientUnaryCall;
    public createSeedAccounts(request: admin_pb.CreateSeedAccountsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.CreateSeedAccountsResponse) => void): grpc.ClientUnaryCall;
    public createBatchEntry(request: admin_pb.CreateBatchEntryRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.CreateBatchEntryResponse) => void): grpc.ClientUnaryCall;
    public createBatchEntry(request: admin_pb.CreateBatchEntryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.CreateBatchEntryResponse) => void): grpc.ClientUnaryCall;
    public createBatchEntry(request: admin_pb.CreateBatchEntryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.CreateBatchEntryResponse) => void): grpc.ClientUnaryCall;
    public settleBatchEntry(request: admin_pb.SettleBatchEntryRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.SettleBatchEntryResponse) => void): grpc.ClientUnaryCall;
    public settleBatchEntry(request: admin_pb.SettleBatchEntryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.SettleBatchEntryResponse) => void): grpc.ClientUnaryCall;
    public settleBatchEntry(request: admin_pb.SettleBatchEntryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.SettleBatchEntryResponse) => void): grpc.ClientUnaryCall;
    public pauseRound(request: admin_pb.PauseRoundRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.PauseRoundResponse) => void): grpc.ClientUnaryCall;
    public pauseRound(request: admin_pb.PauseRoundRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.PauseRoundResponse) => void): grpc.ClientUnaryCall;
    public pauseRound(request: admin_pb.PauseRoundRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.PauseRoundResponse) => void): grpc.ClientUnaryCall;
    public concludeRound(request: admin_pb.ConcludeRoundRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.ConcludeRoundResponse) => void): grpc.ClientUnaryCall;
    public concludeRound(request: admin_pb.ConcludeRoundRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.ConcludeRoundResponse) => void): grpc.ClientUnaryCall;
    public concludeRound(request: admin_pb.ConcludeRoundRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.ConcludeRoundResponse) => void): grpc.ClientUnaryCall;
}
