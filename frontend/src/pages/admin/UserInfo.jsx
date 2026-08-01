import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { setUser } from '@/redux/userSlices'
import axios from 'axios'
import { ArrowLeft, Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const UserInfo = () => {

  const navigate = useNavigate()
  const param = useParams()
  const userId = param.userId
  const accessToken = localStorage.getItem("accessToken")
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    profilePic: "",
    zipCode: "",
    role: ""
  });


  const getUserData = async (userId) => {
    try {
      const res = await axios.get(`https://mern-ecommerce-app-n6us.onrender.com/api/v1/user/getUserById/${userId}`)
      if (res.data.success) {
        setUserData(res.data.userData)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getUserData(userId)
  }, [])


  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData((prev) => ({
      ...prev, [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const getFile = e.target.files[0]
    setFile(getFile)
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("firstName", userData.firstName)
    formData.append("lastName", userData.lastName)
    formData.append("email", userData.email)
    formData.append("phoneNo", userData.phoneNo)
    formData.append("address", userData.address)
    formData.append("city", userData.city)
    formData.append("zipCode", userData.zipCode)
    formData.append("role", userData.role)

    if (file) {
      formData.append("profilePic", file)
    }

    try {
      setLoading(true)

      const res = await axios.put(`https://mern-ecommerce-app-n6us.onrender.com/api/v1/user/updateUser/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (res.data.success) {
        toast.success("You have Updated the Profile")
        setUserData(res.data.user)
      }

    } catch (err) {
      console.log(err)
    }
    finally {
      setLoading(false)
    }

  }


  return (
    <div className="">
      <div className="flex items-center justify-center gap-10 mt-10">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-gray-900 text-white rounded-lg hover:bg-black transition cursor-pointer" >
          <ArrowLeft size={18} />
        </button>
        <h1 className='text-2xl font-bold text-center'>Update Profile</h1>
      </div>
      <div className="max-w-2xl flex gap-10 justify-start mt-8 mx-auto">
        <div className="flex justify-start flex-col items-center">
          <img src={userData?.profilePic || "/images/userLogo.png"} alt="profile_pic" className="w-32 h-32 rounded-full object-cover border-4 border-pink-800" />
          <div className="flex justify-center items-center">
            <Label className="mt-4 bg-pink-600 text-white px-4 py-2  text-center rounded-lg hover:bg-pink-800 cursor-pointer" >Change Picture
              <Input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </Label>

          </div>
        </div>
        <form className="space-y-4 max-w-5xl bg-white shadow-lg rounded-lg">
          <div className="grid grid-cols-2 p-5 gap-4">
            <div >
              <Label className="mb-1 block text-sm font-medium">First Name</Label>
              <Input type="text" name="firstName" value={userData?.firstName} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1" placeholder="John" />
            </div>
            <div >
              <Label className="mb-1 block text-sm font-medium">Last Name</Label>
              <Input type="text" name="lastName" value={userData?.lastName} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1" placeholder="Doe" />
            </div>
            <div className="col-span-2">
              <Label className="mb-1 block text-sm font-medium">Email</Label>
              <Input type="text" name="email" value={userData?.email} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1" placeholder="Example@gmail.com" />
            </div>
            <div className="col-span-2">
              <Label className="mb-1 block text-sm font-medium">Phone Number</Label>
              <Input type="text" name="phoneNo" value={userData?.phoneNo} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1" placeholder="Enter your Phone number" />
            </div>
            <div className="col-span-2">
              <Label className="mb-1 block text-sm font-medium">Address</Label>
              <Input type="text" name="address" value={userData?.address} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1" placeholder="Enter your Address" />
            </div>
            <div className="col-span-1">
              <Label className="mb-1 block text-sm font-medium">City</Label>
              <Input type="text" name="city" value={userData?.city} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1" placeholder="Enter your city name" />
            </div>
            <div className="col-span-1">
              <Label className="mb-1 block text-sm font-medium">Zip Code</Label>
              <Input type="text" name="zipCode" value={userData?.zipCode} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1" placeholder="Enter your zip code" />
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <Label className="block text-sm font-medium">Role :</Label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="role" onChange={handleChange} checked={userData?.role === "admin"} value="admin" className="w-4 h-4 accent-pink-600" />
                  <span className="text-sm">Admin</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="role" onChange={handleChange} checked={userData?.role === "user"} value="user" className="w-4 h-4 accent-pink-600" />
                  <span className="text-sm">User</span>
                </label>
              </div>
            </div>

            <Button onClick={onSubmitHandler} type="submit" className="col-span-2 mt-2 bg-pink-600 hover:bg-pink-800 cursor-pointer">{loading ? <><Loader2 className="animate-spin mr-2" />Loading...</> : "Update Profile"}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserInfo