import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Create a transporter object
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or another email service
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });

    // Configure the email
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email
      to: email, // Receiver email
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`, // Plain text email content
      html: `<p>Your OTP code is: <b>${otp}</b></p>`, // HTML email content
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  return NextResponse.json(null, {
    headers: {
      'Allow': 'POST',
    },
  });
}
