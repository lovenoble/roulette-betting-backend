/**
 * @fileoverview gRPC-Web generated client stub for analytics
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.analytics = require('./analytics_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.analytics.AnalyticsClient =
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
proto.analytics.AnalyticsPromiseClient =
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
 *   !proto.analytics.UserProfileRequest,
 *   !proto.analytics.UserProfileResponse>}
 */
const methodDescriptor_Analytics_UserProfile = new grpc.web.MethodDescriptor(
  '/analytics.Analytics/UserProfile',
  grpc.web.MethodType.UNARY,
  proto.analytics.UserProfileRequest,
  proto.analytics.UserProfileResponse,
  /**
   * @param {!proto.analytics.UserProfileRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.analytics.UserProfileResponse.deserializeBinary
);


/**
 * @param {!proto.analytics.UserProfileRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.analytics.UserProfileResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.analytics.UserProfileResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.analytics.AnalyticsClient.prototype.userProfile =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/analytics.Analytics/UserProfile',
      request,
      metadata || {},
      methodDescriptor_Analytics_UserProfile,
      callback);
};


/**
 * @param {!proto.analytics.UserProfileRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.analytics.UserProfileResponse>}
 *     Promise that resolves to the response
 */
proto.analytics.AnalyticsPromiseClient.prototype.userProfile =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/analytics.Analytics/UserProfile',
      request,
      metadata || {},
      methodDescriptor_Analytics_UserProfile);
};


module.exports = proto.analytics;

