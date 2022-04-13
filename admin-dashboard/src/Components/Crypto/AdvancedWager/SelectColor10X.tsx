import { useMemo } from 'react'
import styled from 'styled-components'

const SSelectedColor10X = styled.div`
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

const SSelectedColor10XPanel = styled.div`
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

const SColorSelection = styled.button<{ isSelected: boolean }>`
    color: #37474f;
    height: 28px;
    width: 28px;
    font-size: 12px;
    font-weight: bold;
    border: none;
    background: #ffc24d;
    cursor: pointer;
    border-radius: 100%;
    margin: 4px;
    transition: 0.15s ease-in-out all;
    ${({ isSelected }) =>
        isSelected && 'transform: scale(1.5); background: #efa10a; color: white;'}
    &:disabled {
        cursor: not-allowed;
        filter: grayscale(1);
    }
`

function ColorSelection({
    num,
    select,
    isSelected,
    isDisabled,
}: {
    num: string,
    select: any,
    isSelected: boolean
    isDisabled: boolean
}) {
    return (
        <SColorSelection
            disabled={isDisabled}
            isSelected={isSelected}
            onClick={select}
        >
            {num}
        </SColorSelection>
    )
}

function SelectedColor10X({
    selection10X,
    setSelection10X,
    bets,
    // selection2XDisabled
}: {
    selection10X: string
    setSelection10X: any
    bets: any[]
    // selection2XDisabled: boolean
}) {

    const selected10XNums = useMemo(() => {
        return bets.filter(({ type }: any) => type === '10X').map(({ pickedNumber }: any) => {
            return pickedNumber
        })
    }, [bets])

    const selections = useMemo(() => {
        const _selections: any[] = []

        for (let i = 0; i < 10; i++) {
            const selectNum = (i + 1).toString()
            _selections.push(
                <ColorSelection
                    key={selectNum}
                    isDisabled={selected10XNums.indexOf(selectNum) !== -1}
                    isSelected={selection10X === selectNum}
                    select={() => setSelection10X(selectNum)}
                    num={selectNum}
                />
            )
        }

        return _selections
    }, [selected10XNums, selection10X, setSelection10X])

    return (
        <SSelectedColor10X>
            <SSelectedColor10XPanel>
                <div className="select-color-title">
                    SELECT YOUR BET TO START
                </div>
                <SBtnWrapper>
                    {selections}
                </SBtnWrapper>
            </SSelectedColor10XPanel>
        </SSelectedColor10X>
    )
}

export default SelectedColor10X