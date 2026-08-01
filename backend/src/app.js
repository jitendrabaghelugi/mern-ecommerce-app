import express from 'express'
const app = express();
import cors from 'cors'
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js'
import orderRouter from './routes/orderRoutes.js'


app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://mern-ecommerce-app-sepia.vercel.app",
    ],
    credentials: true
}))

app.use(express.json())
app.use("/api/v1/user", userRouter)
app.use("/api/v1/product", productRouter)
app.use("/api/v1/cart", cartRouter)
app.use("/api/v1/order", orderRouter)

app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello" })
})

export default app