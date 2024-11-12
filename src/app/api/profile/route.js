import { dbConnect } from '@/src/app/lib/db';
import User from '@/src/app/models/User';

export async function GET(req) {
    const { searchParams } = new URL(req.url); // Extract search parameters from the URL
    const userId = searchParams.get('id'); // Get the 'id' parameter

    await dbConnect();

    if (!userId) {
        return new Response(JSON.stringify({ message: 'User ID is required' }), { status: 400 });
    }

    try {
        const user = await User.findOne({ _id: userId }); // Use _id to find the user

        if (!user) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }
        return new Response(JSON.stringify({ user }), { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}
