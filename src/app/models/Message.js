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
    }
},
    { timestamps: true }
);

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;