import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
    const token = sessionStorage.getItem('access');
    console.log(token)
    return (
        token ? <Outlet /> : <Navigate to="/auth" replace={true} />
    );
};

export default PrivateRoute;