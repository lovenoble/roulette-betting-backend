/**
 * @fileoverview gRPC-Web generated client stub for user
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.user = require('./user_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.user.UserClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.user.UserPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.user.GenerateNonceRequest,
 *   !proto.user.GenerateNonceResponse>}
 */
const methodDescriptor_User_GenerateNonce = new grpc.web.MethodDescriptor(
  '/user.User/GenerateNonce',
  grpc.web.MethodType.UNARY,
  proto.user.GenerateNonceRequest,
  proto.user.GenerateNonceResponse,
  /**
   * @param {!proto.user.GenerateNonceRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.user.GenerateNonceResponse.deserializeBinary
);


/**
 * @param {!proto.user.GenerateNonceRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.user.GenerateNonceResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.user.GenerateNonceResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.user.UserClient.prototype.generateNonce =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/user.User/GenerateNonce',
      request,
      metadata || {},
      methodDescriptor_User_GenerateNonce,
      callback);
};


/**
 * @param {!proto.user.GenerateNonceRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.user.GenerateNonceResponse>}
 *     Promise that resolves to the response
 */
proto.user.UserPromiseClient.prototype.generateNonce =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/user.User/GenerateNonce',
      request,
      metadata || {},
      methodDescriptor_User_GenerateNonce);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.user.LogoutRequest,
 *   !proto.user.LogoutResponse>}
 */
const methodDescriptor_User_Logout = new grpc.web.MethodDescriptor(
  '/user.User/Logout',
  grpc.web.MethodType.UNARY,
  proto.user.LogoutRequest,
  proto.user.LogoutResponse,
  /**
   * @param {!proto.user.LogoutRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.user.LogoutResponse.deserializeBinary
);


/**
 * @param {!proto.user.LogoutRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.user.LogoutResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.user.LogoutResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.user.UserClient.prototype.logout =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/user.User/Logout',
      request,
      metadata || {},
      methodDescriptor_User_Logout,
      callback);
};


/**
 * @param {!proto.user.LogoutRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.user.LogoutResponse>}
 *     Promise that resolves to the response
 */
proto.user.UserPromiseClient.prototype.logout =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/user.User/Logout',
      request,
      metadata || {},
      methodDescriptor_User_Logout);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.user.VerifySignatureRequest,
 *   !proto.user.VerifySignatureResponse>}
 */
const methodDescriptor_User_VerifySignature = new grpc.web.MethodDescriptor(
  '/user.User/VerifySignature',
  grpc.web.MethodType.UNARY,
  proto.user.VerifySignatureRequest,
  proto.user.VerifySignatureResponse,
  /**
   * @param {!proto.user.VerifySignatureRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.user.VerifySignatureResponse.deserializeBinary
);


/**
 * @param {!proto.user.VerifySignatureRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.user.VerifySignatureResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.user.VerifySignatureResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.user.UserClient.prototype.verifySignature =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/user.User/VerifySignature',
      request,
      metadata || {},
      methodDescriptor_User_VerifySignature,
      callback);
};


/**
 * @param {!proto.user.VerifySignatureRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.user.VerifySignatureResponse>}
 *     Promise that resolves to the response
 */
proto.user.UserPromiseClient.prototype.verifySignature =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/user.User/VerifySignature',
      request,
      metadata || {},
      methodDescriptor_User_VerifySignature);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.user.VerifyTokenRequest,
 *   !proto.user.VerifyTokenResponse>}
 */
const methodDescriptor_User_VerifyToken = new grpc.web.MethodDescriptor(
  '/user.User/VerifyToken',
  grpc.web.MethodType.UNARY,
  proto.user.VerifyTokenRequest,
  proto.user.VerifyTokenResponse,
  /**
   * @param {!proto.user.VerifyTokenRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.user.VerifyTokenResponse.deserializeBinary
);


/**
 * @param {!proto.user.VerifyTokenRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.user.VerifyTokenResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.user.VerifyTokenResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.user.UserClient.prototype.verifyToken =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/user.User/VerifyToken',
      request,
      metadata || {},
      methodDescriptor_User_VerifyToken,
      callback);
};


/**
 * @param {!proto.user.VerifyTokenRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.user.VerifyTokenResponse>}
 *     Promise that resolves to the response
 */
proto.user.UserPromiseClient.prototype.verifyToken =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/user.User/VerifyToken',
      request,
      metadata || {},
      methodDescriptor_User_VerifyToken);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.user.SetUserDataRequest,
 *   !proto.user.SetUserDataResponse>}
 */
const methodDescriptor_User_SetUserData = new grpc.web.MethodDescriptor(
  '/user.User/SetUserData',
  grpc.web.MethodType.UNARY,
  proto.user.SetUserDataRequest,
  proto.user.SetUserDataResponse,
  /**
   * @param {!proto.user.SetUserDataRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.user.SetUserDataResponse.deserializeBinary
);


/**
 * @param {!proto.user.SetUserDataRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.user.SetUserDataResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.user.SetUserDataResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.user.UserClient.prototype.setUserData =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/user.User/SetUserData',
      request,
      metadata || {},
      methodDescriptor_User_SetUserData,
      callback);
};


/**
 * @param {!proto.user.SetUserDataRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.user.SetUserDataResponse>}
 *     Promise that resolves to the response
 */
proto.user.UserPromiseClient.prototype.setUserData =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/user.User/SetUserData',
      request,
      metadata || {},
      methodDescriptor_User_SetUserData);
};


module.exports = proto.user;

