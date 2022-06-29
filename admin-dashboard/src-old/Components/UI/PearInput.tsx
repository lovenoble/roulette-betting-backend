import { forwardRef } from 'react'
import styled from 'styled-components'

const SPearInput = styled.input<any>`
    background: transparent;
    border-radius: 10px;
    border: none;
    background: rgba(32, 0, 32, 0.8);
    width: 100%;
    padding: 20px 36px;
    color: rgba(255, 255, 255, .66);
    &::placeholder {
        color: rgba(110, 11, 110, 0.6);
        padding-left: 6px;
    }
    &:focus {
        outline: none;
    }
`

const PearInput: any = forwardRef(({
    ...props
}, ref) => {
    return <SPearInput {...props} ref={ref} />
})

export default PearInput