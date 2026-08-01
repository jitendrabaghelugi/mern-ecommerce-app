import { ShoppingBagIcon, ShoppingCart } from 'lucide-react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/userSlices'



const navbar = () => {
  const accessToken = localStorage.getItem("accessToken");
  const { cart } = useSelector(store => store.products)


  const navigate = useNavigate()
  const dispatch = useDispatch() //send the data into the redux store

  const { user } = useSelector(store => store.user)

  const logoutHandler = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/v1/user/logout", {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (res.data.success) {
        dispatch(setUser(null))
        localStorage.removeItem("accessToken")
        toast.success(res.data.message);
        navigate('/')
      }


    } catch (e) {
      console.log(e)
    }
  }


  return (
    <header className="bg-pink-100 w-full h-16 border-b border-pink-200">
      <nav className="mx-auto max-w-7xl flex justify-between items-center">
        <Link to={'/'}>
          <div className="w-24">
            <img src="/images/logo.png" alt="Logo" className='mix-blend-multiply w-full' />
          </div>
        </Link>
        <div className="flex gap-6">
          <ul className='flex gap-4 text-lg font-semibold '>
            <Link to={'/'}><li>Home</li></Link>
            <Link to={'/product'}><li>Products</li></Link>
            {
              user && <Link to={`/profile/${user._id}`}><li>Hello, {user.firstName}</li></Link>
            }
            {
              user?.role === "admin" && <Link to={'/dashboard/sales'}><li>Dashboard</li></Link>
            }
          </ul>
          <Link to={'/cart'}>
            <div className="relative">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 text-white text-[12px] w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">{cart?.items?.length || 0}</span>
            </div>
          </Link>
          {
            user ? <Button onClick={logoutHandler} className='bg-pink-600 text-white cursor-pointer'>Logout</Button> : <Link to={'/login'}><Button className='bg-blue-400 text-white cursor-pointer'>Login</Button></Link>
          }


        </div>
      </nav>
    </header>
  )
}

export default navbar