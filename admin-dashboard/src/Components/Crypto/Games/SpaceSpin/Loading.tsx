import styled from 'styled-components'
import { motion } from 'framer-motion'

import loadingSvg from '../../../../assets/connect-wallet/loading-animation.svg'

const SLoading = styled(motion.div)`
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .6);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    > img {
        height: 48px;
    }
    > span {
        text-align: center;
    }
`

const variants = {
    initial: {
        y: -200,
        opacity: 0,
    },
    animate: {
        y: 0,
        opacity: 1,
        // transition: {
        //     type: 'spring',
        //     stiffness: 200,
        //     damping: 20,
        // },
    },
    exit: {
        y: -200,
        opacity: 0,
    },
}

function Loading({
    text = ''
}) {
    return (
        <SLoading
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <img alt="Loading" src={loadingSvg} />
            {text ? (
                <span>{text}</span>
            ) : (
                <>
                    <span>Please check Metamask.</span>
                    <span>Waiting for transaction to complete...</span>
                </>
            )}
        </SLoading>
    )
}

export default Loading