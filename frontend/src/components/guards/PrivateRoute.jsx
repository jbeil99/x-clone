import { Outlet, Navigate } from "react-router-dom"

const PrivateRoute = () => {

    const token = sessionStorage.getItem('access') || true

    return (

        token ? <Outlet /> : <Navigate to="/login" replace={true} />

    )
}

export default PrivateRoute