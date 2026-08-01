import OrderCard from '@/components/OrderCard'
import axios from 'axios'

import React, { useEffect, useState } from 'react'


const MyOrder = () => {

    const [userOrder, setUserOrder] = useState([])
    const accessToken = localStorage.getItem("accessToken")
    

    const getUserOrder = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/order/myOrder`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            console.log(res.data.getOrder)

            if (res.data.success) {
                setUserOrder(res.data.getOrder)
            }

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getUserOrder()
    }, [])

    return (
        
        <OrderCard userOrder={userOrder} />
    );
}

export default MyOrder