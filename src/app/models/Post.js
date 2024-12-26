import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        desc: {
            type: String
        },
        img: {
            type: String,
        },
        likes: {
            type: [mongoose.Schema.Types.ObjectId], 
            default: [],
        },
        joinTeam: {
            type: [mongoose.Schema.Types.ObjectId],
            default: [],
        },
        comments: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Comment", 
            default: [],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        }
    },
    { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
