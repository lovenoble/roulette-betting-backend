import styled from 'styled-components'

import PearMetaverse from '../Components/PearMetaverse'

const SMetaverse = styled.div`
    position: relative;
    z-index: 10;
`

function Metaverse() {
    return (
        <SMetaverse>
            <PearMetaverse />
        </SMetaverse>
    )
}

export default Metaverse