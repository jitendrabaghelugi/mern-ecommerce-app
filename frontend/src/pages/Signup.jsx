import React, { useState } from 'react'
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



const Signup = () => {

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log(formData);
        try {
            setLoading(true)
            const res = await axios.post("http://localhost:5000/api/v1/user/register", formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log(res.data);
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/verify");
            }


        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message)
        }
        finally{
            setLoading(false)
        }

    }



    return (
        <div className='flex justify-center items-center min-h-screen bg-pink-100'>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>

                </CardHeader>
                <form onSubmit={submitHandler}>
                    <CardContent>
                        <div className="flex flex-col gap-3">
                            <div className='grid gap-4 grid-cols-2'>
                                <div className="grid gap-2 ">
                                    <Label htmlFor="firstname">First Name</Label>
                                    <Input
                                        id="firstname"
                                        type="text"
                                        name="firstName"
                                        placeholder="Enter Your First Name "
                                        required
                                        value={formData.firstname}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lastname">Last Name</Label>
                                    <Input
                                        id="lastname"
                                        name="lastName"
                                        type="text"
                                        placeholder="Enter Your Last Name"
                                        required
                                        value={formData.lastname}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your Email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>

                                </div>
                                <div className='relative'>
                                    <Input id="password" type={showPassword ? "text" : "password"}
                                        placeholder="Create Your Password"
                                        name="password"
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
                        <Button type="submit" className="w-full">
                            { loading ? <><Loader2/> Please Wait</>:"SignUp"}
                        </Button>
                        <p>Already have an account ? <NavLink to={'/login'}>Login</NavLink></p>

                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

export default Signup