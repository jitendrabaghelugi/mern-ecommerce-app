import jwt from 'jsonwebtoken'
import { User } from '../models/userModels.js'


export const isAuthenticated = async (req, res, next) => {

    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({
                success: false,
                message: "Token Is missing or invalid"
            });
        }

        const token = authHeader.split(" ")[1];
        try {
            const decode = jwt.verify(token, process.env.SECRET_KEY)
            const user = await User.findById(decode.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User Not Found"
                });
            }
            req.user = user;
            req.id = user._id;
            next();

        } catch (e) {
            if (e.name === "TokenExpiredError") {
                return res.status(400).json({
                    success: false,
                    message: "The token is expired"
                });
            }
            return res.status(400).json({
                success: false,
                message: "Token is missing or expired"
            });
        }


    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

export const isAdmin = async (req, res, next) => {
    try {

        if(req.user && req.user.role === 'admin'){
            return next();
        }
        return res.status(403).json({
            success:false,
            message:"Access Denied"
        });

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        });
    }

}

