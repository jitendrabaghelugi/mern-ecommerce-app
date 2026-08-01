import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Verify from './pages/Verify'
import VerifyEmail from './pages/VerifyEmail'
import Footer from './components/Footer'
import Profile from './pages/Profile'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Dashboard from './pages/Dashboard'
import AdminSales from './pages/admin/AdminSales'
import AddProduct from './pages/admin/AddProduct'
import AdminProduct from './pages/admin/AdminProduct'
import AdminOrders from './pages/admin/AdminOrders'
import ShowUserOrders from './pages/admin/ShowUserOrders'
import AdminUsers from './pages/admin/AdminUsers'
import UserInfo from './pages/admin/UserInfo'
import ProductRoutes from './components/ProductRoutes'
import SingleProduct from './pages/SingleProduct'
import AddressForm from './pages/AddressForm'
import OrderSuccess from './pages/OrderSuccess'


const App = () => {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <><Navbar /><Home /><Footer /></>
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/signup",
      element: <Signup />
    },
    {
      path: "/verify",
      element: <Verify />
    },
    {
      path: "/verify/:token",
      element: <VerifyEmail />
    },
    {
      path: "/profile/:userId",
      element: <ProductRoutes> <Navbar /><Profile /></ProductRoutes>
    },
    {
      path: "/product",
      element: <><Navbar /><Product /></>
    },
    {
      path: "/product/:id",
      element: <><Navbar /><SingleProduct /></>
    },
    {
      path: "/cart",
      element: <ProductRoutes><Navbar /><Cart /></ProductRoutes>
    },
    {
      path: "/address",
      element: <ProductRoutes><AddressForm /></ProductRoutes>
    },
    {
      path: "/order-success",
      element: <ProductRoutes><OrderSuccess /></ProductRoutes>
    },
    {
      path: "/dashboard",
      element: <ProductRoutes isAdmin={true}><Navbar /><Dashboard /></ProductRoutes>,
      children: [
        {
          path: "sales",
          element: <AdminSales />
        },
        {
          path: "add-product",
          element: <AddProduct />
        },
        {
          path: "products",
          element: <AdminProduct />
        },
        {
          path: "orders",
          element: <AdminOrders />
        },
        {
          path: "users/orders/:userId",
          element: <ShowUserOrders />
        },
        {
          path: "users",
          element: <AdminUsers />
        },
        {
          path: "users/:userId",
          element: <UserInfo />
        }
      ]
    }


  ]);

  return (
    <>
      <RouterProvider router={router}>

      </RouterProvider>
    </>
  )
}

export default App;