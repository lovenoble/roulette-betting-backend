import { Logger } from '../../utils'

export const pubLogger = new Logger('mexicanBrown')
export const subLogger = new Logger('gold')

pubLogger.setTimestamp(true)
subLogger.setTimestamp(true)
