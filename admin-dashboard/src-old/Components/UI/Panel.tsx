import styled from 'styled-components'
import { motion } from 'framer-motion'

const SPanel = styled(motion.div)`
    background: rgba(38, 10, 38, 0.66);
    border: 1px solid rgba(110, 0, 110, 0.24);
    box-shadow: 0px 0px 100px 40px rgba(38, 10, 38, 0.58);
    color: white;
    border-radius: 10px;
    box-sizing: border-box;
`

function Panel({ children, ...props }: any) {
    return <SPanel {...props}>{children}</SPanel>
}

export default Panel