import { NextResponse } from "next/server";
import { dbConnect } from "../../lib/db";
import Post from "../../models/Post";
import Comment from "../../models/Comment";
import User from "../../models/User";

export const GET = async (req) => {
    try{
        await dbConnect();
        const posts = await Post.find({});
        const comments = await Comment.find({});
        const users = await User.find({});
        return new NextResponse(JSON.stringify(posts), {status: 200});
        
    }catch(err){
        return NextResponse.error(err);
    }
}