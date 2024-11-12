import { getServerSession } from 'next-auth';
import { dbConnect } from '@/src/app/lib/db'; // Adjust the path as needed
import User from '@/src/app/models/User'; // Adjust the path as needed
import Post from '@/src/app/models/Post'; // Import your Post model
import Notification from '@/src/app/models/Notification'; // Import your Notification model

export async function POST(req) {
    const session = await getServerSession();

    console.log("Session:", session);
    // Session validation
    if (!session) {
        return new Response(JSON.stringify({ message: 'Not authenticated' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Validate request body
    const { postId } = await req.json();
    if (!postId) {
        return new Response(JSON.stringify({ message: 'Invalid request: postId is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        await dbConnect();

        // Find current user
        const currentUser = await User.findById(session.user._id) || await User.findOne({ email: session.user.email });
        if (!currentUser) {
            return new Response(JSON.stringify({ message: 'Current user not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Find the target post
        const post = await Post.findById(postId);
        if (!post) {
            return new Response(JSON.stringify({ message: 'Post not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Check if the user has already liked the post
        const hasLiked = post.likes.includes(currentUser._id);

        if (hasLiked) {
            // Unlike the post
            post.likes.pull(currentUser._id);
            await post.save();

            // Create a notification for unlike action
            await Notification.create({
                recipient: post.userId, // Post owner's ID
                sender: currentUser._id,
                actionType: 'unlike',
                message: `${currentUser.username} unliked your post.`,
            });

            return new Response(JSON.stringify({ message: 'Unliked successfully' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            // Like the post
            post.likes.push(currentUser._id);
            await post.save();

            // Create a notification for like action
            await Notification.create({
                recipient: post.userId, // Post owner's ID
                sender: currentUser._id,
                actionType: 'like',
                message: `${currentUser.username} liked your post.`,
            });

            return new Response(JSON.stringify({ message: 'Liked successfully' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error("Error in like/unlike API:", error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
