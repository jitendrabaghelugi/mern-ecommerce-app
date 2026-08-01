import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const AdminSales = () => {

  const [sale, setSale] = useState({})
  const accessToken = localStorage.getItem("accessToken")

  const getData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/order/salesData`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (res.data.success) {
        setSale(res.data)
        console.log(res.data)
      }

    } catch (error) {
      console.log(error?.response.data)
    }
  }

  useEffect(() => {
    getData()
  }, [])


  return (
    <div className="p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-5">

        <div className="bg-[#f03296] rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-30">
          <h3 className="text-white text-sm font-medium">Total Users</h3>
          <p className="text-white text-3xl font-bold mt-4">{sale?.totalUsers || "0"}</p>
        </div>
        <div className="bg-[#f03296] rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-">
          <h3 className="text-white text-sm font-medium">Total Products</h3>
          <p className="text-white text-3xl font-bold mt-4">{sale?.totalProducts || "0"}</p>
        </div>
        <div className="bg-[#f03296] rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-">
          <h3 className="text-white text-sm font-medium">Total Orders</h3>
          <p className="text-white text-3xl font-bold mt-4">{sale?.totalOrder || "0"}</p>
        </div>
        <div className="bg-[#f03296] rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-">
          <h3 className="text-white text-sm font-medium">Total Sales</h3>
          <p className="text-white text-3xl font-bold mt-4">{sale?.TotalSales || "0"}</p>
        </div>

      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales (Last 30 days)</CardTitle>
        </CardHeader>
        <CardContent style={{  height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sale.formattedSales}>

              <XAxis dataKey={"date"} />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey={"amount"} stroke="#F47286" fill='#F47286'/>

            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminSales