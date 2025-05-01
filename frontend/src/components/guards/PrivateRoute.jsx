import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
    const token = sessionStorage.getItem('access');
    return (
        token ? <Outlet /> : <Navigate to="/auth" replace={true} />
    );
};

export default PrivateRoute;