import { dbConnect } from '@/src/app/lib/db';
import Post from '@/src/app/models/Post';
import { getServerSession } from 'next-auth';
import User from '@/src/app/models/User';

export async function POST(req) {
    // Connect to the database
    await dbConnect();
    
    // Retrieve the session to ensure the user is authenticated
    const session = await getServerSession({ req });
    if (!session) {
        return new Response(
            JSON.stringify({
                success: false,
                error: "Not authenticated"
            }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Find the user based on the session's email
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

    // Extract the postId, description, and image URL from the request body
    const { postId, desc, img } = await req.json();
    
    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
        return new Response(
            JSON.stringify({
                success: false,
                error: "Post not found"
            }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Verify that the post belongs to the authenticated user
    if (post.userId.toString() !== user._id.toString()) {
        return new Response(
            JSON.stringify({
                success: false,
                error: "User not authorized to update this post"
            }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        // Update the post's description and image
        await Post.findByIdAndUpdate(postId, { desc, img });
        
        return new Response(
            JSON.stringify({
                success: true,
                message: "Post updated successfully"
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        // Handle any errors during the update process
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
