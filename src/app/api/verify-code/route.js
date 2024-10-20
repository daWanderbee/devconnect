import { dbConnect } from "../../lib/db";
import User from "../../models/User";

export async function POST(req) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({
            success: false,
            error: "Method not allowed",
        }), { status: 405 });
    }

    await dbConnect();
    try {
        const { username, verifyCode } = await req.json();

        // Validate required fields
        if (!username || !verifyCode) {
            return new Response(JSON.stringify({
                success: false,
                error: "Username and code are required",
            }), { status: 400 });
        }

        const decodedUsername = decodeURIComponent(username);
        const user = await User.findOne({ username: decodedUsername });

        if (!user) {
            return new Response(JSON.stringify({
                success: false,
                error: "User not found",
            }), { status: 404 });
        }

        const isCodeValid = user.verifyCode.toString().trim() == verifyCode;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();

            return new Response(JSON.stringify({
                success: true,
                message: "User verified successfully",
            }), { status: 200 });
        } else if (!isCodeNotExpired) {
            return new Response(JSON.stringify({
                success: false,
                error: "Code has expired. Signup again to get a new code",
            }), { status: 400 });
        } else {
            return new Response(JSON.stringify({
                success: false,
                error: "Invalid code",
            }), { status: 400 });
        }
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({
            success: false,
            error: "Error while verifying code",
        }), { status: 500 });
    }
}
