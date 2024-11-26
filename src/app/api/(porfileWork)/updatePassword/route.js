import { dbConnect } from "@/src/app/lib/db";
import User from "@/src/app/models/User";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";

export async function POST(req){
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
    try{
        const { oldPassword , newPassword } = await req.json();
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        if(await bcrypt.compare(oldPassword, user.password)){
            user.password = hashedPassword;
            await user.save();
            return new Response(
                JSON.stringify({
                    success: true,
                    user,
                    message: "REGISTER HGYA"
                }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }
        else{
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Incorrect old password"
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
}catch(err){
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error updating password"
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}