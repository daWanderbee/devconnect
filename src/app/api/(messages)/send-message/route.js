import User from '@/src/app/models/User';
import { dbConnect } from '@/src/app/lib/db';
import {Message} from '@/src/app/models/Message';

export async function POST(req) {
    await dbConnect();

    const {username, content} = await req.json();
    try{
        const user = User.findOne({username});
        if(!user){
            return Response.json(
                {
                    success: false,
                    error: "User not found"
                },
                {
                    status: 404
                }
            )
        } 

        //user accepting messages
        if(!user.acceptingMessages){
            return Response.json(
                {
                    success: false,
                    error: "User not accepting messages"
                },
                {
                    status: 403
                }
            )
        }
        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage);
        await user.save();

        return Response.json(
            {
                success: true,
                message: "Message sent"
            },
            {
                status: 200
            }
        )
    }catch(error){
        console.log("Error adding messages", error)
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