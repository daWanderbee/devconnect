import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        requires: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^([\w.-]+@([\w-]+\.)+[\w-]{2,4})?$/,
            "Please enter a valid email",
        ],
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
    }],
    profileImg: {
        type: String,
        default: "",
    },
    coverImg: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    link: {
        type: String,
        default: "",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verifyCode: {
        type: String,
        default: "",
    },
    verifyCodeExpiry: {
        type: Date,
        default: () => Date.now() + 60 * 60 * 1000, // 1 hour from now
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true,
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: [],
    }]
},
{ timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
