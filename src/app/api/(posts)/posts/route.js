import { dbConnect } from "../../../lib/db";
import Post from "../../../models/Post";

export async function GET() {
  try {
    await dbConnect();

    const posts = await Post.find({}).sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      return new Response(JSON.stringify({ message: "No posts found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ Posts: posts }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new Response(JSON.stringify({ message: "Error fetching posts" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
