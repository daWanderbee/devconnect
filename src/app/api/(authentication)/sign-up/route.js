import { dbConnect } from "@/src/app/lib/db";
import User from "@/src/app/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/src/helpers/sendVerificationEmail";

export async function POST(request) {
    await dbConnect();
  
    try {
        const { username, email, password, fullName } = await request.json();

        // Check if the username is already taken by a verified user
        const existingVerifiedUserByUsername = await User.findOne({
            username,
            isVerified: true,
        });

        if (existingVerifiedUserByUsername) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'Username is already taken',
                }),
                { status: 400 }
            );
        }

        // Check if email is already taken
        const existingUserByEmail = await User.findOne({ email });
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        message: 'User already exists with this email',
                    }),
                    { status: 400 }
                );
            } else {
                // Update the existing user with the new password and verification code
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
                await existingUserByEmail.save();
            }
        } else {
            // Create a new user
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date(Date.now() + 3600000); // 1 hour expiry

            const newUser = new User({
                fullName,
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            });

            await newUser.save();
        }

        // Send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        // Ensure emailResponse has a success property
        if (!emailResponse?.success) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: emailResponse?.message || "Failed to send verification email",
                }),
                { status: 500 }
            );
        }
        console.log(verifyCode,": verifyCode")
        return new Response(
            JSON.stringify({
                success: true,
                message: 'User registered successfully. Please verify your account.',
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error('Error registering user:', error);
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Error registering user',
            }),
            { status: 500 }
        );
    }
}
