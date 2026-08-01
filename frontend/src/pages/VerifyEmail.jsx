import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner';

const VerifyEmail =  () => {

    const { token } = useParams();
    const [verifyStatus ,setVerifyStatus]= useState("Verifying...")
    const navigate = useNavigate()

    const VerifyEmail= async()=>{
        try {
            const res = await axios.post("http://localhost:5000/api/v1/user/verify",{},{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            if (res.data.success) {
                setVerifyStatus("You have Verified successfully");
                setTimeout(()=>{
                    navigate("/login");
                },2000)
            }
    
        } catch (e) {
            console.log(e.data)
        }
    }


    useEffect(()=>{
        VerifyEmail()
    },[token])



    return (
        <div className="relative w-full bg-pink-100 overflow-hidden">
            <div className="min-h-screen flex justify-center items-center">
                <div className="bg-white p-6 rounded-2xl shadow-md text-center w-[90%] max-w-md">
                    <h2 className="text-xl font-semibold text-gray-800">{verifyStatus}</h2>
                </div>
            </div>
        </div>
    )
}

export default VerifyEmail