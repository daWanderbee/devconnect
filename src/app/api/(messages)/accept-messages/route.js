import { getServerSession} from "next-auth";
import { dbConnect } from "@/src/app/lib/db";
import  User  from "@/src/app/models/User";

export async function POST(req) {
    await dbConnect();
    console.log("Database connection established");
    const session = await getServerSession();
    const user = session?.user;

    if (!session?.user) {
        return Response.json(
            {
                success: false,
                error: "Not authenticated"
            },
            {
                status: 401
            }   
        );
    }

    try {
        const userEmail = user?.email;
        const foundUser = await User.findOne({ email: userEmail });
        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    error: "User not found"
                },
                {
                    status: 404
                }
            );
        }
        const userId = foundUser._id;
        const { acceptMessages } = await req.json();

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true } 
        );
        console.log("User status updated to accept messages");
        if(updatedUser) {
            return Response.json(
                {
                    success: true,
                    updatedUser,
                    message: "User status updated to accept messages"
                },
                {
                    status: 200
                }
            );
        }


        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    error: "Failed to update user status to accept messages"
                },
                {
                    status: 400
                }
            );
        }

        return Response.json(
            {
                success: true,
                updatedUser,
                message: "User status updated to accept messages"
            }
        );
    } catch (error) {
        console.error("Failed to update user status to accept messages", error);
        return Response.json(
            {
                success: false,
                error: "Internal Server Error"
            },
            {
                status: 500
            }
        );
    }
}

export async function GET() {
    try {
        // Connect to the database
        await dbConnect();
        console.log("Database connected");

        // Fetch session data
        const session = await getServerSession();
        console.log("Session:", session);

        if (!session?.user) {
            return Response.json(
                {
                    success: false,
                    error: "Not authenticated",
                },
                {
                    status: 401,
                }
            );
        }

        // Extract user email from session
        const userEmail = session.user.email;
        console.log("Fetching user with email:", userEmail);

        // Fetch the user from the database
        const foundUser = await User.findOne({ email: userEmail });
        console.log("Found User:", foundUser);

        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    error: "User not found",
                },
                {
                    status: 404,
                }
            );
        }

        // Return user's `isAcceptingMessages` status
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessages,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("Error in GET handler:", error);
        return Response.json(
            {
                success: false,
                error: "Internal Server Error",
            },
            {
                status: 500,
            }
        );
    }
}