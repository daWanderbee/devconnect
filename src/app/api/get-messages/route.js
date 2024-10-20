import { getServerSession, User as AuthUser } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "../../lib/db";
import {User as DBUser} from "../../models/User";
import { Mongoose } from "mongoose";


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

    const userId = new Mongoose.Types.ObjectId(user._id);
    try{
        const user = await DBUser.aggregate([
            { $match: {id: userId}},
            { $unwind: '$messages'},
            { $sort: {'messages.createdAt': -1}},
            {$group: {_id: '$_id', messages: {$push: '$messages'}}}
        ])
        if(!user || user.length === 0){
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
                messages: user[0].messages
            },
            {
                status: 200
            }
        )
    }catch(error){
        console.log("unexpected error",error)
        return Response.json(
            {
                success: false,
                error: "Internal server error"
            },
            {
                status: 500
            }
        )
    }
     
}