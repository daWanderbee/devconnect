import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    desc: {
        type: String,
        max: 1000,
    },
    img: {
        type: String,
    },
    likes: {
        type: Array,
        default: [],
    },
    joinTeam: {
        type: Array,
        default: [],
    },
    comments: {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
    },
},
    { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;