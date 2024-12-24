import { dbConnect } from '@/src/app/lib/db';
import User from '@/src/app/models/User'; // Import your User model
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(req) {
    const session = await getServerSession({ req });

    // Session validation
    if (!session) {
        return new Response(JSON.stringify({ message: 'Not authenticated' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Validate request body
    try{
        await dbConnect();
        const sessionuser = await User.findOne({ email: session.user.email });// Find the current user
        const allUsers = await User.find({});// Find all users
        const filteredUsers = allUsers.filter(user => user.email !== session.user.email);
        const finalFilteredUsers = filteredUsers.filter(user => 
            !sessionuser.following.includes(user._id) // Exclude users already followed by the session user
          );

          console.log("Filtered users:", finalFilteredUsers);

        return new NextResponse(    
            JSON.stringify({ users: finalFilteredUsers }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    }
    catch(error){
        return new Response(JSON.stringify({ message: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
