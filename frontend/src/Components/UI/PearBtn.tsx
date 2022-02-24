import styled from 'styled-components'
import { motion } from 'framer-motion'

const SPearBtn = styled(motion.button)<{ isLoading: boolean }>`
    border: none;
    color: white;
    background: #2c0b2e;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 24px;
    font-size: 14px;
    border-radius: 10px;
    margin-top: 24px;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    filter: ${({ isLoading }) => (isLoading ? 'blur(4px)' : 'none')};
    > img {
        margin-left: 8px;
        height: 28px;
    }
`

export interface IPearBtn {
    onClick: any
    style?: any
    className?: string
    isLoading?: boolean
    whileHover?: any
    whileTap?: any
    children: any
}

function PearBtn({
    onClick= () => {},
    style,
    className,
    isLoading = false,
    whileHover,
    whileTap,
    children,
    ...props
}: IPearBtn) {
    return (
        <SPearBtn
            className={className}
            style={style}
            onClick={onClick}
            isLoading={isLoading}
            whileHover={whileHover || {
                scale: 1.1,
                transition: {
                    duration: 0.15,
                },
            }}
            whileTap={whileTap || {
                scale: 0.9,
                transition: {
                    duration: 0.15,
                },
            }}
            {...props}
        >
            {children}
        </SPearBtn>
    )
}

export default PearBtn