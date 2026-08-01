import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModels.js'
import { verifyEmail } from '../utils/sendEmail.js';
import { sendOtp } from '../utils/sendOtp.js'
import { Session } from '../models/sessionModels.js';
import cloudinary from '../utils/cloudinary.js';

export const register = async (req, res) => {

    try {

        const { firstName, lastName, email, password } = req.body

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "User Already Exist"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const createUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashPassword
        });

        const token = jwt.sign({ id: createUser._id }, process.env.SECRET_KEY, { expiresIn: '5m' });
        verifyEmail(email, token);

        createUser.token = token;

        await createUser.save()
        return res.status(201).json({
            success: true,
            message: "User account created successfully",
            userData: createUser
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }

}
export const verify = async (req, res) => {
    try {

        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Token is missing or invalid"
            });
        }

        const token = authHeader.split(" ")[1];

        try {
            const decode = jwt.verify(token, process.env.SECRET_KEY);

            const getUser = await User.findById(decode.id);

            if (!getUser) {
                return res.status(404).json({
                    success: false,
                    message: "User Not Found"
                });
            }

            if (getUser.isVerified === true) {
                return res.status(400).json({
                    success: false,
                    message: "User is already verified"
                });
            }

            getUser.token = null;
            getUser.isVerified = true;
            await getUser.save();

            return res.status(200).json({
                success: true,
                message: "User Successfully Verified"
            });


        } catch (error) {
            if (error.name === 'TokenExpiredError') {

                return res.status(400).json({
                    success: false,
                    message: "Your Token is expired"
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message
            })
        }




    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}
export const reVerify = async (req, res) => {

    try {
        const { email } = req.body;
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '5m' });

        verifyEmail(email, token);

        user.token = token;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Verification Email send again into the email"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }

}
export const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const getUser = await User.findOne({ email });

        if (!getUser) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        if (getUser.isVerified === false) {
            return res.status(400).json({
                success: false,
                message: "User is not verified"
            });
        }

        const verifyPassword = await bcrypt.compare(password, getUser.password);

        if (!verifyPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const accessToken = jwt.sign({ id: getUser._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
        const refreshToken = jwt.sign({ id: getUser._id }, process.env.SECRET_KEY, { expiresIn: '30d' });

        getUser.isLoggedIn = true;
        await getUser.save();


        //delete the existing session
        const existingSession = await Session.findOne({ userId: getUser._id });
        if (existingSession) {
            await existingSession.deleteOne({ userId: getUser._id });
        }

        const session = await Session.create({ userId: getUser._id });
        return res.status(201).json({
            success: true,
            message: `Welcome back ${getUser.firstName}`,
            user: getUser,
            accessToken: accessToken,
            refreshToken: refreshToken
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export const logout = async (req, res) => {
    try {
        await Session.deleteMany({ userId: req.id });
        await User.findByIdAndUpdate(req.id, { isLoggedIn: false });

        return res.status(200).json({
            success: true,
            message: "You have logged out sucessfully"
        });

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
}
export const forgetPassword = async (req, res) => {

    try {
        const { email } = req.body;
        const getUser = await User.findOne({ email });

        if (!getUser) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        const otp = Math.floor(100000 + Math.random() * 90000);
        const otpExpiry = Date.now() + 10 * 60 * 1000;

        await sendOtp(email, otp);

        getUser.otp = otp;
        getUser.otpExpiry = otpExpiry;

        await getUser.save();

        return res.status(200).json({
            success: true,
            message: "The otp is send to you email sucessfully"
        });


    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        });
    }

}
export const verifyOtp = async (req, res) => {
    try {

        const { otp } = req.body;
        const email = req.params.email;

        const getUser = await User.findOne({ email });

        if (!getUser) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        if (getUser.otpExpiry < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Otp is expired"
            });
        }

        if (getUser.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Otp is invalid"
            });
        }

        getUser.otp = null
        getUser.otpExpiry = null

        await getUser.save();

        return res.status(200).json({
            success: true,
            message: "Your opt is verified Successfully"
        });

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
}
export const changePassword = async (req, res) => {

    try {
        const { newPassword, confirmPassword } = req.body;
        const email = req.params.email;

        const getUser = await User.findOne({ email })

        if (!getUser) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Your Password is not match"
            });
        }

        const checkSamePass = await bcrypt.compare(newPassword, getUser.password);
        if (checkSamePass) {
            return res.status(400).json({
                success: false,
                message: "New password cannot be same as old password"
            });
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);
        getUser.password = hashPassword;

        await getUser.save();

        return res.status(200).json({
            success: true,
            message: "Your Passward is changed successfully"
        });

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
}
export const allUser = async (_, res) => {
    try {
        const getAllUser = await User.find();
        return res.status(200).json({
            success: true,
            getAllUser
        });

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
}
export const getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select("-password -token -otp -expiryOtp");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        return res.status(200).json({
            success: true,
            userData: user
        });


    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

export const updateUser = async (req, res) => {
    try {

        const userIdToUpdate = req.params.userId;
        const userLogIn = req.user;
        const { firstName, lastName, email, phoneNo, address, city, zipCode, role } = req.body

        if (userLogIn._id.toString() !== userIdToUpdate && userLogIn.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "You are not admin to update the profile"
            });
        }
        const user = await User.findById(userIdToUpdate);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        let profilePicUrl = user.profilePic
        let profilePicPublicId = user.profilePicPublicId

        if (req.file) {
            if (profilePicPublicId) {
                await cloudinary.uploader.destroy(profilePicPublicId);
            }

            const result = await new Promise((resolve, reject) => {
                const steam = cloudinary.uploader.upload_stream(
                    { folder: 'Profile' },
                    (error, result) => {
                        if (error) {
                            reject(error)
                        }
                        resolve(result)
                    }
                );
                steam.end(req.file.buffer);
            });

            profilePicUrl = result.secure_url;
            profilePicPublicId = result.public_id;
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.phoneNo = phoneNo || user.phoneNo;
        user.address = address || user.address;
        user.city = city || user.city;
        user.zipCode = zipCode || user.zipCode;
        user.role = role || user.role;
        user.profilePic = profilePicUrl;
        user.profilePicPublicId = profilePicPublicId;

        const updatedUser = await user.save();

        return res.status(200).json({
            success: true,
            message: "User Profile Updated Successfully",
            user: updatedUser
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}
