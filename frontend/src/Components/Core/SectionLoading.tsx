import styled from 'styled-components'

const SDivLoading = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 18px;
`

function DivLoading({ text = 'Loading...' }) {
    return <SDivLoading>{text}</SDivLoading>
}

export default DivLoading