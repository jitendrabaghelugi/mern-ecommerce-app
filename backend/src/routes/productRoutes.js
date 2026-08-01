import express from "express"
const router = express.Router()
import { addProducts, allProducts, updateProduct, deleteProduct } from "../controllers/productControllers.js"
import { isAuthenticated, isAdmin } from "../middlewares/isAuthenticated.js";
import { multipleUpload } from "../middlewares/multer.js";


router.post("/addProducts", isAuthenticated, isAdmin, multipleUpload, addProducts);
router.get("/allProducts", allProducts);
router.put("/updateProduct/:productId", isAuthenticated, isAdmin, multipleUpload, updateProduct);
router.delete("/deleteProduct/:productId", isAuthenticated, isAdmin, deleteProduct);



export default router;