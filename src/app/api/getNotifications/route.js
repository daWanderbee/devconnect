import { getServerSession } from "next-auth";
import { dbConnect } from "@/src/app/lib/db";
import Notification from "@/src/app/models/Notification";
import User from "@/src/app/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await getServerSession();
    if (!session) {
      return new Response(
        JSON.stringify({ message: "Not authenticated" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    const notifications = await Notification.find({ recipient: user._id })
      .sort({ createdAt: -1 });

      return new NextResponse(
        JSON.stringify({ Notifications: notifications }), // Stringify the body
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }, // Set the content type to application/json
        }
      );
      
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}