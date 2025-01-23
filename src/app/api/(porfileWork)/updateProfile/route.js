import { dbConnect } from "@/src/app/lib/db";
import User from "@/src/app/models/User";
import { getServerSession } from "next-auth";

export async function POST(req) {
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
    if (!user) {
        return new Response(
            JSON.stringify({
                success: false,
                error: "User not found"
            }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const { username, fullName, bio, coverImg, profileImg } = await req.json();

    const userNameFound = await User.findOne({ username });
    if (userNameFound && userNameFound.email !== user.email) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Username already exists"
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }
    try {
        console.log("CoverImg", coverImg);
        console.log("ProfileImg", profileImg);
        // Only update the fields that are provided
        if (username) user.username = username;
        if (fullName) user.fullName = fullName;
        if (bio) user.bio = bio;
        if (coverImg) user.coverImg = coverImg;
        if (profileImg) user.profileImg = profileImg;

        await user.save();

        return new Response(
            JSON.stringify({
                success: true,
                user
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error updating profile"
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
