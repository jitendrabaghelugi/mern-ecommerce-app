import express from 'express'
const router = express.Router();
import { register, verify, reVerify, login, logout, forgetPassword, verifyOtp, changePassword, allUser ,getUserById,updateUser } from '../controllers/userControllers.js';
import { isAuthenticated, isAdmin } from '../middlewares/isAuthenticated.js'
import { singleUpload } from '../middlewares/multer.js';


router.post("/register", register);
router.post("/verify", verify);
router.post("/reVerify", reVerify);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyOtp/:email", verifyOtp);
router.post("/changePassword/:email", changePassword);
router.get("/allUser", isAuthenticated, isAdmin, allUser);
router.get("/getUserById/:userId", getUserById);
router.put("/updateUser/:userId",isAuthenticated,singleUpload ,updateUser)

export default router;