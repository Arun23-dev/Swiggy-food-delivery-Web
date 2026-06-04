// App.jsx - Corrected version
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router';

// Routes
import ProtectedRoutes from './routes/ProtectedRoutes';
import AuthRoutes from './routes/AuthRoutes';
import OpenRoutes from './routes/OpenRoutes'; // Rename PublicRoutes to OpenRoutes

// Layouts
import MainLayout from './layout/MainLayout';
import AuthLayout from './layout/AuthLayout';
import DashboardLayout from './layout/DashboardLayout';

// Public Pages (Open to everyone)
import Home from './pages/Home';
import Resturants from "./pages/Resturants";
import ResturantMenu from "./pages/ResturantMenu";
import SearchPage from './pages/SearchPage';

// Auth Pages (Only when NOT logged in)
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Pages (Only when logged in)
import CheckoutPage from './pages/CheckoutPage';
import Order from './pages/Order';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import ProfileSettings from "./pages/ProfileSettings";
import PaymentPage from './pages/PaymentPage';

// Other
import Success from './components/Success';
import Failure from './components/Failure';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './slices/UserSlice';
import { fetchRestaurants } from './slices/ResturantSlice';

function App() {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { data } = useSelector((state) => state.resturant);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(checkAuth());
    }
    if (!data) {
      dispatch(fetchRestaurants());
    }
  }, []);

  return (
    <Routes>
      {/* ==================== OPEN ROUTES (Everyone can access) ==================== */}
      <Route element={<OpenRoutes />}>
        {/* Home Page - Public */}
        <Route path="/" element={<Home />} />

        {/* Restaurant Pages with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path='/restaurants' element={<Resturants />} />
          <Route path='/city/delhi/:restaurantId'>
            <Route index element={<ResturantMenu />} />
            <Route path='search' element={<SearchPage />} />

          </Route>
          <Route path='/checkout' element={<CheckoutPage />} />
        </Route>
      </Route>

      {/* ==================== AUTH ROUTES (Only when NOT logged in) ==================== */}
      <Route element={<AuthRoutes />}>
        <Route element={<AuthLayout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Route>

      {/* ==================== PROTECTED ROUTES (Only when logged in) ==================== */}
      <Route element={<ProtectedRoutes />}>
        {/* Checkout - Protected */}

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Order />} />
          <Route path="cart" element={<Cart />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="profile" element={<ProfileSettings />} />
        </Route>
      </Route>

      {/* ==================== PAYMENT CALLBACK ROUTES (Public) ==================== */}
      <Route path="/checkout/payment/esewa/success" element={<Success />} />
      <Route path="/checkout/payment/esewa/failure" element={<Failure />} />
    </Routes>
  );
}

export default App;