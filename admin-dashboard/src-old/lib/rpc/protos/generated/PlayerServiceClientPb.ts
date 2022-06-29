/**
 * @fileoverview gRPC-Web generated client stub for player
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as player_pb from './player_pb';


export class PlayerClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoCreate = new grpcWeb.MethodDescriptor(
    '/player.Player/Create',
    grpcWeb.MethodType.UNARY,
    player_pb.CreateRequest,
    player_pb.CreateResponse,
    (request: player_pb.CreateRequest) => {
      return request.serializeBinary();
    },
    player_pb.CreateResponse.deserializeBinary
  );

  create(
    request: player_pb.CreateRequest,
    metadata: grpcWeb.Metadata | null): Promise<player_pb.CreateResponse>;

  create(
    request: player_pb.CreateRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: player_pb.CreateResponse) => void): grpcWeb.ClientReadableStream<player_pb.CreateResponse>;

  create(
    request: player_pb.CreateRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: player_pb.CreateResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/player.Player/Create',
        request,
        metadata || {},
        this.methodInfoCreate,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/player.Player/Create',
    request,
    metadata || {},
    this.methodInfoCreate);
  }

  methodInfoLogin = new grpcWeb.MethodDescriptor(
    '/player.Player/Login',
    grpcWeb.MethodType.UNARY,
    player_pb.LoginRequest,
    player_pb.LoginResponse,
    (request: player_pb.LoginRequest) => {
      return request.serializeBinary();
    },
    player_pb.LoginResponse.deserializeBinary
  );

  login(
    request: player_pb.LoginRequest,
    metadata: grpcWeb.Metadata | null): Promise<player_pb.LoginResponse>;

  login(
    request: player_pb.LoginRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: player_pb.LoginResponse) => void): grpcWeb.ClientReadableStream<player_pb.LoginResponse>;

  login(
    request: player_pb.LoginRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: player_pb.LoginResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/player.Player/Login',
        request,
        metadata || {},
        this.methodInfoLogin,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/player.Player/Login',
    request,
    metadata || {},
    this.methodInfoLogin);
  }

  methodInfoLogout = new grpcWeb.MethodDescriptor(
    '/player.Player/Logout',
    grpcWeb.MethodType.UNARY,
    player_pb.LogoutRequest,
    player_pb.LogoutResponse,
    (request: player_pb.LogoutRequest) => {
      return request.serializeBinary();
    },
    player_pb.LogoutResponse.deserializeBinary
  );

  logout(
    request: player_pb.LogoutRequest,
    metadata: grpcWeb.Metadata | null): Promise<player_pb.LogoutResponse>;

  logout(
    request: player_pb.LogoutRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: player_pb.LogoutResponse) => void): grpcWeb.ClientReadableStream<player_pb.LogoutResponse>;

  logout(
    request: player_pb.LogoutRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: player_pb.LogoutResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/player.Player/Logout',
        request,
        metadata || {},
        this.methodInfoLogout,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/player.Player/Logout',
    request,
    metadata || {},
    this.methodInfoLogout);
  }

  methodInfoGenerateNonce = new grpcWeb.MethodDescriptor(
    '/player.Player/GenerateNonce',
    grpcWeb.MethodType.UNARY,
    player_pb.GenerateNonceRequest,
    player_pb.GenerateNonceResponse,
    (request: player_pb.GenerateNonceRequest) => {
      return request.serializeBinary();
    },
    player_pb.GenerateNonceResponse.deserializeBinary
  );

  generateNonce(
    request: player_pb.GenerateNonceRequest,
    metadata: grpcWeb.Metadata | null): Promise<player_pb.GenerateNonceResponse>;

  generateNonce(
    request: player_pb.GenerateNonceRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: player_pb.GenerateNonceResponse) => void): grpcWeb.ClientReadableStream<player_pb.GenerateNonceResponse>;

  generateNonce(
    request: player_pb.GenerateNonceRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: player_pb.GenerateNonceResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/player.Player/GenerateNonce',
        request,
        metadata || {},
        this.methodInfoGenerateNonce,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/player.Player/GenerateNonce',
    request,
    metadata || {},
    this.methodInfoGenerateNonce);
  }

  methodInfoVerifySignature = new grpcWeb.MethodDescriptor(
    '/player.Player/VerifySignature',
    grpcWeb.MethodType.UNARY,
    player_pb.VerifySignatureRequest,
    player_pb.VerifySignatureResponse,
    (request: player_pb.VerifySignatureRequest) => {
      return request.serializeBinary();
    },
    player_pb.VerifySignatureResponse.deserializeBinary
  );

  verifySignature(
    request: player_pb.VerifySignatureRequest,
    metadata: grpcWeb.Metadata | null): Promise<player_pb.VerifySignatureResponse>;

  verifySignature(
    request: player_pb.VerifySignatureRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: player_pb.VerifySignatureResponse) => void): grpcWeb.ClientReadableStream<player_pb.VerifySignatureResponse>;

  verifySignature(
    request: player_pb.VerifySignatureRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: player_pb.VerifySignatureResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/player.Player/VerifySignature',
        request,
        metadata || {},
        this.methodInfoVerifySignature,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/player.Player/VerifySignature',
    request,
    metadata || {},
    this.methodInfoVerifySignature);
  }

  methodInfoVerifyToken = new grpcWeb.MethodDescriptor(
    '/player.Player/VerifyToken',
    grpcWeb.MethodType.UNARY,
    player_pb.VerifyTokenRequest,
    player_pb.VerifyTokenResponse,
    (request: player_pb.VerifyTokenRequest) => {
      return request.serializeBinary();
    },
    player_pb.VerifyTokenResponse.deserializeBinary
  );

  verifyToken(
    request: player_pb.VerifyTokenRequest,
    metadata: grpcWeb.Metadata | null): Promise<player_pb.VerifyTokenResponse>;

  verifyToken(
    request: player_pb.VerifyTokenRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: player_pb.VerifyTokenResponse) => void): grpcWeb.ClientReadableStream<player_pb.VerifyTokenResponse>;

  verifyToken(
    request: player_pb.VerifyTokenRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: player_pb.VerifyTokenResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/player.Player/VerifyToken',
        request,
        metadata || {},
        this.methodInfoVerifyToken,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/player.Player/VerifyToken',
    request,
    metadata || {},
    this.methodInfoVerifyToken);
  }

}

