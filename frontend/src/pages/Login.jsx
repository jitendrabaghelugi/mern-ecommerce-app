import { React, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { NavLink, useNavigate } from 'react-router-dom'
import { EyeIcon, EyeOff, Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/userSlices'

const Login = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {

      setIsLoading(true)
      const res = await axios.post("https://mern-ecommerce-app-n6us.onrender.com/api/v1/user/login", formData, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log(res.data)

      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setUser(res.data.user))
        localStorage.setItem("accessToken", res.data.accessToken)
        navigate('/')

      }

    } catch (e) {
      toast.error(e.response.data.message)

    }
    finally {
      setIsLoading(false);
    }
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-100">
      <Card className="w-full max-w-sm">
        <form onSubmit={onSubmitHandler}>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>

          </CardHeader>
          <CardContent>

            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter Your Password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />

                  {showPassword ? (<EyeIcon onClick={() => setShowPassword(false)} className='absolute right-3 top-1.5 w-5 h-5 cursor-pointer' />) : (<EyeOff onClick={() => setShowPassword(true)} className='absolute right-3 top-1.5 w-5 h-5 cursor-pointer' />)}
                </div>
              </div>
            </div>

          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full cursor-pointer">
              {isLoading ? <><Loader2 /> Please Wait...</> : "Login"}
            </Button>
            <p>Don't have an account ? <NavLink to={'/signup'}>SignUp</NavLink></p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}



export default Login