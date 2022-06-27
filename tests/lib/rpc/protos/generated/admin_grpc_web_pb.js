/**
 * @fileoverview gRPC-Web generated client stub for admin
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.admin = require('./admin_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.admin.AdminClient =
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
proto.admin.AdminPromiseClient =
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
 *   !proto.admin.GetSeedAccountsRequest,
 *   !proto.admin.GetSeedAccountsResponse>}
 */
const methodDescriptor_Admin_GetSeedAccounts = new grpc.web.MethodDescriptor(
  '/admin.Admin/GetSeedAccounts',
  grpc.web.MethodType.UNARY,
  proto.admin.GetSeedAccountsRequest,
  proto.admin.GetSeedAccountsResponse,
  /**
   * @param {!proto.admin.GetSeedAccountsRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.admin.GetSeedAccountsResponse.deserializeBinary
);


/**
 * @param {!proto.admin.GetSeedAccountsRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.admin.GetSeedAccountsResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.admin.GetSeedAccountsResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.admin.AdminClient.prototype.getSeedAccounts =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/admin.Admin/GetSeedAccounts',
      request,
      metadata || {},
      methodDescriptor_Admin_GetSeedAccounts,
      callback);
};


/**
 * @param {!proto.admin.GetSeedAccountsRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.admin.GetSeedAccountsResponse>}
 *     Promise that resolves to the response
 */
proto.admin.AdminPromiseClient.prototype.getSeedAccounts =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/admin.Admin/GetSeedAccounts',
      request,
      metadata || {},
      methodDescriptor_Admin_GetSeedAccounts);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.admin.CreateSeedAccountsRequest,
 *   !proto.admin.CreateSeedAccountsResponse>}
 */
const methodDescriptor_Admin_CreateSeedAccounts = new grpc.web.MethodDescriptor(
  '/admin.Admin/CreateSeedAccounts',
  grpc.web.MethodType.UNARY,
  proto.admin.CreateSeedAccountsRequest,
  proto.admin.CreateSeedAccountsResponse,
  /**
   * @param {!proto.admin.CreateSeedAccountsRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.admin.CreateSeedAccountsResponse.deserializeBinary
);


/**
 * @param {!proto.admin.CreateSeedAccountsRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.admin.CreateSeedAccountsResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.admin.CreateSeedAccountsResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.admin.AdminClient.prototype.createSeedAccounts =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/admin.Admin/CreateSeedAccounts',
      request,
      metadata || {},
      methodDescriptor_Admin_CreateSeedAccounts,
      callback);
};


/**
 * @param {!proto.admin.CreateSeedAccountsRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.admin.CreateSeedAccountsResponse>}
 *     Promise that resolves to the response
 */
proto.admin.AdminPromiseClient.prototype.createSeedAccounts =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/admin.Admin/CreateSeedAccounts',
      request,
      metadata || {},
      methodDescriptor_Admin_CreateSeedAccounts);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.admin.CreateBatchEntryRequest,
 *   !proto.admin.CreateBatchEntryResponse>}
 */
const methodDescriptor_Admin_CreateBatchEntry = new grpc.web.MethodDescriptor(
  '/admin.Admin/CreateBatchEntry',
  grpc.web.MethodType.UNARY,
  proto.admin.CreateBatchEntryRequest,
  proto.admin.CreateBatchEntryResponse,
  /**
   * @param {!proto.admin.CreateBatchEntryRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.admin.CreateBatchEntryResponse.deserializeBinary
);


/**
 * @param {!proto.admin.CreateBatchEntryRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.admin.CreateBatchEntryResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.admin.CreateBatchEntryResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.admin.AdminClient.prototype.createBatchEntry =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/admin.Admin/CreateBatchEntry',
      request,
      metadata || {},
      methodDescriptor_Admin_CreateBatchEntry,
      callback);
};


/**
 * @param {!proto.admin.CreateBatchEntryRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.admin.CreateBatchEntryResponse>}
 *     Promise that resolves to the response
 */
proto.admin.AdminPromiseClient.prototype.createBatchEntry =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/admin.Admin/CreateBatchEntry',
      request,
      metadata || {},
      methodDescriptor_Admin_CreateBatchEntry);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.admin.SettleBatchEntryRequest,
 *   !proto.admin.SettleBatchEntryResponse>}
 */
