import React, { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import "react-medium-image-zoom/dist/styles.css";

const ProductImg = ({ productInfo }) => {

    const firstImg = productInfo.productImg[0].url

    const [avtarImg, setAvtarImg] = useState(firstImg)
    return (
        <div className="flex gap-5">
            <div className="flex gap-5 flex-col">
                
                {
                    productInfo.productImg.map((img) => {
                        return < img key={img._id} src={img.url} alt="" onClick={() => setAvtarImg(img.url)} className="cursor-pointer w-20 h-20 border shadow-lg" />
                    })
                }
                

            </div>
            <Zoom>

            <img src={avtarImg} alt="" className="w-125 border shadow-lg" />
            </Zoom>
        </div>
    )
}

export default ProductImg