import { dbConnect } from "@/src/app/lib/db";
import Team from "@/src/app/models/Teams";
import { getServerSession } from "next-auth";
import User from "@/src/app/models/User";

export async function GET(req) {
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
console.log(session)

    // Fetch user based on session email
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
console.log(user)

    // Extract teamId from the request body
    const { teamId } = await req.json(); // Parse the JSON body to get teamId
console.log("Team ID:", teamId);
const team = await Team.findById(teamId);
    if (!team) {
        console.log("team not found")
        return new Response(
            JSON.stringify({
                success: false,
                error: "Team not found"
            }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
    }
console.log(team)

    // Check if the team belongs to the user
    if (!team.members.includes(user._id)) {
        return new Response(
            JSON.stringify({
                success: false,
                error: "User not authorized to view notifications for this team"
            }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Get unread notifications for the team
    const unreadNotifications = team.messages.filter(message => !message.readBy.includes(user._id));
    return new Response(
        JSON.stringify({
            success: true,
            unreadNotifications
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
}