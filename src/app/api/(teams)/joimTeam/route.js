import { dbConnect } from "@/src/app/lib/db";
import Team from "@/src/app/models/Teams";
import User from "@/src/app/models/User";

export async function POST(req) {
    try {
        await dbConnect();

        const { teamId, userId } = await req.json(); // Parse the JSON body to get teamId

        // Fetch team based on teamId
        const team = await Team.findById(teamId);
        if (!team) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Team not found"
                }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Fetch user based on userId
        const user = await User.findById(userId);
        if (!user) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "User not found"
                }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if the user is already a member of the team
        if (team.members.includes(user._id)) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "User is already a member of the team"
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Add user to the team

        team.members.push(user._id);
        await team.save();

        return new Response(
            JSON.stringify({
                success: true,
                data: team
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (e) {
        return new Response(
            JSON.stringify({
                success: false,
                error: e.message
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
