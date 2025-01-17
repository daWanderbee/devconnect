import { dbConnect } from "@/src/app/lib/db";
import Team from "@/src/app/models/Teams";
import { getServerSession } from "next-auth";
import User from "@/src/app/models/User";
import Post from "@/src/app/models/Post";

export async function DELETE(req) {
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

    // Extract the team ID from the request query
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("id");

    if (!teamId) {
        return new Response(
            JSON.stringify({
                success: false,
                error: "Team ID is required",
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        // Find and delete the team
        const deletedTeam = await Team.findOneAndDelete({ _id: teamId, createdBy: user._id });

        const post = await Post.findOneAndDelete({teamId});
        console.log("pop"+post);

        if (!deletedTeam) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Team not found or you are not authorized to delete this team",
                }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Team deleted successfully",
                team: deletedTeam,
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                error: "An error occurred while deleting the team",
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
