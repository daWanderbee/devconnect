import { NextResponse } from "next/server";
import { dbConnect } from "@/src/app/lib/db";
import UserLabels from "@/src/app/models/UserLabels";

export async function GET(req) {
  try {
    // Extract userId from query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Connect to the database
    await dbConnect();

    // Fetch user labels from the database
    const userLabels = await UserLabels.findOne({ userId });

    if (!userLabels) {
      return NextResponse.json({ error: "User labels not found" }, { status: 404 });
    }

    console.log("User labels:", userLabels.labels);

    // Respond with the user's labels
    return NextResponse.json({ labels: userLabels.labels }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user labels:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
