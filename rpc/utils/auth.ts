import { status } from '@grpc/grpc-js'
import type { sendUnaryData } from '@grpc/grpc-js'

import { ADMIN_PUBLIC_KEY } from '../constants'
import { PearHash } from '../../store/utils'
import { ServiceError, logger } from '.'

export function authAdminToken<T>(cb: sendUnaryData<T>, token: string) {
  const publicAddress = PearHash.getAddressFromToken(token)

  if (publicAddress !== ADMIN_PUBLIC_KEY) {
    logger.warn(`Admin token auth failed!`)
    cb(new ServiceError(status.PERMISSION_DENIED, 'Only admins can make this request'), null)
    return false
  }

  return true
}
