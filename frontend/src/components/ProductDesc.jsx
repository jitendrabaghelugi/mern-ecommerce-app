import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { setCarts } from '@/redux/productSlices'

const ProductDesc = ({ productInfo }) => {

    const dispatch = useDispatch()

    const accessToken = localStorage.getItem("accessToken")

    const addProduct = async (productId) => {
        try {
            const response = await axios.post("http://localhost:5000/api/v1/cart/add", { productId }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            if (response.data.success) {
                dispatch(setCarts(response.data.cart))
                toast.success("Your Product is added into the cart")
            }

        } catch (err) {
            console.log(err)
        }

    }
    return (
        <div className="flex flex-col gap-4">
            <h1 className="font-bold text-4xl text-gray-800">{productInfo.productName}</h1>
            <p className="text-gray-800">{productInfo.category} | {productInfo.brand}</p>
            <h2 className="text-pink-500 font-bold text-2xl">₹{productInfo.productPrice}</h2>
            <p className="line-clamp-12 text-muted-foreground">{productInfo.productDesc}</p>
            <div className="flex gap-2 items-center w-75">
                <p className="text-gray-800 font-semibold">Quantity :</p>
                <Input type="number" className="w-14" defaultValue={1} />
            </div>
            <Button onClick={() => addProduct(productInfo._id)} className="bg-pink-600 w-max cursor-pointer" >Add to Cart</Button>
        </div>
    )
}

export default ProductDesc