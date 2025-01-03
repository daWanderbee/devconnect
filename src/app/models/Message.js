import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
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

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;