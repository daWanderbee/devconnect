import { dbConnect } from "@/src/app/lib/db";
import Team from "@/src/app/models/Teams";
import { getServerSession } from "next-auth";
import User from "@/src/app/models/User";

export async function GET(req) {
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
        const user = await User.findOne({ email: session.user.email });

        const teams = await Team.find({ createdBy: user._id });

        return new Response(
            JSON.stringify({
                success: true,
                teams
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    }
    catch (err) {
        return new Response(
            JSON.stringify({
                success: false,
                error: err
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
