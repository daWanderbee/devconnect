import { getServerSession, User as AuthUser } from "next-auth";
import { authOptions } from "@/src/app/api/(authentication)/auth/[...nextauth]/options";
import { dbConnect } from "@/src/app/lib/db";
import { User as DBUser } from "../../models/User";

export async function POST(req) {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    const user = session?.user

    if(!Session || !session.user){
        return Response.json(
            {
                success: false,
                error: "Not authenticated"
            },
            {
                status: 401
            }   
        )
    }

    const userId = user.id;
    const {acceptMessages} = await req.json();

    try{
        const updatedUser = await DBUser.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        )
        if(!updatedUser){
            return Response.json(
                {
                    success: false,
                    error: "failed to update user status to accept messages"
                },
                {
                    status: 401
                }
            )
        }
        return Response.json(
            {
                success: true,
                updatedUser,
                message: "User status updated to accept messages"
            }
        )
    }catch(error){
        console.error("Failed to update user status to accept messages", error);
        return Response.json(
            {
                success: false,
                error: "failed to update user status to accept messages"
            },
            {
                status: 500
            }
        )
    }
}

export async function GET(req) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user

    if(!Session || !session.user){
        return Response.json(
            {
                success: false,
                error: "Not authenticated"
            },
            {
                status: 401
            }   
        )
    }

    const userId = user.id;
    try{
        const foundUser = await DBUser.findById(userId)
    if(!foundUser){
        return Response.json(
            {
                success: false,
                error: "User not found"
            },
            {
                status: 401
            }
        )
    }

    return Response.json(
        {
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessages
        }
    )
    }catch(error){
        console.error("Failed to get user status to accept messages", error);
        return Response.json(
            {
                success: false,
                error: "failed to get user status to accept messages"
            },
            {
                status: 500})

    }

}