import dbConnect from '@/src/app/lib/db';
import Team from '@/src/app/models/Teams';
import { getServerSession } from 'next-auth';
import User from '@/src/app/models/User';

export async function GET(req) {
    try {
        await dbConnect();

        const session = await getServerSession();
        if (!session) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Not authenticated',
                }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Fetch user based on session email
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'User not found',
                }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const teams = await Team.find({ members: user._id });

        return new Response(
            JSON.stringify({
                success: true,
                data: teams,
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message,
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}