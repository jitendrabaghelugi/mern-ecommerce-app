import express from "express"
import { createOrder, verfiyOrder, getMyOrder, getUserOrder, getAllUserOrder, salesData } from "../controllers/orderControllers.js"
import { isAdmin, isAuthenticated } from "../middlewares/isAuthenticated.js";
const router = express()

router.post("/create-order", isAuthenticated, createOrder)
router.post("/verfiy-order", isAuthenticated, verfiyOrder)
router.get("/myOrder", isAuthenticated, getMyOrder)
router.get("/user-order/:userId", isAuthenticated, isAdmin, getUserOrder)
router.get("/allUserOrder", isAuthenticated, isAdmin, getAllUserOrder)
router.get("/salesData", isAuthenticated, isAdmin, salesData)

export default router;