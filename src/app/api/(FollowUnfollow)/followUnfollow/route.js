import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/app/api/(authentication)/auth/[...nextauth]/options'; // Adjust the path if needed
import { dbConnect } from '@/src/app/lib/db'; // Adjust the path if needed
import User from '@/src/app/models/User'; // Adjust the path if needed
import Notification from '@/src/app/models/Notification'; // Adjust the path if needed

export async function POST(req) {
    try {
        // Retrieve the session
        const session = await getServerSession();

        if (!session) {
            return new Response(
                JSON.stringify({ message: 'Not authenticated' }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        // Parse the request body
        const { userId } = await req.json();

        if (!userId) {
            return new Response(
                JSON.stringify({ message: 'Invalid request: userId is required' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        await dbConnect();

        // Find current user and target user
        const currentUser = await User.findOne({ email: session.user.email });
        const targetUser = await User.findById(userId);

        if (!currentUser) {
            return new Response(
                JSON.stringify({ message: 'Current user not found' }),
                {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        if (!targetUser) {
            return new Response(
                JSON.stringify({ message: 'Target user not found' }),
                {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        const isFollowing = currentUser.following.includes(userId);

        if (isFollowing) {
            // Unfollow the target user
            await User.updateOne(
                { _id: currentUser._id },
                { $pull: { following: userId } }
            );
            await User.updateOne(
                { _id: userId },
                { $pull: { followers: currentUser._id } }
            );

            // Create a notification for unfollow action
            await Notification.create({
                recipient: targetUser._id,
                sender: currentUser._id,
                actionType: 'unfollow',
                message: `${currentUser.fullName || 'Someone'} unfollowed you.`,
            });

            return new Response(
                JSON.stringify({ message: 'Unfollowed successfully' }),
                {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        } else {
            // Follow the target user
            await User.updateOne(
                { _id: currentUser._id },
                { $addToSet: { following: userId } }
            );
            await User.updateOne(
                { _id: userId },
                { $addToSet: { followers: currentUser._id } }
            );

            // Create a notification for follow action
            await Notification.create({
                recipient: targetUser._id,
                sender: currentUser._id,
                actionType: 'follow',
                message: `${currentUser.username || 'Someone'} followed you.`,
            });

            return new Response(
                JSON.stringify({ message: 'Followed successfully' }),
                {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
    } catch (error) {
        console.error('Error in follow/unfollow API:', error);
        return new Response(
            JSON.stringify({ message: 'Internal server error' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
