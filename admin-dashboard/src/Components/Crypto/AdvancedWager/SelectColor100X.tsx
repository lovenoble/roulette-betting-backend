import { useMemo } from 'react'
import styled from 'styled-components'

const SSelectedColor100X = styled.div`
    /* background: purple; */
    flex: 7;
    display: flex;
    align-items: center;
    justify-content: stretch;
`

const NumWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    height: 72px;
    overflow-y: scroll;
    > span {
        margin-left: 18px;
        margin-right: 18px;
        font-size: 14px;
    }
`

const SSelectedColor100XPanel = styled.div`
    margin: 8px;
    padding: 8px;
    width: 100%;
    box-sizing: border-box;
    border: 2px solid #ffc24d;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
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
    border: none;
    font-weight: bold;
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

function SelectedColor100X({
    selection100X,
    setSelection100X,
    bets
    // selection2XDisabled
}: {
    selection100X: string
    setSelection100X: any
    bets: any[]
    // selection2XDisabled: boolean
}) {

    const selected100XNums = useMemo(() => {
        return bets.filter(({ type }: any) => type === '100X').map(({ pickedNumber }: any) => {
            return pickedNumber
        })
    }, [bets])

    const selections = useMemo(() => {
        const _selections: any[] = []

        for (let i = 0; i < 100; i++) {
            const selectNum = (i + 1).toString()
            _selections.push(
                <ColorSelection
                    key={selectNum}
                    isDisabled={selected100XNums.indexOf(selectNum) !== -1}
                    isSelected={selection100X === selectNum}
                    select={() => setSelection100X(selectNum)}
                    num={selectNum}
                />
            )
        }

        return _selections
    }, [selected100XNums, selection100X, setSelection100X])

    return (
        <SSelectedColor100X>
            <SSelectedColor100XPanel>
                <NumWrapper>{selections}</NumWrapper>
            </SSelectedColor100XPanel>
        </SSelectedColor100X>
    )
}

export default SelectedColor100X