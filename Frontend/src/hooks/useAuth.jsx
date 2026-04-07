import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logoutUser, checkAuth } from '../features/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state)=> state.auth);

  const login = (credentials) => dispatch(loginUser(credentials));
  const register = (userData) => dispatch(registerUser(userData));
  const logout = () => dispatch(logoutUser());
  const checkAuthStatus = () => dispatch(checkAuth());

  return {
    // user,
    // isAuthenticated,
    // loading,
    // error,
    login,
    register,
    logout,
    checkAuthStatus,
  };
};