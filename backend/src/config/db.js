import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL

 const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("Database is connected sucessfully")
    } catch (e) {
        console.log("The error is ", e.message);
        process.exit(1)
    }

}
export default connectDB;



