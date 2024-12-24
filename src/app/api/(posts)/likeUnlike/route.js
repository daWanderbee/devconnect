import { getServerSession } from 'next-auth';
import { dbConnect } from '@/src/app/lib/db'; // Adjust the path as needed
import User from '@/src/app/models/User'; // Adjust the path as needed
import Post from '@/src/app/models/Post'; // Import your Post model
import Notification from '@/src/app/models/Notification'; // Import your Notification model

export async function POST(req) {
    try {
        // Step 1: Validate the session
        const session = await getServerSession();

        if (!session) {
            return new Response(JSON.stringify({ message: 'Not authenticated' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Step 2: Validate and parse request body
        const { postId } = await req.json();
        if (!postId) {
            return new Response(JSON.stringify({ message: 'Invalid request: postId is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Step 3: Connect to the database
        await dbConnect();

        const user = await User.findOne({ email: session.user.email });
        // Step 4: Find the current user
        const currentUser = await User.findById(user._id) || await User.findOne({ email: session.user.email });
        if (!currentUser) {
            return new Response(JSON.stringify({ message: 'Current user not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Step 5: Find the target post
        const post = await Post.findById(postId);
        if (!post) {
            return new Response(JSON.stringify({ message: 'Post not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Step 6: Determine if the post is already liked
        const isAlreadyLiked = post.likes.includes(currentUser._id);

        // Step 7: Toggle like/unlike
        const actionType = isAlreadyLiked ? 'unlike' : 'like';
        const message = `${currentUser.username} ${actionType}d your post.`;

        if (isAlreadyLiked) {
            post.likes.pull(currentUser._id);
        } else {
            post.likes.push(currentUser._id);
        }
        await post.save();

        // Step 8: Create a notification
        await Notification.create({
            recipient: post.userId, // Post owner's ID
            sender: currentUser._id,
            actionType,
            message,
            isRead: false,
            createdAt: new Date(),
        });

        // Step 9: Send response
        return new Response(
            JSON.stringify({ message: `${actionType.charAt(0).toUpperCase() + actionType.slice(1)}d successfully` }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Error in like/unlike API:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
