import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
    const {user}=useSelector((store)=>store.user)
    const navigate =useNavigate()
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-white border-[5px] border-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                </div>


                <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
                    Payment Successful <span>🎉</span>
                </h2>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed px-2">
                    Thank you for your purchase! Your order has been placed successfully.
                </p>

                <div className="space-y-3 flex flex-col">
                    <button onClick={()=>navigate("/product")} className="w-full bg-[#d6006e] hover:bg-[#b8005e] text-white font-medium py-3 px-4 rounded-xl transition duration-200">
                        Continue Shopping
                    </button>
                    <button onClick={()=>navigate(`/profile/${user._id}`)} className="w-full bg-white hover:bg-pink-50 text-[#d6006e] font-medium py-3 px-4 rounded-xl border  border-[#d6006e] transition duration-200">
                        View My Orders
                    </button>
                </div>

            </div>
        </div>
    );
};

export default OrderSuccess