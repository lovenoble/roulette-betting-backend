import { useContext, useMemo } from 'react'

import { IRealtimeContext } from '../contexts/reducers/realtimeReducer'
import { RealtimeContext } from '../contexts/RealtimeProvider'

function useRealtime(): IRealtimeContext {
    const realtimeContext = useContext(RealtimeContext)

    return useMemo(() => realtimeContext, [realtimeContext])
}

export default useRealtime
