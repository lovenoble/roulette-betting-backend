import styled from 'styled-components'

const SSelectedColor2X = styled.div`
    /* background: purple; */
    flex: 7;
    display: flex;
    align-items: center;
    justify-content: stretch;
`

const SBtnWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    > span {
        margin-left: 18px;
        margin-right: 18px;
        font-size: 14px;
    }
`

const SSelectedColor2XPanel = styled.div`
    margin: 8px;
    padding: 8px;
    width: 100%;
    box-sizing: border-box;
    border: 2px solid #ffc24d;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .select-color-title {
        color: #ffc24d;
        font-size: 14px;
        margin-bottom: 12px;
    }
`

const S2XBtn = styled.button<{ isSelected: boolean }>`
    height: 42px;
    width: 45%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    &.even {
        &:disabled {
            filter: blur(2px) grayscale(1);
        }
        border: 2px solid #4cc9f0;
        color: ${({ isSelected }) => isSelected ? 'white' : '#4cc9f0'};
        ${({ isSelected }) => isSelected && 'background: #4cc9f0'};
    }
    &.odd {
        &:disabled {
            filter: blur(2px) grayscale(1);
        }
        border: 2px solid #f72585;
        color: #f72585;
        color: ${({ isSelected }) => isSelected ? 'white' : '#f72585'};
        ${({ isSelected }) => isSelected && 'background: #f72585'};
    }
`

function SelectedColor2X({
    selection2X,
    setSelection2X,
    selection2XDisabled
}: {
    selection2X: string
    setSelection2X: any
    selection2XDisabled: boolean
}) {
    return (
        <SSelectedColor2X>
            <SSelectedColor2XPanel>
                <div className="select-color-title">
                    {!selection2XDisabled ? 'SELECT YOUR BET TO START' : 'ALREADY ADDED 2X BET. PLEASE EDIT OR REMOVE BELOW.'}
                </div>
                <SBtnWrapper>
                    <S2XBtn
                        isSelected={selection2X === '1'}
                        onClick={() => setSelection2X('1')}
                        disabled={selection2XDisabled}
                        className="odd"
                    >
                        ODD
                    </S2XBtn>
                    <span>OR</span>
                    <S2XBtn
                        isSelected={selection2X === '0'}
                        onClick={() => setSelection2X('0')}
                        disabled={selection2XDisabled}
                        className="even"
                    >
                        EVEN
                    </S2XBtn>
                </SBtnWrapper>
            </SSelectedColor2XPanel>
        </SSelectedColor2X>
    )
}

export default SelectedColor2X