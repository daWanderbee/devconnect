import { dbConnect } from "@/src/app/lib/db";
import Team from "@/src/app/models/Teams";
import { getServerSession } from "next-auth";
import User from "@/src/app/models/User";

export async function POST(req){
    try{
        await dbConnect();

        const session = await getServerSession();
        if (!session) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Not authenticated",
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
                    error: "User not found",
                }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { teamId, memberId } = await req.json(); // Parse the JSON body to get teamId and memberId

        const team = await Team.findById(teamId);
        if (!team) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Team not found",
                }),
                { status: 404, headers: { 'Content-Type': 'application/json' }
            });
        }

        // Check if the user is the creator of the team
        if (team.createdBy.toString() !== user._id.toString()) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "User not authorized to approve team members",
                }),
                { status: 403, headers: { 'Content-Type': 'application/json' }
            });
        }

        //Check if the memberId is already a member of the team
        if (team.members.includes(memberId)) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "User is already a member of the team",
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' }
            });
        }

        team.members.push(memberId);
        await team.save();

        return new Response(
            JSON.stringify({
                success: true,
                message: "Team member approved successfully",
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' }
        });
    }catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message,
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' }
        });
    }
}