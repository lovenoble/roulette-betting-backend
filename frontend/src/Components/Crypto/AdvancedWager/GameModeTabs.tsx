import styled, { css } from 'styled-components'

const SGameModeTabs = styled.div`
    width: 100px;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #ffc24d;
`

const middleTabCss = css`
    border-top: 3px solid #ffc24d;
    border-bottom: 3px solid #ffc24d;
`

const SGameModeTab = styled.div<{ isMiddle: boolean; isSelected: boolean }>`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.15s ease-in-out all;
    cursor: pointer;
    ${({ isSelected }) => isSelected && 'background: #ffc24d; color: #37474f;'}
    ${({ isMiddle }) => isMiddle && middleTabCss};
    font-weight: bold;
`

interface IGameModeTab {
    title: string
    select: any
    isSelected: boolean
}

function GameModeTab({
    title,
    select,
    isSelected
}: IGameModeTab) {
    return <SGameModeTab isSelected={isSelected} onClick={select} isMiddle={title === '10X'}>{title}</SGameModeTab>
}

function GameModeTabs({
    selectedTab,
    setSelectedTab
}: {
    selectedTab: string,
    setSelectedTab: any
}) {
    return (
        <SGameModeTabs>
            <GameModeTab
                title="2X"
                select={() => setSelectedTab('2X')}
                isSelected={selectedTab === '2X'}
            />
            <GameModeTab
                title="10X"
                select={() => setSelectedTab('10X')}
                isSelected={selectedTab === '10X'}
            />
            <GameModeTab
                title="100X"
                select={() => setSelectedTab('100X')}
                isSelected={selectedTab === '100X'}
            />
        </SGameModeTabs>
    )
}

export default GameModeTabs