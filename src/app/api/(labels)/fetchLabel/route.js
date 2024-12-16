import { dbConnect } from "@/src/app/lib/db";
import UserLabels from "@/src/app/models/UserLabels";
import { getServerSession } from "next-auth";
import axios from 'axios';

export default async function GET(req, res) {
  try {
    // Connect to the database
    await dbConnect();

    // Get session details
    const session = await getServerSession(req);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("Session User ID:", session.user._id);

    // Fetch user profile data from another API
    const apiUrl = `/api/profile?id=${session.user._id}`;
    const response = await axios.get(apiUrl);

    if (!response.data) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User Profile Data:", response.data);

    // Fetch user labels from the database
    const userLabels = await UserLabels.findOne({ userId: session.user._id });
    if (!userLabels) {
      return res.status(404).json({ error: "User labels not found" });
    }

    // Respond with user labels
    res.status(200).json({ userLabels });
  } catch (error) {
    console.error("Error fetching user labels:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
