import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/app/api/auth/[...nextauth]/options'; // Adjust the path as needed
import { dbConnect } from '@/src/app/lib/db'; // Adjust the path as needed
import User from '@/src/app/models/User'; // Adjust the path as needed
import Notification from '@/src/app/models/Notification'; // Import your Notification model

export async function POST(req) {
    const session = await getServerSession({ req, authOptions });

    console.log("Session:", session);
    // Session validation
    if (!session) {
        return new Response(JSON.stringify({ message: 'Not authenticated' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Validate request body
    const { userId } = await req.json();
    if (!userId) {
        return new Response(JSON.stringify({ message: 'Invalid request: userId is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        await dbConnect();

        // Find current user by ID or email
        const currentUser = await User.findById(session.user._id) || await User.findOne({ email: session.user.email });
        const targetUser = await User.findById(userId);

        // Check if current user exists
        if (!currentUser) {
            return new Response(JSON.stringify({ message: 'Current user not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Check if target user exists
        if (!targetUser) {
            return new Response(JSON.stringify({ message: 'Target user not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Determine if current user is following the target user
        const isFollowing = currentUser.following.includes(userId);

        if (isFollowing) {
            // Unfollow
            currentUser.following.pull(userId);
            targetUser.followers.pull(currentUser._id);
            await currentUser.save();
            await targetUser.save();

            // Create a notification for unfollow
            await Notification.create({
                recipient: targetUser._id,
                sender: currentUser._id,
                actionType: 'unfollow',
                message: `${currentUser.fullName} unfollowed you.`,
            });

            return new Response(JSON.stringify({ message: 'Unfollowed successfully' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            // Follow
            currentUser.following.push(userId);
            targetUser.followers.push(currentUser._id);
            await currentUser.save();
            await targetUser.save();

            // Create a notification for follow
            await Notification.create({
                recipient: targetUser._id,
                sender: currentUser._id,
                actionType: 'follow',
                message: `${currentUser.username} followed you.`,
            });

            return new Response(JSON.stringify({ message: 'Followed successfully' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error("Error in follow/unfollow API:", error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
