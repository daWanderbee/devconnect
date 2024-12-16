import Labels from "@/src/app/models/Labels";
import { getServerSession } from "next-auth";
import { dbConnect } from "@/src/app/lib/db";
import { NextResponse } from "next/server";
import User from "@/src/app/models/User";
import UserLabels from "@/src/app/models/UserLabels";

export async function GET() {
    try {
        // Connect to the database
        await dbConnect();

        // Get session details
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Get the user's ID
        const user = await User.findOne({ email: session.user.email });
        const userId = user?._id;

        if (!userId) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Fetch all available labels
        const allLabels = await Labels.find({});
        console.log("All labels:", allLabels);

        // Fetch user's labels
        const userLabelObject = await UserLabels.findOne({ userId });
        let userLabels = userLabelObject?.labels || [];
        console.log("User labels:", userLabels);

        // Add any labels from allLabels that are not in userLabels
        const updatedLabels = [...userLabels];

        allLabels.forEach(label => {
            const labelExists = userLabels.some(
                userLabel => userLabel.name === label.name && userLabel.color === label.color
            );
            if (!labelExists) {
                updatedLabels.push(label);
            }
        });

        return NextResponse.json({ labels: updatedLabels }, { status: 200 });

    } catch (error) {
        console.error("Error fetching labels:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
