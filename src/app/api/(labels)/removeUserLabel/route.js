import { dbConnect } from "@/src/app/lib/db";
import { getServerSession } from "next-auth";
import User from "@/src/app/models/User";
import UserLabels from "@/src/app/models/UserLabels";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    await dbConnect();
    const session = await getServerSession({ req });

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Extract labelId from query string
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const labelId = searchParams.get("labelId");

    if (!labelId) {
      console.error("Missing labelId in query params");
      return NextResponse.json({ message: "Label ID is required" }, { status: 400 });
    }

    const userLabels = await UserLabels.findOne({ userId: user._id });
    if (!userLabels) {
      console.error("User labels not found for user ID:", user._id);
      return NextResponse.json({ message: "User labels not found" }, { status: 404 });
    }

    const updatedLabels = userLabels.labels.filter(
      (item) => item._id.toString() !== labelId
    );

    // Check if label exists in user's labels
    if (updatedLabels.length === userLabels.labels.length) {
      console.error("Label ID not found in user's labels:", labelId);
      return NextResponse.json({ message: "Label not found" }, { status: 404 });
    }

    userLabels.labels = updatedLabels;
    await userLabels.save();

    return NextResponse.json({ message: "Label removed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/removeUserLabel:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
