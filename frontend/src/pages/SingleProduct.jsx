import BreadCrum from '@/components/BreadCrum'
import ProductDesc from '@/components/ProductDesc'
import ProductImg from '@/components/ProductImg'
import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const SingleProduct = () => {
    const param = useParams()
    const productId = param.id

    const { products } = useSelector((store) => store.products)

    const productInfo = products.find((item) => item._id === productId)
    console.log(productInfo)

    return (

        <div className="pt-4 pb-10 mx-auto max-w-7xl ">
            <BreadCrum productInfo={productInfo} />
            <div className=" mt-10 grid grid-cols-2 items-start gap-8">
                <ProductImg productInfo={productInfo} />
                <ProductDesc productInfo={productInfo} />

            </div>
        </div>
    )
}

export default SingleProduct