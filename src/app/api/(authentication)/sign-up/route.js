import { dbConnect } from "@/src/app/lib/db";
import User from "@/src/app/models/User";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

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
          message: "Username is already taken",
        }),
        { status: 400 }
      );
    }

    // Check if email is already taken
    const existingUserByEmail = await User.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    let userId;

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "User already exists with this email",
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
        userId = existingUserByEmail._id;
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
      userId = newUser._id;
    }
    console.log(verifyCode)
    // Send OTP using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email service
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });

    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Courier New', monospace; background-color: #0a1929;">
    <!-- Header with circuit pattern -->
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 20px 0; text-align: center; background-color: #0d2137; position: relative;">
                <!-- Circuit Board Pattern SVG -->
                <svg width="100%" height="100" style="position: absolute; top: 0; left: 0; opacity: 0.1;">
                    <pattern id="circuit" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M10 10h30v30h-30z" fill="none" stroke="#4CAF50" stroke-width="1"/>
                        <circle cx="25" cy="25" r="3" fill="#4CAF50"/>
                        <path d="M25 10v-10 M25 50v-10 M10 25h-10 M50 25h-10" stroke="#4CAF50" stroke-width="1"/>
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#circuit)"/>
                </svg>
                <h1 style="color: #4CAF50; margin: 0; font-family: 'Courier New', monospace; position: relative;">
                    &lt;DevConnect/&gt;
                </h1>
            </td>
        </tr>
    </table>
    
    <!-- Main Content -->
    <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #0d2137; border-radius: 8px; box-shadow: 0 0 20px rgba(76, 175, 80, 0.1); border: 1px solid #4CAF50;">
        <tr>
            <td style="padding: 40px;">                
                <h2 style="color: #4CAF50; margin-top: 0; font-family: 'Courier New', monospace;">
                    > Authentication Required_
                </h2>
                <p style="color: #a0e4b3; font-size: 16px; line-height: 1.6; font-family: 'Courier New', monospace;">
                    Hello Developer,
                </p>
                <p style="color: #a0e4b3; font-size: 16px; line-height: 1.6; font-family: 'Courier New', monospace;">
                    Initialize verification sequence with the following OTP:
                </p>
                <div style="background-color: #1a365d; border-radius: 6px; padding: 20px; margin: 30px 0; text-align: center; border: 1px solid #4CAF50; position: relative;">
                    <!-- Terminal-style header -->
                    <div style="position: absolute; top: -10px; left: 10px; background-color: #4CAF50; padding: 0 10px; border-radius: 3px;">
                        <code style="color: #000;">OTP.verify()</code>
                    </div>
                    <span style="font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 8px; font-family: 'Courier New', monospace;">${verifyCode}</span>
                </div>
                <p style="color: #a0e4b3; font-size: 16px; line-height: 1.6; font-family: 'Courier New', monospace;">
                    WARNING: Token expires in 600 seconds.<br>
                    Status: Pending verification
                </p>
                <p style="color: #a0e4b3; font-size: 16px; line-height: 1.6; font-family: 'Courier New', monospace;">
                    $ System.exit()<br>
                    DevConnect Security Team
                </p>
            </td>
        </tr>
    </table>
    
    <!-- Footer -->
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 20px; text-align: center;">
                <p style="color: #4CAF50; font-size: 14px; margin: 0; font-family: 'Courier New', monospace;">
                    © 2025 DevConnect | Security Protocol v2.5.0
                </p>
            </td>
        </tr>
    </table>
</body>
</html>`;
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email
      to: email, // Receiver email
      subject: "Your OTP Code",
      text: `Your OTP code is: ${verifyCode}`, // Plain text email content
      html: html, // HTML email content
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({
        success: true,
        message: "User registered successfully. Please verify your account.",
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error registering user",
      }),
      { status: 500 }
    );
  }
}
