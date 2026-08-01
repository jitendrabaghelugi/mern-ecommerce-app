import express from "express"
const router = express.Router()
import { getCart, addToCart, updateQuantity, removeFromCart } from "../controllers/cartControllers.js"
import { isAuthenticated } from "../middlewares/isAuthenticated.js"


router.get("/", isAuthenticated,getCart)
router.post("/add", isAuthenticated, addToCart)
router.put("/update", isAuthenticated, updateQuantity)
router.delete("/remove", isAuthenticated, removeFromCart)



export default router