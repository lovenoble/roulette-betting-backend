import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import useReactiveStorage from '../../hooks/useReactiveStorage'

const SGuestLogin = styled.div`
    height: 200px;
    width: 200px;
    background: black;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 24px;
    left: 24px;
`

function GuestLogin() {
    const navigate = useNavigate()
    const [guestLocalStorage, setGuestLocalStorage] = useReactiveStorage('guestUsername', '')
    const [guestUsername, setGuestUsername] = useState(guestLocalStorage)

    const onGuestLogin = useCallback(() => {
        if (!guestUsername.trim().length) {
            return alert('Username is required')
        }

        setGuestLocalStorage(guestUsername)
        setGuestUsername('')
        navigate('/crypto/games')
    }, [guestUsername, setGuestLocalStorage, navigate])

    return (
        <SGuestLogin>
            <h2>Guest Login</h2>
            <input
                type="text"
                value={guestUsername}
                onChange={(e: any) => setGuestUsername(e.currentTarget.value)}
            />
            <button onClick={onGuestLogin}>Login</button>
        </SGuestLogin>
    )
}

export default GuestLogin