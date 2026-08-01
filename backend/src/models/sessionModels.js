import mongoose, { Types } from "mongoose";

const SessionModel = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

export const Session = mongoose.model("Session", SessionModel);