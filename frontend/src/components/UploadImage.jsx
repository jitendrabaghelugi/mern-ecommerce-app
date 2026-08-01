import React from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { X } from 'lucide-react'

const UploadImage = ({ productData, setProductData }) => {

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        setProductData((prev) => ({
            ...prev,
            productImg: [...prev.productImg, ...files]
        }))
    }

    const removeImage = (index) => {
        setProductData((prev) => ({
            ...prev,
            productImg: prev.productImg.filter((_, i) => i !== index)
        }))
    }

    return (
        <div className="grid gap-2">
            <Label>Product Image</Label>
            <Input onChange={handleImageChange} type="file" id="file-upload" accept="image/*" className="hidden" multiple />
            <Button variant="outline">
                <label htmlFor="file-upload" className="cursor-pointer">Upload Images</label>
            </Button>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mt-5">
                {
                    productData?.productImg?.map((image, index) => {
                        return <Card key={index} className="relative group overflow-hidden">
                            <CardContent >
                                <img src={image.url ? image.url : URL.createObjectURL(image)} alt="" width={200} height={200} className="w-full h-24 object-cover rounded-md transition" />
                                <button onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition rounded-full cursor-pointer">
                                    <X size={13} />
                                </button>
                            </CardContent>
                        </Card>
                    })
                }

            </div>

        </div>
    )
}

export default UploadImage