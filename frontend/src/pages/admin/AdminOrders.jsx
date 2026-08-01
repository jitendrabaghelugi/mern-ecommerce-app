import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const AdminOrders = () => {

  const [getOrders, setGetOrders] = useState([])
  const accessToken = localStorage.getItem("accessToken")
  const [loading, setLoading] = useState(true)

  const getAllUsersOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/order/allUserOrder`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      console.log(res.data.orders)

      if (res.data.success) {
        setGetOrders(res.data.orders)
      }

    } catch (err) {

      toast.error("Somthing went worng.")
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllUsersOrders()
  }, [accessToken])

  if(loading){
    return <div className="text-center py-20 text-grey-500">Loading all orders...</div>
  }

  return (
    <div className="p-6 md:p-8 font-sans bg-white min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 tracking-tight">
        Admin - All Orders
      </h1>

      {
        getOrders?.length < 0 ?
          (<p className="text-grey-500">No Orders Found</p>)
          : (<div className="overflow-x-auto rounded-lg shadow-sm">
            <table className="w-full text-left border-collapse border border-gray-200 min-w-200">
              <thead>
                <tr className="bg-[#f8f9fc]">
                  <th className="border border-gray-200 p-4 font-bold text-sm text-gray-900 whitespace-nowrap">Order ID</th>
                  <th className="border border-gray-200 p-4 font-bold text-sm text-gray-900 whitespace-nowrap">User</th>
                  <th className="border border-gray-200 p-4 font-bold text-sm text-gray-900 whitespace-nowrap">Products</th>
                  <th className="border border-gray-200 p-4 font-bold text-sm text-gray-900 whitespace-nowrap">Amount</th>
                  <th className="border border-gray-200 p-4 font-bold text-sm text-gray-900 whitespace-nowrap">Status</th>
                  <th className="border border-gray-200 p-4 font-bold text-sm text-gray-900 whitespace-nowrap">Date</th>
                </tr>
              </thead>
              <tbody>

                {
                  getOrders.map((order) => {
                    return <tr key={order._id} className="hover:bg-gray-50 transition-colors bg-white">
                      <td className="border border-gray-200 p-4 text-sm text-gray-600 font-medium">
                        {order._id}
                      </td>
                      <td className="border border-gray-200 p-4 text-sm text-gray-400">
                        {order.user.email}
                      </td>
                      <td className="border border-gray-200 p-4 text-sm text-gray-600">
                        × {order.products[0].quantity}
                      </td>
                      <td className="border border-gray-200 p-4 text-sm text-gray-800 font-medium">
                        ₹{order.amount}
                      </td>
                      <td className="border border-gray-200 p-4 text-sm">
                        <span className={`${order.status === "Paid" ? "text-green-500 bg-green-50" : order.status === "Pending" ? "text-orange-500 bg-orange-50" : "text-red-500 bg-red-50"} inline-flex items-center px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors   hover:bg-red-100`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="border border-gray-200 p-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  })
                }


              </tbody>
            </table>
          </div>)
      }


    </div>
  );
}

export default AdminOrders;