import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/(authentication)/auth/[...nextauth]/options";
import { dbConnect } from "@/src/app/lib/db";
import Post from "@/src/app/models/Post";
import User from "@/src/app/models/User";

export async function POST(req) {
  await dbConnect();

  try {
    const session = await getServerSession({ req, ...authOptions });
    
    if (!session) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    console.log("Session:", session.user.email);
    const userMail = session.user.email;
    const { desc, img } = await req.json();

    // Await the user lookup to get the document
    const user = await User.findOne({ email: userMail });
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    const userId = user._id.toString(); // Convert userId to a string after resolving
    console.log("User ID:", userId);

    if (!desc && !img) {
      return new Response(JSON.stringify({ message: 'Post content is required' }), { status: 400 });
    }

    const newPost = await Post.create({
      userId,
      desc,
      img: img || "",
      likes: [],
      joinTeam: [],
      comments: []
    });

    await newPost.save();
    
    return new Response(JSON.stringify(newPost), { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
}
