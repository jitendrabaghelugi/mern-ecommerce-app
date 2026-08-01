import { setCarts } from '@/redux/productSlices'
import axios from 'axios'
import { ShoppingCart, Trash2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Cart = () => {

  const { cart } = useSelector((store) => store.products)

  const subtotal = cart?.totalPrice
  const shipping = subtotal > 299 ? 0 : 100
  const tax = subtotal * 0.05
  const total = subtotal + shipping + tax
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const API_URL = "http://localhost:5000/api/v1/cart"
  const accessToken = localStorage.getItem("accessToken")

  const loadCart = async () => {
    try {
      const res = await axios.get(`${API_URL}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (res.data.success) {
        dispatch(setCarts(res.data.cart))
      }

    } catch (err) {
      console.log(err)
    }
  }

  const updateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(`${API_URL}/update`, { productId, type }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (res.data.success) {
        dispatch(setCarts(res.data.cart))
      }

    } catch (error) {
      console.log(error.response?.data);
    }

  }

  const removeProduct = async (productId) => {
    try {
      const res = await axios.delete(`${API_URL}/remove`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: { productId }
      })

      if (res.data.success) {
        dispatch(setCarts(res.data.cart))
        toast.success("You have remove the product successfully")
      }

    } catch (err) {
      console.log(err)
    }

  }


  useEffect(() => {
    loadCart()
  }, [dispatch]);

  return (
    <div className="pt-6 bg-gray-50 min-h-[calc(100vh-70px)]">
      {cart?.items?.length > 0
        ?
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-7">Shopping Cart</h1>
          <div className="max-w-7xl mx-auto flex gap-5 items-start" >
            <div className="flex-1">
              {
                cart.items.map((item) => (
                  <div key={item?._id} className="bg-white border rounded-xl p-5 mb-5">
                    <div className="flex items-center gap-4 ">
                      <img
                        src={item?.productId?.productImg?.[0]?.url}
                        alt=""
                        className="w-24 h-24 object-contain"
                      />
                      <div className="min-w-50">
                        <h2 className="font-semibold text-gray-800 line-clamp-1">
                          {item?.productId?.productName}
                        </h2>
                        <p className="text-lg font-medium text-gray-700">
                          ₹{item?.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-5">
                        <button onClick={() => updateQuantity(item.productId._id, "decrease")} className="w-9 h-9 border rounded-md cursor-pointer hover:bg-gray-100">
                          -
                        </button>
                        <span className="font-medium">{item?.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId._id, "increase")} className="w-9 h-9 border rounded-md cursor-pointer hover:bg-gray-100">
                          +
                        </button>
                      </div>
                      <div className="w-30 text-center shrink-0">
                        ₹{item.price}
                      </div>
                      <div onClick={() => removeProduct(item.productId._id)} className="w-28 h-10 text-red-500 rounded-lg flex justify-center items-center gap-1 cursor-pointer hover:bg-red-100 shrink-0">
                        <Trash2 size={18} />
                        <span>Remove</span>
                      </div>

                    </div>
                  </div>
                ))
              }

            </div>
            <div className="bg-white border rounded-xl p-6 h-fit shadow-sm">
              <h2 className="text-xl font-semibold mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal ({cart?.items?.length} items)</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <hr className="my-5" />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>


              <div className="flex mt-6 gap-2">
                <input
                  type="text"
                  placeholder="Promo Code"
                  className="flex-1 border rounded-lg px-3 py-2 outline-none"
                />
                <button className="border px-4 rounded-lg hover:bg-gray-100">
                  Apply
                </button>
              </div>

              <button onClick={() => navigate("/address")} className="w-full mt-4 bg-pink-600 cursor-pointer text-white py-3 rounded-lg font-medium hover:bg-pink-700">
                PLACE ORDER
              </button>

              <button className="w-full mt-3 border py-3 rounded-lg hover:bg-gray-100">
                Continue Shopping
              </button>

              <div className="mt-5 text-sm text-gray-500 space-y-1">
                <p>* Free shipping on orders over ₹299</p>
                <p>* 30-days return policy</p>
                <p>* Secure checkout with SSL encryption</p>
              </div>
            </div>
          </div>
        </div>
        :
        <div className="flex flex-col justify-center items-center min-h-[60vh] p-6 text-center">
          <div className="bg-pink-200 p-6 rounded-full w-30">
            <ShoppingCart className="w-16 h-16 text-pink-600" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-grey-800"> Your Cart is Empty</h2>
          <p className="mt-2 text-grey-600"> Look like you haven't added anything to your cart yet</p>
          <button onClick={() => { navigate('/product') }} className="bg-pink-600 text-white p-2 rounded-[15px] mt-4 cursor-pointer">
            Start Shopping
          </button>

        </div>
      }
    </div >
  )
}

export default Cart