import razorpay from "../config/razorpay.js"
import Cart from "../models/cartModels.js"
import Order from "../models/orderModels.js"
import crypto from "crypto"
import { User } from "../models/userModels.js"
import Product from "../models/productModels.js"

export const createOrder = async (req, res) => {
    try {
        const { products, amount, tax, shipping, currency } = req.body
        const options = {
            amount: Math.round(Number(amount) * 100),
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`
        }

        const razorpayOrder = await razorpay.orders.create(options);

        const newOrder = new Order({
            user: req.user._id,
            products,
            amount,
            tax,
            shipping,
            currency,
            status: "Pending",
            razorpayOrderId: razorpayOrder.id
        })

        await newOrder.save();

        return res.json({
            success: true,
            order: razorpayOrder,
            dbOrder: newOrder
        })

    } catch (err) {
        console.error("Error to create the order :", err)
        return res.status(500).json({
            success: false,
            message: err
        })
    }

}

export const verfiyOrder = async (req, res) => {

    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentFailed } = req.body
        const userId = req.user._id

        if (paymentFailed) {
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "Failed" },
                { returnDocument: "after" }
            )
            return res.status(400).json({
                success: false,
                messsage: "Payment Failed",
                order
            })
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(sign.toString())
            .digest("hex")

        if (expectedSignature === razorpay_signature) {
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "Paid", razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature },
                { returnDocument: "after" }
            )

            await Cart.findOneAndUpdate({ userId }, { $set: { items: [], totalPrice: 0 } })

            return res.status(200).json({
                success: true,
                message: "Payment Successfull",
                order
            })
        }
        else {
            await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "Failed" },
                { returnDocument: "after" }
            )
            return res.json({ success: false, message: "Invalid Signature" })
        }

    } catch (error) {
        console.log("Error in verfiy Payment :", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

export const getMyOrder = async (req, res) => {

    try {
        const userId = req.id

        const getOrder = await Order.find({ user: userId })
            .populate({ path: "products.productId", select: "productName productPrice productImg" })
            .populate("user", "firstName lastName email");


        return res.status(200).json({
            success: true,
            count: getOrder.length,
            getOrder
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err
        });
    }

}

//AdminOnly
export const getUserOrder = async (req, res) => {
    try {
        const { userId } = req.params;

        const getOrder = await Order.find({ user: userId })
            .populate({ path: "products.productId", select: "productName productPrice productImg" })
            .populate("user", "firstName lastName email")

        return res.status(200).json({
            success: true,
            count: getOrder.length,
            getOrder
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        });
    }
}

export const getAllUserOrder = async (req, res) => {
    try {
        const allUserOrder = await Order.find()
            .sort({ createdAt: -1 })
            .populate("user", "name email")
            .populate("products.productId", "productName productPrice")

        return res.status(200).json({
            success: true,
            count: allUserOrder.length,
            orders: allUserOrder
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const salesData = async (req, res) => {

    try {

        const totalUsers = await User.countDocuments()
        const totalProducts = await Product.countDocuments()
        const totalOrder = await Order.countDocuments({ status: "Paid" })


        const totalSalesAgg = await Order.aggregate([
            { $match: { status: "Paid" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ])

        const TotalSales = totalSalesAgg[0]?.total || 0;

        //30 days sales

        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const salesByDate = await Order.aggregate([
            { $match: { status: "Paid", createdAt: { $gte: thirtyDaysAgo } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, amount: { $sum: "$amount" } } },
            { $sort: { _id: -1 } }
        ])


        const formattedSales = salesByDate.map((item) => ({
            date: item._id,
            amount: item.amount
        }))

        return res.status(200).json({
            success: true,
            totalUsers,
            totalProducts,
            totalOrder,
            TotalSales,
            formattedSales
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}