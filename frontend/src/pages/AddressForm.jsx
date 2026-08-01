import { addAddress, deleteAddress, setCarts, setSelectedAddress } from "@/redux/productSlices";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddressForm = () => {
    const { cart, addresses, selectedAddress } = useSelector((store) => store.products)
    const [showForm, setShowForm] = useState(addresses.length > 0 ? false : true)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const accessToken = localStorage.getItem("accessToken")


    const [addressData, setAddressData] = useState({
        fullName: "",
        phoneNumber: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setAddressData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        dispatch(addAddress(addressData))
        setShowForm(false)
    }

    const subtotal = cart.totalPrice
    const shipping = subtotal > 50 ? 0 : 10
    const tax = parseFloat((subtotal * 0.05).toFixed(2))
    const total = subtotal + shipping + tax


    const handlePayment = async () => {

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_URL}/api/v1/order/create-order`, {
                products: cart?.items?.map((item) => ({
                    productId: item.productId._id,
                    quantity: item.quantity
                })),
                amount: total,
                tax,
                shipping,
                currency: "INR"
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            if (!data.success) {
                return toast.error("Something went wrong.")
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency,
                order_id: data.order.id,
                name: "Jitendra",
                description: "Order Payment",
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(`${import.meta.env.VITE_URL}/api/v1/order/verfiy-order`, response, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        })

                        if (verifyRes.data.success) {
                            toast.success("Payment SuccessFull")
                            dispatch(setCarts({ items: [], totalPrice: 0 }))
                            navigate("/order-success")
                        } else {
                            toast.error("Payment Verification Failwd")
                        }

                    } catch (err) {
                        toast.error("Error verfiying payment")
                    }
                },
                modal: {
                    ondismiss: async function () {
                        //When user close the razorpay popup during the payment
                        await axios.post(`${import.meta.env.VITE_URL}/api/v1/order/verfiy-order`, {
                            razorpay_order_id: data.order.id,
                            paymentFailed: true
                        }, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        });
                        toast.error("Payment Cancelled or failed.")
                        navigate("/cart");
                    },
                    escape: true,
                    backdropclose: true,
                    confirm_close: true
                },
                prefill: {
                    name: addressData.fullName,
                    email: addressData.email,
                    contact: addressData.phoneNumber
                },
                theme: {
                    color: "#F472B6"
                }
            }

            const rzp = new window.Razorpay(options)

            rzp.on("payment.failed", async function (response) {
                await axios.post(`${import.meta.env.VITE_URL}/api/v1/order/verfiy-order`, {
                    razorpay_order_id: data.order.id,
                    paymentFailed: true
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                toast.error("Payment Cancelled or failed.")
                navigate("/cart");
            });

            rzp.open();


        } catch (error) {
            console.log(error)
            toast.error("Error Verifying Payment")
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            {
                showForm ?
                    (<div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
                        <form className="space-y-5">

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2"> Full Name </label>
                                <input type="text" value={addressData.fullName} onChange={handleChange} name="fullName" placeholder="Enter Your Name" className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 outline-none focus:ring-2 focus:ring-black" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2"> Phone Number </label>
                                <input type="text" value={addressData.phoneNumber} onChange={handleChange} name="phoneNumber" placeholder="Enter Your Phone No." className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 outline-none focus:ring-2 focus:ring-black" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2"> Email </label>
                                <input type="email" value={addressData.email} onChange={handleChange} name="email" placeholder="Enter Your Email" className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 outline-none focus:ring-2 focus:ring-black" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2"> Address </label>
                                <input type="text" value={addressData.address} onChange={handleChange} name="address" placeholder="Enter Your Full Address" className="w-full rounded-md border-2 border-gray-300 bg-gray-100 px-4 py-3 outline-none focus:ring-2 focus:ring-black" />
                            </div>


                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2"> City </label>
                                    <input type="text" value={addressData.city} onChange={handleChange} name="city" placeholder="Enter Your City" className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 outline-none focus:ring-2 focus:ring-black" />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2"> State </label>
                                    <input type="text" value={addressData.state} onChange={handleChange} name="state" placeholder="Enter Your State" className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 outline-none focus:ring-2 focus:ring-black" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2"> Zip Code </label>
                                    <input type="text" value={addressData.zipCode} onChange={handleChange} name="zipCode" placeholder="Enter Your Zip Code" className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 outline-none focus:ring-2 focus:ring-black" />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2"> Country </label>
                                    <input type="text" value={addressData.country} onChange={handleChange} name="country" placeholder="Enter Your Country" className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 outline-none focus:ring-2 focus:ring-black" />
                                </div>
                            </div>

                            <button onClick={handleSave} type="submit" className="w-full bg-black text-white rounded-md py-3 font-semibold hover:bg-gray-900 transition cursor-pointer" >
                                Save & Continue
                            </button>
                        </form>
                    </div>)
                    :
                    (<div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
                        <div>
                            <h2 className="text-2xl font-semibold mb-6">Saved Addresses</h2>
                            <div className="space-y-4">

                                {
                                    addresses.map((address, index) => {
                                        return <div key={index} onClick={(e) => dispatch(setSelectedAddress(index))} className={`relative border ${selectedAddress === index ? "border-pink-400 bg-pink-50" : "border-gray-300"} rounded-lg p-5 cursor-pointer hover:border-pink-400 transition`}>
                                            <button onClick={(e) => dispatch(deleteAddress(index))} className="absolute top-4 right-4 text-sm text-pink-500 hover:text-red-500 cursor-pointer">
                                                Delete
                                            </button>

                                            <h3 className="font-semibold text-gray-800">
                                                {address.fullName}
                                            </h3>

                                            <p className="text-gray-600 mt-1">
                                                +91 {address.phoneNumber}
                                            </p>

                                            <p className="text-gray-600">
                                                {address.email}
                                            </p>

                                            <p className="text-gray-600 mt-1">
                                                {address.address}, {address.city}, {address.state},{address.zipCode},{address.country}
                                            </p>
                                        </div>
                                    })
                                }

                                <button onClick={() => setShowForm(true)} className="w-full border border-gray-300 rounded-lg py-3 font-medium hover:bg-gray-100 transition">
                                    + Add New Address
                                </button>

                                <button type="button" onClick={handlePayment} disabled={selectedAddress === null} className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-lg py-3 font-semibold transition">
                                    Proceed To Checkout
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <div className="w-full max-w-md border rounded-xl shadow-sm p-6">

                                <h2 className="text-xl font-semibold mb-6">
                                    Order Summary
                                </h2>

                                <div className="space-y-4">

                                    <div className="flex justify-between text-gray-700">
                                        <span>Subtotal ({cart.length} item)</span>
                                        <span>₹{subtotal.toLocaleString("en-IN")}</span>
                                    </div>

                                    <div className="flex justify-between text-gray-700">
                                        <span>Shipping</span>
                                        <span>₹{shipping}</span>
                                    </div>

                                    <div className="flex justify-between text-gray-700">
                                        <span>Tax</span>
                                        <span>₹{tax}</span>
                                    </div>

                                    <hr />

                                    <div className="flex justify-between text-2xl font-bold">
                                        <span>Total</span>
                                        <span>₹{total}</span>
                                    </div>

                                    <hr />

                                    <div className="text-sm text-gray-500 space-y-1">
                                        <p>* Free shipping on orders over ₹299</p>
                                        <p>* 30-days return policy</p>
                                        <p>* Secure checkout with SSL encryption</p>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>)
            }
        </div>
    );
};

export default AddressForm;