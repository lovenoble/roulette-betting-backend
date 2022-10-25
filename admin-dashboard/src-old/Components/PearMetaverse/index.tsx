import { useState, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import Panel from '../UI/Panel'

import useMetaverse from '../../hooks/useMetaverse'
import MetaverseService from '../../lib/pears/services/MetaverseService'

const SPearMetaverse = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`

const SPanel = styled(Panel)`
    height: 600px;
    width: 800px;
    font-size: 12px;
    position: relative;
    padding: 12px;
    box-sizing: border-box;
    display: flex;
    align-items: flex-start;
`

const SLoadingOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
`

function PearMetaverse() {
    const { dispatch, actions, state } = useMetaverse()
    const [metaverseService, setMetaverseService] =
        useState<MetaverseService | null>(null)
    const [username, setUsername] = useState('')
    const [isJoining, setIsJoining] = useState(false)
    const [hasJoined, setHasJoined] = useState(false)

    useEffect(() => {
        if (!dispatch || !actions || metaverseService) return

        const _metaverse = new MetaverseService()
        _metaverse.defineDispatchActions(dispatch, actions)
        setMetaverseService(_metaverse)
    }, [dispatch, actions, metaverseService])

    useEffect(() => {
        if (metaverseService) {
            // console.log(metaverseService)
        }
    }, [metaverseService])

    const joinMetaverse = useCallback(async () => {
        try {
            if (!username || hasJoined) return
            setIsJoining(true)
            await metaverseService?.joinOrCreateMetaverse(username)
            console.log('Joined pear-connect metaverse!')
            setIsJoining(false)
            setHasJoined(true)
        } catch (err) {
            console.error(err)
            setIsJoining(false)
        }
    }, [metaverseService, username, hasJoined])

    const jsxMetaversePlayers = useMemo(() => {
        const jsx: any[] = []

        state.metaversePlayers.forEach((mp, key) => {
            const {
                moveX,
                moveY,
                moveZ,
                rotateX,
                rotateY,
                rotateZ,
                username: un,
            } = mp
            console.log(moveX, moveY)
            const elem = (
                <div
                    style={{
                        border: '1px solid rgba(255, 255, 255, .24)',
                        padding: 8,
                        margin: 8,
                    }}
                >
                    <div>Session Id: {key}</div>
                    <div>Username: {un}</div>
                    <div>MX: {moveX.toString()}</div>
                    <div>MY: {moveY.toString()}</div>
                    <div>MZ: {moveZ}</div>
                    <div>RX: {rotateX}</div>
                    <div>RY: {rotateY}</div>
                    <div>RZ: {rotateZ}</div>
                </div>
            )
            jsx.push(elem)
        })

        return jsx
    }, [state])

    console.log(state.metaversePlayers)

    return (
        <SPearMetaverse>
            <SPanel>
                {isJoining && (
                    <SLoadingOverlay>
                        Joining Pear Connect Metaverse...
                    </SLoadingOverlay>
                )}
                {!hasJoined && (
                    <>
                        <input
                            placeholder="Metaverse username..."
                            value={username}
                            onChange={(e: any) =>
                                setUsername(e.currentTarget.value)
                            }
                        />
                        <button onClick={joinMetaverse}>Join Metaverse</button>
                    </>
                )}
                {jsxMetaversePlayers}
            </SPanel>
        </SPearMetaverse>
    )
}

export default PearMetaverse