import { dbConnect } from "@/src/app/lib/db";
import UserLabels from "@/src/app/models/UserLabels";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import User from "@/src/app/models/User";

export async function GET() {
  try {
    // Connect to the database
    await dbConnect();

    // Get session details
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    const userId = user?._id;

    // Fetch user labels from the database
    const userLabels = await UserLabels.findOne({ userId });
    if (!userLabels) {
      return NextResponse.json({ error: "User labels not found" }, { status: 404 });
    }

    // Respond with user labels
    return NextResponse.json({ userLabels }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user labels:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