const methodDescriptor_Admin_SettleBatchEntry = new grpc.web.MethodDescriptor(
  '/admin.Admin/SettleBatchEntry',
  grpc.web.MethodType.UNARY,
  proto.admin.SettleBatchEntryRequest,
  proto.admin.SettleBatchEntryResponse,
  /**
   * @param {!proto.admin.SettleBatchEntryRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.admin.SettleBatchEntryResponse.deserializeBinary
);


/**
 * @param {!proto.admin.SettleBatchEntryRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.admin.SettleBatchEntryResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.admin.SettleBatchEntryResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.admin.AdminClient.prototype.settleBatchEntry =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/admin.Admin/SettleBatchEntry',
      request,
      metadata || {},
      methodDescriptor_Admin_SettleBatchEntry,
      callback);
};


/**
 * @param {!proto.admin.SettleBatchEntryRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.admin.SettleBatchEntryResponse>}
 *     Promise that resolves to the response
 */
proto.admin.AdminPromiseClient.prototype.settleBatchEntry =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/admin.Admin/SettleBatchEntry',
      request,
      metadata || {},
      methodDescriptor_Admin_SettleBatchEntry);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.admin.PauseRoundRequest,
 *   !proto.admin.PauseRoundResponse>}
 */
const methodDescriptor_Admin_PauseRound = new grpc.web.MethodDescriptor(
  '/admin.Admin/PauseRound',
  grpc.web.MethodType.UNARY,
  proto.admin.PauseRoundRequest,
  proto.admin.PauseRoundResponse,
  /**
   * @param {!proto.admin.PauseRoundRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.admin.PauseRoundResponse.deserializeBinary
);


/**
 * @param {!proto.admin.PauseRoundRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.admin.PauseRoundResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.admin.PauseRoundResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.admin.AdminClient.prototype.pauseRound =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/admin.Admin/PauseRound',
      request,
      metadata || {},
      methodDescriptor_Admin_PauseRound,
      callback);
};


/**
 * @param {!proto.admin.PauseRoundRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.admin.PauseRoundResponse>}
 *     Promise that resolves to the response
 */
proto.admin.AdminPromiseClient.prototype.pauseRound =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/admin.Admin/PauseRound',
      request,
      metadata || {},
      methodDescriptor_Admin_PauseRound);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.admin.ConcludeRoundRequest,
 *   !proto.admin.ConcludeRoundResponse>}
 */
const methodDescriptor_Admin_ConcludeRound = new grpc.web.MethodDescriptor(
  '/admin.Admin/ConcludeRound',
  grpc.web.MethodType.UNARY,
  proto.admin.ConcludeRoundRequest,
  proto.admin.ConcludeRoundResponse,
  /**
   * @param {!proto.admin.ConcludeRoundRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.admin.ConcludeRoundResponse.deserializeBinary
);


/**
 * @param {!proto.admin.ConcludeRoundRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.admin.ConcludeRoundResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.admin.ConcludeRoundResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.admin.AdminClient.prototype.concludeRound =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/admin.Admin/ConcludeRound',
      request,
      metadata || {},
      methodDescriptor_Admin_ConcludeRound,
      callback);
};


/**
 * @param {!proto.admin.ConcludeRoundRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.admin.ConcludeRoundResponse>}
 *     Promise that resolves to the response
 */
proto.admin.AdminPromiseClient.prototype.concludeRound =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/admin.Admin/ConcludeRound',
      request,
      metadata || {},
      methodDescriptor_Admin_ConcludeRound);
};


module.exports = proto.admin;

