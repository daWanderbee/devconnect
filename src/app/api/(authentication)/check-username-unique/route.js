import { dbConnect } from "@/src/app/lib/db";
import User from "@/src/app/models/User";
import { z } from 'zod';
import { usernameValidation } from "@/src/schemas/signUpSchema"; // Adjust path if necessary

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(req) {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url, `http://${req.headers.get('host')}`);
        const queryParam = {
            username: searchParams.get("username"),
        };

        // Validate the query parameters with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        console.log(result); // TODO: Remove this line for production

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return new Response(JSON.stringify({
                success: false,
                error: "Invalid username",
                usernameErrors,
            }), { status: 400 });
        }

        const { username } = result.data;

        // Check if the username already exists and is verified
        const existingVerifiedUser = await User.findOne({ username, isVerified: true });
        if (existingVerifiedUser) {
            return new Response(JSON.stringify({
                success: false,
                error: "Username already exists",
            }), { status: 400 });
        }

        // Username is available
        return new Response(JSON.stringify({
            success: true,
            message: "Username is available",
        }), { status: 200 });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({
            success: false,
            error: "Error while checking username",
        }), { status: 500 });
    }
}
