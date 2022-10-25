import { useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'

import rpcClient from '../../lib/rpc'

const SCreatePlayer = styled.form`
    width: 500px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(0, 0, 0, 0.18);
    .error-msg {
        color: red;
        font-size: 12px;
    }
    > input {
        margin-bottom: 12px;
    }
    > a {
        margin-bottom: 12px;
    }
`

function CreatePlayer() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const onSubmit = useCallback(
        async (event) => {
            try {
                event.preventDefault()
                setErrorMsg('')
                if (!username) {
                    return setErrorMsg('Please enter a username')
                } else if (!password) {
                    return setErrorMsg('Please enter a password')
                } else if (password !== passwordConfirm) {
                    return setErrorMsg('Passwords do not match')
                }

                const request = new rpcClient.playerMessage.CreateRequest()
                request.setUsername(username)
                request.setPassword(password)
                request.setSessionid('session-id')

                const response = await rpcClient.playerClient.create(request, null)

                localStorage.setItem('token', response.getToken())
                navigate('/')
            } catch (err) {
                if (err instanceof Error) {
                    setErrorMsg(err.message)
                } else {
                    console.error(err)
                }
            }
        },
        [username, password, passwordConfirm, navigate]
    )

    return (
        <SCreatePlayer onSubmit={onSubmit}>
            <h2>Sign Up</h2>
            {errorMsg && <span className="error-msg">{errorMsg}</span>}
            <input
                autoFocus
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Confirm Password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
            />
            <Link to={'/login'}>Go to Login</Link>
            <button>Sign Up</button>
        </SCreatePlayer>
    )
}

export default CreatePlayer