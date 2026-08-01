import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { setUser } from '@/redux/userSlices'
import MyOrder from './MyOrder'





const Profile = () => {

    const { user } = useSelector(store => store.user)
    const param = useParams();
    const userId = param.userId;
    const accessToken = localStorage.getItem("accessToken");

    const [updateUser, setUpdateUser] = useState({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phoneNo: user?.phoneNo,
        address: user?.address,
        city: user?.city,
        profilePic: user?.profilePic,
        zipCode: user?.zipCode
    })

    const [file, setFile] = useState(null)
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setUpdateUser((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const fileChange = (e) => {
        const selectFile = e.target.files[0]
        setFile(selectFile)
        setUpdateUser((prev) => ({ ...prev, profilePic: URL.createObjectURL(selectFile) }))
    }


    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {

            const formData = new FormData();
            formData.append("firstName", updateUser.firstName);
            formData.append("lastName", updateUser.lastName);
            formData.append("email", updateUser.email);
            formData.append("phoneNo", updateUser.phoneNo);
            formData.append("address", updateUser.address);
            formData.append("city", updateUser.city);
            formData.append("zipCode", updateUser.zipCode);

            if (file) {
                formData.append("profilePic", file);
            }

            const response = await axios.put(`http://localhost:5000/api/v1/user/updateUser/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data"
                }
            })

            if (response.data.success) {
                toast.success(response.data.message)
                dispatch(setUser(response.data.user));
            }

        } catch (e) {
            console.log(e)
            toast.error("Failed to update the profile")
        }

    }


    return (
        <div className="min-h-screen pt-5 bg-gray-100">
            <Tabs defaultValue="profile" className="max-w-7xl mx-auto items-center">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <div className="">
                        <h1 className='text-2xl font-bold text-center'>Update Profile</h1>
                        <div className="max-w-2xl flex gap-10 justify-start mt-8">
                            <div className="flex justify-start flex-col items-center">
                                <img src={updateUser.profilePic || "/images/userLogo.png"} alt="profile_pic" className="w-32 h-32 rounded-full object-cover border-4 border-pink-800" />
                                <div className="flex justify-center items-center">
                                    <Label className="mt-4 bg-pink-600 text-white px-4 py-2  text-center rounded-lg hover:bg-pink-800 cursor-pointer" >Change Picture
                                        <Input type="file" accept="image/*" className="hidden" onChange={fileChange} />
                                    </Label>

                                </div>
                            </div>
                            <form onSubmit={onSubmitHandler} className="space-y-4 max-w-5xl bg-white shadow-lg rounded-lg">
                                <div className="grid grid-cols-2 p-5 gap-4">
                                    <div >
                                        <Label className="mb-1 block text-sm font-medium">First Name</Label>
                                        <Input type="text" name="firstName" value={updateUser.firstName} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1" placeholder="John" />
                                    </div>
                                    <div >
                                        <Label className="mb-1 block text-sm font-medium">Last Name</Label>
                                        <Input type="text" name="lastName" value={updateUser.lastName} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1" placeholder="Doe" />
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="mb-1 block text-sm font-medium">Email</Label>
                                        <Input type="text" name="email" value={updateUser.email} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1" placeholder="Example@gmail.com" />
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="mb-1 block text-sm font-medium">Phone Number</Label>
                                        <Input type="text" name="phoneNo" value={updateUser.phoneNo} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1" placeholder="Enter your Phone number" />
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="mb-1 block text-sm font-medium">Address</Label>
                                        <Input type="text" name="address" value={updateUser.address} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1" placeholder="Enter your Address" />
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="mb-1 block text-sm font-medium">City</Label>
                                        <Input type="text" name="city" value={updateUser.city} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1" placeholder="Enter your city name" />
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="mb-1 block text-sm font-medium">Zip Code</Label>
                                        <Input type="text" name="zipCode" value={updateUser.zipCode} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1" placeholder="Enter your zip code" />
                                    </div>
                                    <Button type="submit" className="col-span-2 mt-2 bg-pink-600 hover:bg-pink-800 cursor-pointer">Update Profile</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="orders">
                    <div className="max-w-3xl">
                    <MyOrder />

                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Profile