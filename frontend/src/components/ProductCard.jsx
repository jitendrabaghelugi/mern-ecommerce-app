import { setCarts } from '@/redux/productSlices'
import axios from 'axios'
import { ShoppingCart } from 'lucide-react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'


const ProductCard = ({ product }) => {

    const { productName, productPrice, productImg } = product
    const { url } = productImg[0]

    const accessToken = localStorage.getItem('accessToken')
    const dispatch = useDispatch()
    const navigate=useNavigate()

    const addToCart = async (productId) => {
        try {
            const response = await axios.post("http://localhost:5000/api/v1/cart/add", { productId }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            if (response.data.success) {
                toast.success("Product is added sucessfully")
                dispatch(setCarts(response.data.cart))
                console.log(response.data)
            }


        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="w-55 p-4 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
            <div onClick={()=>navigate(`${product._id}`)} className="flex justify-center items-center h-40 mb-4 cursor-pointer">
                <img
                    src={url}
                    alt="iPhone Air 256 GB"
                    className="object-contain h-full"
                />
            </div>

            <h3 className="text-[16px] font-medium line-clamp-2 overflow-hidden text-ellipsis ">
                {productName}
            </h3>

            <p className="mt-2 text-lg font-bold text-black">
                ₹{productPrice.toLocaleString()}
            </p>

            <button onClick={() => addToCart(product._id)} className="w-full mt-4 flex items-center cursor-pointer justify-center gap-2 bg-[#E3007E] hover:bg-[#C2006B] text-white py-2.5 rounded-xl font-medium transition-colors duration-200">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
            </button>

        </div>
    )
}

export default ProductCard