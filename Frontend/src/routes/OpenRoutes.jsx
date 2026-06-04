import React from 'react'
import { Outlet } from 'react-router'

function PublicRoutes() {
    return (
        <div>
            <Outlet></Outlet>
        </div>
    )
}

export default PublicRoutes;