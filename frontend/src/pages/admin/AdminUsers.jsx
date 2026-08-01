import { Input } from '@/components/ui/input'
import axios from 'axios'
import { Eye, Search, SquarePen } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminUsers = () => {

  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const navigate = useNavigate()
  const accessToken = localStorage.getItem("accessToken")

  const getAllUsers = async () => {
    try {
      const res = await axios.get("https://mern-ecommerce-app-n6us.onrender.com/api/v1/user/allUser", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (res.data.success) {
        setUsers(res.data.getAllUser)
      }

    } catch (err) {
      console.log(err?.response.data)
    }
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  const searchFilters = users.filter((user) => {
    return `${user.firstName}.${user.lastName}`.toLowerCase().includes(search.toLowerCase())
      || `${user.email}`.toLowerCase().includes(search.toLowerCase());
  })

  return (
    <div className="py-6 px-15  min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl font-bold">User Management</h1>
      <p className="">
        View and Manage Register Users
      </p>

      <div className="relative w-90 mt-6">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} className="bg-white absolute pl-10" placeholder="Search User..." />
        <Search className="absolute left-2 top-1 text-gray-500 rounded" />
      </div>

      <div className="min-w-md grid grid-cols-3 mt-20 gap-4">
        {
          searchFilters.map((user) => {
            return <div key={user?._id} className="bg-pink-100 rounded-xl p-5 shadow-sm border border-pink-200">
              <div className="flex items-center gap-4">
                <img src={user?.profilePic} alt="Profile" className="w-18 h-18 rounded-full object-cover" />

                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-sm text-gray-600 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-3">
                <button onClick={() => navigate(`/dashboard/users/${user?._id}`)} className="flex items-center gap-2 px-4 py-2 font-bold rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition cursor-pointer">
                  <SquarePen size={16} />
                  Edit
                </button>

                <button onClick={() => navigate(`/dashboard/users/orders/${user?._id}`)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition cursor-pointer">
                  <Eye size={16} />
                  Show Order
                </button>
              </div>
            </div>
          })
        }
      </div>
    </div>
  )
}

export default AdminUsers