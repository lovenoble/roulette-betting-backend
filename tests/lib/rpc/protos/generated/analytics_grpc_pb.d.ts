// package: analytics
// file: analytics.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as analytics_pb from "./analytics_pb";

interface IAnalyticsService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    userProfile: IAnalyticsService_IUserProfile;
}

interface IAnalyticsService_IUserProfile extends grpc.MethodDefinition<analytics_pb.UserProfileRequest, analytics_pb.UserProfileResponse> {
    path: "/analytics.Analytics/UserProfile";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<analytics_pb.UserProfileRequest>;
    requestDeserialize: grpc.deserialize<analytics_pb.UserProfileRequest>;
    responseSerialize: grpc.serialize<analytics_pb.UserProfileResponse>;
    responseDeserialize: grpc.deserialize<analytics_pb.UserProfileResponse>;
}

export const AnalyticsService: IAnalyticsService;

export interface IAnalyticsServer {
    userProfile: grpc.handleUnaryCall<analytics_pb.UserProfileRequest, analytics_pb.UserProfileResponse>;
}

export interface IAnalyticsClient {
    userProfile(request: analytics_pb.UserProfileRequest, callback: (error: grpc.ServiceError | null, response: analytics_pb.UserProfileResponse) => void): grpc.ClientUnaryCall;
    userProfile(request: analytics_pb.UserProfileRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: analytics_pb.UserProfileResponse) => void): grpc.ClientUnaryCall;
    userProfile(request: analytics_pb.UserProfileRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: analytics_pb.UserProfileResponse) => void): grpc.ClientUnaryCall;
}

export class AnalyticsClient extends grpc.Client implements IAnalyticsClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public userProfile(request: analytics_pb.UserProfileRequest, callback: (error: grpc.ServiceError | null, response: analytics_pb.UserProfileResponse) => void): grpc.ClientUnaryCall;
    public userProfile(request: analytics_pb.UserProfileRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: analytics_pb.UserProfileResponse) => void): grpc.ClientUnaryCall;
    public userProfile(request: analytics_pb.UserProfileRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: analytics_pb.UserProfileResponse) => void): grpc.ClientUnaryCall;
}
