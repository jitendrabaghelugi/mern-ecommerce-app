import OrderCard from '@/components/OrderCard'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

const ShowUserOrders = () => {

  const { userId } = useParams()
  const accessToken = localStorage.getItem("accessToken")
  const [userData, setUserData] = useState()

  const getUserOrder = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/order/user-order/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )


      if (res.data.success) {
        setUserData(res.data.getOrder)
      }

    } catch (err) {
      console.log(err)
      toast.error("Something went wrong")
    }
  }

  useEffect(() => {
    getUserOrder()
  }, [])


  return (
    <OrderCard userOrder={userData} />
  )
}

export default ShowUserOrders