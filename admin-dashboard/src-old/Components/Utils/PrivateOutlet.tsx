import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import Navbar from '../Core/Navbar'

function PrivateOutlet({
    layoutRef
}: any) {
    const { authToken, publicAddress } = useAuth()

    // if (!authToken) return <Navigate to="/connect-wallet" />

    return (
        <>
            {publicAddress && <Navbar dragAreaRef={layoutRef} />}
            <Outlet />
        </>
    )
}

export default PrivateOutlet
