import { StreamChat } from "stream-chat";
import User from '@/src/app/models/User';
const api_key = "vyaz8uzwffwu";
const api_secret = "hucyphyv4ewcsyb78vtrar5papm5fmska6tkm5nnz48gq6djuzqmsybrrrtzbf5j";

export async function GET(req) {
    try {
        // Extract userId from the query parameters
        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get("userId");

        if (!user_id) {
            return new Response(
                JSON.stringify({ error: "userId is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Create Stream Chat server client
        const serverClient = StreamChat.getInstance(api_key, api_secret);

        // Generate token for the given userId
        const token = serverClient.createToken(user_id);

        const user = await User.findById(user_id);
        if (!user) {
            return new Response(
                JSON.stringify({ error: "User not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // Update the user with the Stream Chat token
        user.token = token;
        await user.save();
        return new Response(
            JSON.stringify({ token }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message || "An error occurred" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
