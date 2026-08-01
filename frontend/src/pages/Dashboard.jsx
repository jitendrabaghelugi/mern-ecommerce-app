import SideBar from '@/components/SideBar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <SideBar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard