import { Metadata, ServiceError as grpcServiceError, status } from '@grpc/grpc-js'

export class ServiceError extends Error implements Partial<grpcServiceError> {
    public override name = 'ServiceError'

    constructor(
        public code: status,
        public override message: string,
        public details?: string,
        public metadata?: Metadata
    ) {
        super(message)
    }
}
