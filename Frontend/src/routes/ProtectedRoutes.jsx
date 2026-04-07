import React from 'react'
import { Outlet } from 'react-router'

export default function ProtectedRoutes() {
    return (
        <div>
            <Outlet></Outlet>       
        </div>
    )
}
