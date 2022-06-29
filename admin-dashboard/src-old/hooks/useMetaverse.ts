import { useContext, useMemo } from 'react'

import { MetaverseContext, IMetaverseContext } from '../contexts/MetaverseProvider'

function useMetaverse(): IMetaverseContext {
    const metaverseContext = useContext(MetaverseContext)

    return useMemo(() => metaverseContext, [metaverseContext])
}

export default useMetaverse
