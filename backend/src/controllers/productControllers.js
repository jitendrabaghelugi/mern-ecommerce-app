import Product from "../models/productModels.js";
import { dataUri } from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";


export const addProducts = async (req, res) => {

    try {
        const { productName, productDesc, productPrice, category, brand } = req.body
        const userId = req.id;

        if (!productName || !productDesc || !productPrice || !category || !brand) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        let productImgs = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const data = dataUri(file);
                const result = await cloudinary.uploader.upload(data, {
                    folder: 'Product'
                });
                productImgs.push({
                    url: result.secure_url,
                    public_id: result.public_id
                })
            }
        }

        const addProduct = await Product.create({
            userId,
            productName,
            productDesc,
            productPrice,
            category,
            brand,
            productImg: productImgs,
        })

        return res.status(201).json({
            success: true,
            message: "Product Added Successfully",
            addProduct
        })

    } catch (e) {

        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

export const allProducts = async (_, res) => {
    try {
        const allProduct = await Product.find();

        if (!allProduct) {
            return res.status(404).json({
                success: false,
                message: "No Product Found",
                product: []
            })
        }

        return res.status(200).json({
            success: true,
            allProduct
        });

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const { productName, productDesc, productPrice, category, brand, existingImages } = req.body

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            });
        }

        let updatedImages = [];

        if (existingImages) {
            const keepIds = JSON.parse(existingImages);

            updatedImages = product.productImg.filter((img) =>
                keepIds.includes(img.public_id)
            );
            const removeImages = product.productImg.filter((img) =>
                !keepIds.includes(img.public_id)
            );

            for (const img of removeImages) {
                await cloudinary.uploader.destroy(img.public_id);
            }
        } else {
            updatedImages = product.productImg
        }


        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const data = dataUri(file);
                const result = await cloudinary.uploader.upload(data, {
                    folder: 'Product'
                })
                updatedImages.push({
                    url: result.secure_url,
                    public_id: result.public_id
                })
            }
        }

        product.productName = productName || product.productName;
        product.productDesc = productDesc || product.productDesc;
        product.productPrice = productPrice || product.productPrice;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.productImg = updatedImages;

        const updatedProduct = await product.save();

        return res.status(200).json({
            success: true,
            message: "Product Updated Successfully",
            updatedProduct
        });

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        });
    }


}

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            })
        }

        if (product.productImg && product.productImg.length > 0) {
            for (const img of product.productImg) {
                await cloudinary.uploader.destroy(img.public_id);
            }
        }

        await Product.findByIdAndDelete(productId);

        return res.status(200).json({
            success: true,
            message: "Product Deleted Successfully"
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
}