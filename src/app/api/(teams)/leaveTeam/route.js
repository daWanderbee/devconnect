import { dbConnect } from "@/src/app/lib/db";
import Team from "@/src/app/models/Teams";
import { getServerSession } from "next-auth";
import User from "@/src/app/models/User";
import { NextResponse } from "next/server";

export async function DELETE(req) {
    try {
        await dbConnect();

        const session = await getServerSession();
        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Not authenticated"
                },
                { status: 401 }
            );
        }
        console.log(session);

        // Fetch user based on session email
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "User not found"
                },
                { status: 404 }
            );
        }
        console.log(user);

        // Extract teamId from the request body
        const { teamId } = await req.json(); // Parse the JSON body to get teamId
        console.log("Team ID:", teamId);
        const team = await Team.findById(teamId);
        if (!team) {
            console.log("team not found");
            return NextResponse.json(
                {
                    success: false,
                    error: "Team not found"
                },
                { status: 404 }
            );
        }
        console.log(team);

        // Check if the user is a member of the team
        const isMember = team.members.includes(user._id);
        if (!isMember) {
            return NextResponse.json(
                {
                    success: false,
                    error: "User is not a member of the team"
                },
                { status: 403 }
            );
        }

        // Remove the user from the team's members array
        team.members.pull(user._id);
        await team.save();

        return NextResponse.json(
            {
                success: true,
                message: "User left the team successfully"
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: "Error leaving team"
            },
            { status: 500 }
        );
    }
}
