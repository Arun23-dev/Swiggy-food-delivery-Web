import React from 'react'
import Register from '../pages/Register'
import Login from '../pages/Login'
import { Outlet } from 'react-router'

function AuthLayout() {
  return (
   <Outlet></Outlet>
  )
}

export default AuthLayout