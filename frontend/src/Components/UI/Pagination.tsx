import styled from 'styled-components'
import { useMemo, useRef, useEffect } from 'react'

const SPagination = styled.div`
    width: 300px;
    height: 44px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin-top: 8px;
    box-sizing: border-box;
    position: absolute;
    bottom: 12px;
    z-index: 150;
    > div {
        margin-right: 6px;
        &:last-child {
            margin-right: 0px;
        }
    }
    overflow-x: scroll;
    ::-webkit-scrollbar {
        height: 6px;
        background: transparent;
    }
    ::-webkit-scrollbar-thumb {
        background: rgba(135, 16, 79, 0.24);
    }
`

const SPage = styled.div<{ selected: boolean }>`
    min-height: 24px;
    min-width: 24px;
    padding: 4px;
    border-radius: 100%;
    cursor: pointer;
    user-select: none;
    transition: .15s ease-in-out all;
    background: ${({ selected }) => selected ? 'rgba(135, 15, 79, 0.66)' : 'transparent'};
    display: flex;
    align-items: center;
    justify-content: center;
`

const SFiller = styled.div`
    height: 100%;
    width: 4px;
`

interface IPaginationProps {
    selectedPage?: string
    pageSize: number
    setSelectedPage: any
}

function Pagination({
    selectedPage,
    pageSize,
    setSelectedPage,
}: IPaginationProps) {
    const fillerRef = useRef<HTMLDivElement>(null)
    const pages = useMemo(() => {
        return new Array(pageSize).fill(0)
    }, [pageSize])

    useEffect(() => {
        if (!fillerRef.current) return
        fillerRef.current.scrollIntoView({
            behavior: 'smooth',
        })
    }, [pages])


    return (
        <SPagination>
            {pages.map((_, idx) => (
                <SPage selected={Number(selectedPage) === idx + 1} onClick={() => setSelectedPage((idx + 1).toString())}>
                    {idx + 1}
                </SPage>
            ))}
            <SFiller ref={fillerRef} />
        </SPagination>
    )
}

export default Pagination