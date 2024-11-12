import { dbConnect } from "@/src/app/lib/db";
import Post from "@/src/app/models/Post";
import { getServerSession } from "next-auth";
import User from "@/src/app/models/User";

export async function DELETE(req) {
    await dbConnect();

    const session = await getServerSession();
    if (!session) {
        return new Response(
            JSON.stringify({
                success: false,
                error: "Not authenticated"
            }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
    }
console.log(session)
    // Fetch user based on session email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
        return new Response(
            JSON.stringify({
                success: false,
                error: "User not found"
            }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
    }
console.log(user)
    // Extract postId from the request body
    const { postId } = await req.json(); // Parse the JSON body to get postId
console.log("Post ID:", postId);
const post = await Post.findById(postId);
    if (!post) {
        console.log("post not found")
        return new Response(
            JSON.stringify({
                success: false,
                error: "Post not found"
            }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
    }
console.log(post)
    // Check if the post belongs to the user
    if (post.userId.toString() !== user._id.toString()) {
        return new Response(
            JSON.stringify({
                success: false,
                error: "User not authorized to delete this post"
            }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
    }
console.log(post.userId.toString())
    try {
        await Post.findByIdAndDelete(postId);
        return new Response(
            JSON.stringify({
                success: true,
                message: "Post deleted successfully"
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error("Failed to delete post", error);
        return new Response(
            JSON.stringify({
                success: false,
                error: "Internal server error"
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
