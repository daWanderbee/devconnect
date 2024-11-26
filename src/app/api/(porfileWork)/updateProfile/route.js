import { dbConnect } from "@/src/app/lib/db";
import User from "@/src/app/models/User";
import { getServerSession } from "next-auth";

export async function  POST(req){
    await dbConnect();

    const session = await getServerSession();
    if(!session){
        return new Response(
            JSON.stringify({
                success: false,
                error: "Not authenticated"
            }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const user = await User.findOne({ email: session.user.email });
    if(!user){
        return new Response(
            JSON.stringify({
                success: false,
                error: "User not found"
            }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const { username , fullName , bio , coverImg } = await req.json();

    try{
        user.username = username;
        user.fullName = fullName;
        user.bio = bio;
        user.coverImg = coverImg;

        await user.save();

        return new Response(
            JSON.stringify({
                success: true,
                user
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    }catch(err){
        return new Response(
            JSON.stringify({
                success: false,
                message :"Error updating profile"
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}