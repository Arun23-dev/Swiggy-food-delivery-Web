// routes/AuthRoutes.jsx
import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';

const AuthRoutes = () => {
    const { isAuthenticated, } = useSelector((state) => state.user);

    // If already authenticated, redirect to home
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AuthRoutes;