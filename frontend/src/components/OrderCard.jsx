import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const OrderCard = ({ userOrder }) => {

    const navigate = useNavigate()

    return (

        <div className="min-h-screen p-8 font-sans">

            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 bg-[#1a1d21] text-white rounded-xl hover:bg-black transition-colors shadow-sm cursor-pointer">
                    <ArrowLeft size={20} strokeWidth={2.5} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
            </div>

            {userOrder?.length > 0 ? (
                <div className="flex flex-col gap-6">
                {
                    userOrder?.map((order) => {
                        return <div key={order?._id} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 ">

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                                <div className="text-gray-900 font-bold text-base">
                                    <span className="text-gray-700 font-semibold">Order ID: </span>
                                    {order?._id}
                                </div>
                                <div className="text-gray-500 font-medium text-sm mt-2 sm:mt-0">
                                    Amount: <span className="text-gray-900 font-bold text-base ml-1">INR ₹{order?.amount}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-6">
                                <div className="space-y-1">
                                    <p className="text-gray-600 text-sm">
                                        <span className="font-semibold text-gray-700">User:</span>{order?.user?.firstName}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        <span className="font-semibold text-gray-400">Email:</span> {order?.user?.email}
                                    </p>
                                </div>
                                <div className={` ${order?.status == "Paid" ? "bg-green-500" : order?.status == "Failed" ? "bg-red-500" : "bg-orange-500"} text-white px-3 py-1 rounded-lg font-medium text-sm shadow-sm`}>
                                    {order?.status}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-gray-900 font-bold text-base mb-3">Products:</h2>
                                {
                                    order.products.map((product) => {
                                        return <div key={product?._id} className="bg-[#f8f9fc] rounded-xl p-4 flex items-center gap-4 border border-gray-100">
                                            <div className="w-14 h-14 bg-white rounded-lg border border-gray-200 shrink-0 flex items-center justify-center overflow-hidden p-1 shadow-sm">
                                                <img onClick={() => navigate(`/product/${product?.productId?._id}`)} src={product?.productId?.productImg?.[0]?.url} alt="iPhone" className="max-w-full max-h-full object-contain cursor-pointer" />
                                            </div>

                                            <div className="flex-1 flex flex-col lg:flex-row lg:items-center justify-between gap-2 lg:gap-4 text-sm">
                                                <div className="text-gray-700 font-medium line-clamp-2 leading-relaxed flex-1">
                                                    {product?.productId?.productName}
                                                </div>

                                                <div className="flex items-center gap-4 lg:gap-6 justify-between lg:justify-end w-full lg:w-auto mt-2 lg:mt-0">
                                                    <span className="text-gray-500 font-mono text-xs truncate max-w-37.5 sm:max-w-none">
                                                        {product?.productId?._id}
                                                    </span>
                                                    <div className="whitespace-nowrap">
                                                        <span className="text-gray-900 font-bold">₹{product?.productId?.productPrice}</span>
                                                        <span className="text-gray-500 font-medium ml-2">x {product?.quantity}</span>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    })

                                }

                            </div>

                        </div>
                    })
                }

            </div>
        ) : <div className="text-grey-500 text-center">No Order Found Yet.</div>}


        </div>
    )
}

export default OrderCard