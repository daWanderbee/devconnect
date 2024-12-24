import { dbConnect } from "@/src/app/lib/db";
import Post from "@/src/app/models/Post";
import User from "@/src/app/models/User";
import { getServerSession } from "next-auth";

export async function POST(req) {
  await dbConnect();

  const session = await getServerSession({ req });
  if (!session) {
    return new Response(
      JSON.stringify({ success: false, error: "Not authenticated" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return new Response(
      JSON.stringify({ success: false, error: "User not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  const { postId, desc, img } = await req.json();
  const post = await Post.findById(postId);

  if (!post) {
    return new Response(
      JSON.stringify({ success: false, error: "Post not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  if (post.userId.toString() !== user._id.toString()) {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const updatedFields = {};
    if (desc) updatedFields.desc = desc;
    if (img) updatedFields.img = img;

    await Post.findByIdAndUpdate(postId, updatedFields);

    return new Response(
      JSON.stringify({ success: true, message: "Post updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
