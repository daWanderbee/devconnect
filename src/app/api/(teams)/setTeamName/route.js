import { dbConnect } from "@/src/app/lib/db";
import Team from "@/src/app/models/Teams";
import { getServerSession } from "next-auth";

export async function POST(req) {
    try {
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

        const { teamId, name } = await req.json();

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

        if (team.createdBy.toString() !== session.user.id) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "User not authorized to change team name"
                }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        team.name = name;
        await team.save();

        return new Response(
            JSON.stringify({
                success: true,
                team
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