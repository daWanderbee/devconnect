import { dbConnect } from "@/src/app/lib/db";
import { getServerSession } from "next-auth";
import UserLabels from "@/src/app/models/UserLabels";
import { NextResponse } from "next/server";
import User from "@/src/app/models/User";

export async function POST(req) {
    try {
        // Connect to the database
        await dbConnect();

        // Get session details
        const session = await getServerSession();
        console.log("Session:", session);

        // Check if user is authorized
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Parse the request body
        const { labels } = await req.json();
        console.log("Received labels:", labels);

        // Fetch user details
        const user = await User.findOne({ email: session.user.email });
        const userId = user?._id;
        if (!userId) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Validate request fields
        if (!Array.isArray(labels) || labels.length === 0) {
            return NextResponse.json({ message: "Missing or invalid required fields" }, { status: 400 });
        }

        // Check if a user-label document already exists
        let existing = await UserLabels.findOne({ userId });

        if (existing) {
            // Initialize labels if not already set
            existing.labels = existing.labels || [];
            
            // Merge and deduplicate labels
            existing.labels = existing.labels.concat(labels).filter((value, index, self) =>
                index === self.findIndex((t) => t.name === value.name && t.color === value.color)
            );
            await existing.save();
            return NextResponse.json({ message: "Labels added successfully" }, { status: 200 });
        }

        // Create a new user-label document if none exists
        const userLabel = new UserLabels({
            userId,
            labels,
        });
        await userLabel.save();

        return NextResponse.json({ message: "Labels added successfully" }, { status: 200 });

    } catch (error) {
        // Log the error and respond with a generic error message
        console.error("Error in allotting labels to user:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
