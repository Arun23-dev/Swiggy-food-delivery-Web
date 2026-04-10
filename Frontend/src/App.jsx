import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router';

// Routes
import ProtectedRoutes from './routes/ProtectedRoutes';
import PublicRoutes from './routes/PublicRoutes';
// Layouts

import MainLayout from './layout/MainLayout';
import AuthLayout from './layout/AuthLayout';
import DashboardLayout from './layout/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import Resturants from "./pages/Resturants"
import Login from './pages/Login';
import Register from './pages/Register';
import ResturantMenu from "./pages/ResturantMenu"
import SearchPage from './pages/SearchPage';
import CheckoutPage from './pages/CheckoutPage';

//Protected Pages
import Order from './pages/Order';
import Cart from './pages/Cart'
;
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './features/UserSlice';
import {fetchResturant} from './features/ResturantSlice';

function App() {



  const {user}=useSelector((state)=>state.user);
  const {data}=useSelector((state)=>state.resturant);
  const dispatch=useDispatch();


  // first always to checkauth and also fetch the resturant data here so that better user expericen
  useEffect(()=>{
     console.log("🔄 useEffect ran! Current user:", user);
    dispatch(checkAuth());

    if(!data){
    dispatch(fetchResturant())
    }

  },[])


  return (
    <Routes>
      {/* PUBLIC LAYOUT - Base wrapper */}
      <Route element={<PublicRoutes />}>
        <Route path="/" element={<Home />} />
         <Route path='/checkout' element={<CheckoutPage/>} />


        {/* AUTH LAYOUT - For register/login (NO header) */}
        <Route element={<AuthLayout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* MAIN LAYOUT - With header for restaurant pages */}
        <Route element={<MainLayout />}>
          <Route path='/resturants' element={<Resturants />} />
          <Route path='/city/delhi/:restaurantId'>
            <Route index element={<ResturantMenu />} />          {/* exact match only */}
            <Route path='search' element={<SearchPage />} />     {/* /city/delhi/:id/search */}
           
          </Route>


        </Route>

      </Route>

      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard/*" element={<DashboardLayout />} />
      </Route>
    </Routes>

  );
}

export default App;