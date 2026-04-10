// hooks/useAuth.js
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logoutUser, checkAuth } from '../features/UserSlice';
import { setRedirectURL } from '../features/RedirectSlice';
import { useLocation, useNavigate } from 'react-router'; // Fixed import
import { toast } from 'react-hot-toast';

export function useAuth(customButton = null) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const { user, isAuthenticated, loading, error } = useSelector((state) => state.user);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show error toasts
  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Something went wrong');
    }
  }, [error]);

  const login = async (credentials) => {
    try {
      const result = await dispatch(loginUser(credentials)).unwrap();
      toast.success(`Welcome back, ${result.user?.firstName || 'User'}!`);
      return result;
    } catch (err) {
      toast.error(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const result = await dispatch(registerUser(userData)).unwrap();
      toast.success(`Welcome ${result.user?.firstName || 'User'}! Registration successful`);
      return result;
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully');
      setShowDropdown(false);
      navigate(location.pathname);
    } catch (err) {
      toast.error('Logout failed');
    } finally {
      setIsLoggingOut(false);
    }
  };


  

  const handleAuthClick = () => {
    dispatch(setRedirectURL(location.pathname));
    navigate('/register');
  };

  const handleNavigation = (path) => {
    setShowDropdown(false);
    navigate(path);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.emailId || user?.email) {
      return (user?.emailId || user?.email).charAt(0).toUpperCase();
    }
    return 'U';
  };

  // UserProfile component defined inside useAuth to access closure variables
  const UserProfile = () => (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-expanded={showDropdown}
        aria-label="User menu"
      >
        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
          {getUserInitials()}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-gray-700">
            {user?.firstName || user?.name || 'User'}
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-20 animate-fadeIn">
          {/* User Info Header */}
          <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {getUserInitials()}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName || ''}
                </p>
                <p className="text-sm text-gray-500 truncate">{user?.emailId || user?.email}</p>
                {user?.role && (
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                    {user.role}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <MenuItem
              icon="🏠"
              label="Dashboard"
              onClick={() => handleNavigation('/dashboard')}
            />
            <MenuItem
              icon="📦"
              label="My Orders"
              onClick={() => handleNavigation('/orders')}
              badge="3"
            />
            <MenuItem
              icon="👤"
              label="Profile Settings"
              onClick={() => handleNavigation('/profile')}
            />
            <MenuItem
              icon="❤️"
              label="Saved Items"
              onClick={() => handleNavigation('/saved')}
            />
            <MenuItem
              icon="🔔"
              label="Notifications"
              onClick={() => handleNavigation('/notifications')}
            />

            <hr className="my-2 border-gray-100" />

            <MenuItem
              icon="🚪"
              label={isLoggingOut ? "Logging out..." : "Sign Out"}
              onClick={logout}
              variant="danger"
              disabled={isLoggingOut}
            />
          </div>
        </div>
      )}
    </div>
  );

  // Loading state component
  const LoadingState = () => (
    <div className="flex items-center gap-2 px-3 py-1.5">
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
      <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );

  // Auth UI Component
  const AuthUI = () => {
    return (
      isAuthenticated ? (
        <UserProfile />
      ) : (
        <div onClick={handleAuthClick} className="cursor-pointer">
          {customButton || (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Sign In / Register
            </button>
          )}
        </div>
      )
    );
  };

  return {
    // State and functions
    user,
    isAuthenticated,
    loading,
    error,
    showDropdown,
    setShowDropdown,
    login,
    register,
    logout,
    handleAuthClick,
    getUserInitials,

    // UI Components
    AuthUI,
    UserProfile,
    LoadingState
  };
}

// Helper component for menu items (defined outside)
const MenuItem = ({ icon, label, onClick, badge, variant = 'default', disabled = false }) => {
  const variants = {
    default: 'hover:bg-gray-50 text-gray-700',
    danger: 'hover:bg-red-50 text-red-600'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left px-4 py-2.5 text-sm ${variants[variant]} flex items-center gap-3 transition-all duration-200 group ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className="text-lg">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
};