import mongoose from "mongoose";

const teamNotificationSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        required: true,
    },
    createdFor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    read:{
        type: Boolean,
        default: false,
    }
},
    { timestamps: true }
);