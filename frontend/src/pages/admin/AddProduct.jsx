import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import UploadImage from '@/components/UploadImage'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setProducts } from '@/redux/productSlices'

const AdminSales = () => {

  const [productData, setProductData] = useState({
    productName: "",
    productDesc: "",
    productPrice: 0,
    category: "",
    brand: "",
    productImg: []
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setProductData((prev) => ({ ...prev, [name]: value }))
  }

  const [loading, setLoading] = useState(false)
  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch()

  const onSubmitHandler = async () => {

    const formData = new FormData()
    formData.append("productName", productData.productName)
    formData.append("productDesc", productData.productDesc)
    formData.append("productPrice", productData.productPrice)
    formData.append("category", productData.category)
    formData.append("brand", productData.brand)

    if (productData.productImg.length === 0) {
      toast.error("Please Select Atleast One Image")
      return;
    }

    productData.productImg.forEach((file) => {
      formData.append("productImg", file)
    })

    try {
      setLoading(true)

      const res = await axios.post("http://localhost:5000/api/v1/product/addProducts", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (res.data.success) {
        toast.success("Your Product is added successfully")
        dispatch(setProducts(res.data.addProduct))

        setProductData({
          productName: "",
          productDesc: "",
          productPrice: 0,
          category: "",
          brand: "",
          productImg: []
        })
      }

    } catch (err) {
      console.log(err.response?.data)
    }

    finally {
      setLoading(false)
    }
  }


  return (
    <div className="py-6 px-15 bg-gray-100 min-h-[calc(100vh-64px)]">
      <Card className="w-full my-10">
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
          <CardDescription>
            Enter Product details below
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label>Product Name</Label>
              <Input
                type="text"
                name="productName"
                placeholder="Ex-Iphone"
                value={productData.productName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Price</Label>
              <Input
                type="number"
                name="productPrice"
                value={productData.productPrice}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Brand</Label>
                <Input
                  type="text"
                  name="brand"
                  placeholder="Ex-Apple"
                  value={productData.brand}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Category</Label>
                <Input
                  type="text"
                  name="category"
                  placeholder="Ex-Mobile"
                  value={productData.category}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                name="productDesc"
                placeholder="Enter brief description of product"
                value={productData.productDesc}
                onChange={handleChange}
                rows={5}
              />
            </div>

            <UploadImage productData={productData} setProductData={setProductData} />

          </div>
        </CardContent>

        <CardFooter>
          <Button onClick={onSubmitHandler}
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 cursor-pointer"
          >
            {loading ? <> <Loader2 className="animate-spin mr-2" />Loading...</> : "Add Product"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default AdminSales