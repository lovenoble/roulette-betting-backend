import { Navigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

function PrivateRoute({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAuth()

    return isAuthenticated ? children : <Navigate to="/login" />
}

export default PrivateRoute