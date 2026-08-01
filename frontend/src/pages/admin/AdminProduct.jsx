import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input'
import { Search, SquarePen, Trash2 } from 'lucide-react'
import { Label } from "@/components/ui/label"
import React, { useEffect, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/redux/productSlices'
import UploadImage from '@/components/UploadImage'
import { toast } from 'sonner'



const AdminProduct = () => {

  const { products } = useSelector((store) => store.products)
  console.log(products)

  const API_URL = "http://localhost:5000/api/v1/product"
  const accessToken = localStorage.getItem("accessToken")
  const [search, setSearch] = useState("")
  const [sortOrder, setSortOrder] = useState("")
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch()

  const [editProduct, setEditProduct] = useState({
    _id: "",
    productName: "",
    productDesc: "",
    productPrice: 0,
    category: "",
    brand: "",
    productImg: []
  })


  const getAllProduct = async () => {
    try {
      const res = await axios.get(`${API_URL}/allProducts`);
      if (res.data.success) {
        dispatch(setProducts(res.data.allProduct))
      }

    } catch (err) {
      console.log(err?.response.data)
    }
  }

  useEffect(() => {
    getAllProduct()
  }, [])



  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }))
  }

  const updateProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData()
    formData.append("productName", editProduct.productName)
    formData.append("productDesc", editProduct.productDesc)
    formData.append("productPrice", editProduct.productPrice)
    formData.append("category", editProduct.category)
    formData.append("brand", editProduct.brand)

    const existingImages = editProduct.productImg
      .filter((img) => !(img instanceof File) && img.public_id)
      .map((img) => img.public_id);

    formData.append("existingImages", JSON.stringify(existingImages));

    editProduct.productImg
      .filter((img => img instanceof File))
      .forEach((file) => {
        formData.append("productImg", file)
      })


    try {
      const res = await axios.put(`${API_URL}/updateProduct/${editProduct._id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        toast.success("Your Product is successfully update")
        const updateProducts = products.map((p) =>
          p._id === editProduct._id ? res.data.updatedProduct : p)
        dispatch(setProducts(updateProducts))
        setOpen(false);
      }

    } catch (err) {
      console.log(err?.response.data)
    }

  }

  const removeProduct = async (productId) => {
    try {

      const remainingProducts = products.filter((product) => product._id !== productId)
      const res = await axios.delete(`${API_URL}/deleteProduct/${productId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setProducts(remainingProducts))

      }

    } catch (err) {
      console.log(err?.response.data)
    }

  }

  const searchFilter =products.filter((product) =>
      product?.productName?.toLowerCase().includes(search.toLowerCase()) ||
      product?.brand?.toLowerCase().includes(search.toLowerCase()) ||
      product?.category?.toLowerCase().includes(search.toLowerCase())
    );


  const sortFilter = [...searchFilter]

  if (sortOrder === "HighToLow") {
    sortFilter.sort((a, b) => Number(b.productPrice) - Number(a.productPrice))
  }
  else if (sortOrder === "LowToHigh") {
    sortFilter.sort((a, b) => Number(a.productPrice) - Number(b.productPrice))
  }



  return (
    <div className="py-6 px-15 bg-gray-100 min-h-[calc(100vh-64px)]">
      <div className="flex justify-between">
        <div className="relative w-90">
          <Input className="bg-white" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Product..." /><Search className="absolute right-3 top-1 text-gray-500 rounded" />
        </div>
        <div className="">
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="border min-w-50 border-gray-200 rounded-md px-4 py-2 text-sm text-gray-600 bg-white focus:outline-none cursor-pointer hover:border-gray-300">
            <option value="">Sort by Price</option>
            <option value="LowToHigh">Low to High</option>
            <option value="HighToLow">High to Low</option>
          </select>
        </div>
      </div>

      {
        sortFilter.map((product, index) => {
          return <div key={index} className="mt-4">
            <Card className="w-full h-35 bg-white flex flex-row p-4 pt-4">
              <div className=" w-full flex items-center justify-between">
                <div className="flex gap-5 h-30 items-center">
                  <img src={product?.productImg?.[0].url} alt="" className="w-25 h-25 object-cover rounded border" />
                  <h1 className="font-semibold text-lg w-98 leading-6 text-gray-800 line-clamp-4">{product?.productName}</h1>
                </div>
                <div className="min-w-30 text-center">
                  <p className="font-semibold text-lg">₹{product?.productPrice}</p>
                </div>
                <div className="flex items-center gap-3 scroll-auto">
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <SquarePen onClick={() => { setEditProduct(product); }} size={25} className="text-green-500 hover:scale-125 transition-transform duration-300 cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto scrollbar-hide">

                      <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                        <DialogDescription>
                          Make changes to your Product here. Click save when you&apos;re
                          done.
                        </DialogDescription>

                      </DialogHeader>
                      <div className="flex flex-col gap-2">
                        <div className="grid gap-2 ">
                          <Label >Product Name</Label>
                          <Input onChange={handleChange} name="productName" value={editProduct?.productName} required />
                        </div>
                        <div className="grid gap-2 ">
                          <Label >Price</Label>
                          <Input onChange={handleChange} name="productPrice" value={editProduct?.productPrice} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label >Brand</Label>
                            <Input onChange={handleChange} name="brand" value={editProduct?.brand} required />
                          </div>
                          <div className="grid gap-2">
                            <Label >Category</Label>
                            <Input onChange={handleChange} name="category" value={editProduct?.category} required />
                          </div>

                        </div>
                        <div className="grid gap-2">
                          <div className="flex items-center">
                            <Label >Description</Label>
                          </div>
                          <Textarea className="h-32 resize-none overflow-y-scroll" onChange={handleChange} name="productDesc" value={editProduct?.productDesc} placeholder="Enter the brief description of the product" required />
                          <UploadImage productData={editProduct} setProductData={setEditProduct} />

                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={updateProduct} type="submit">Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Trash2 className="text-red-500 cursor-pointer hover:scale-110 transition" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          account from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => removeProduct(product._id)} >Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          </div>
        })
      }

    </div>
  )
}

export default AdminProduct