import React from 'react'
import CommonHeader from '../components/Header/CommonHeader'
import { Outlet } from 'react-router'
function MainLayout() {
  return (
    <div>
        
       <CommonHeader/>
        <Outlet></Outlet>
    </div>
  )
}

export default MainLayout