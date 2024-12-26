import { dbConnect } from "@/src/app/lib/db";
import User from "@/src/app/models/User";

export async function POST(req) {
  try {
    // Parse the request body
    const { userIds } = await req.json();

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid or empty userIds array" }),
        { status: 200 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Fetch users based on the provided IDs
    const users = await User.find({ _id: { $in: userIds } })
      .select("fullName username profileImg") // Select only necessary fields
      .lean();

    return new Response(JSON.stringify({ users }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching users by IDs:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
