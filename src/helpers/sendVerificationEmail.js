import { resend } from "@/src/app/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(email, username, verifyCode) {
  try {
    await resend.emails.send({
      from: 'asmita2018fzd@gmail.com', // Upd2018fzd@gmailate this with the correct 'from' email address
      to: email,
      subject: 'Verification Email - Devconnect',
      react: VerificationEmail({ username, otp: verifyCode }), // Pass the verification code and username to the email template
    });

    // Return success if email is sent successfully
    return { success: true, message: 'Verification email sent successfully' };

  } catch (emailError) {
    console.error("Error sending email:", emailError);
    return { success: false, message: "Error sending email" };
  }
}
