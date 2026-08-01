import { createTestAccount } from 'nodemailer';
import Cart from '../models/cartModels.js';
import Product from '../models/productModels.js';

export const getCart = async (req, res) => {
    const userId = req.id; // Assuming userId is available in req.id after authentication middleware
    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ success: false, cart: [] });
        }
        return res.status(200).json({ success: true, cart });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const addToCart = async (req, res) => {
    try {
        const userId = req.id;
        const { productId } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            const newCart = new Cart({
                userId,
                items: [{ productId, quantity: 1, price: product.productPrice }],

            });

            newCart.totalPrice = newCart.items.reduce((acc, item) => {
                return acc + item.price * item.quantity;
            }, 0);
            
            await newCart.save();

            const populatedCart = await Cart.findById(newCart._id).populate("items.productId");

            return res.status(201).json({ success: true, cart: populatedCart });

        } else {
            const existingItem = cart.items.find(item => item.productId.equals(productId));

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.items.push({ productId, quantity: 1, price: product.productPrice });
            }

            cart.totalPrice = cart.items.reduce(
                (acc, item) => acc + (item.price * item.quantity), 0
            );

            await cart.save();

            const populateCart = await Cart.findById(cart._id).populate("items.productId");

            return res.status(200).json({
                success: true,
                message: "Product Added Successfully",
                cart: populateCart
            });
        }

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

}

export const updateQuantity = async (req, res) => {

    try {

        const userId  = req.id;
        const { productId, type } = req.body;

        const cart = await Cart.findOne({userId})
        if (!cart) { return res.status(404).json({ success: false, message: "User cart not found " }) }

        const item = cart.items.find(item => item.productId.toString() === productId)
        if (!item) { return res.status(404).json({ success: false, message: "item not found " }) }

        if (type == "increase") item.quantity += 1
        if (type == "decrease" && item.quantity > 1) item.quantity -= 1

        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)

        await cart.save();

        await cart.populate("items.productId")

        return res.status(200).json({ success: true, cart });

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

export const removeFromCart = async (req, res) => {

    try {
        const  userId  = req.id
        const { productId } = req.body

        const cart = await Cart.findOne({userId})
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" })
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId)
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)

        await cart.save()

        await cart.populate("items.productId");

        return res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error
        })
    }

}
