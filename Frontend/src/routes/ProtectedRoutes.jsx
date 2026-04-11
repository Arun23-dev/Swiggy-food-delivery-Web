// routes/ProtectedRoutes.jsx
import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const ProtectedRoutes = () => {
  
  const { isAuthenticated, loading } = useSelector((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoutes;