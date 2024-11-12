import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/src/app/lib/db";
import User from "@/src/app/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Username or Email", type: "text", placeholder: "Enter username or email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Connect to the database
        await dbConnect();

        // Find user by username or email
        const user = await User.findOne({
          $or: [
            { username: credentials.identifier },
            { email: credentials.identifier },
          ],
        });
        console.log(user);
        // If user doesn't exist or password is incorrect, throw an error
        if (!user?.isVerified || !(await bcrypt.compare(credentials.password, user.password))) {
          throw new Error("Invalid credentials or unverified account");
        }

        // Return user data including _id, username, and email
        return { _id: user._id.toString(), username: user.username, email: user.email };
      },
    }),
  ],
  callbacks: {
    // This callback is fired when a JWT is created or updated.
    async jwt({ token, user }) {
      if (user) {
        // Add user data to token after login
        token._id = user._id;
        token.username = user.username;
      } // Log the token for debugging
      return token; // Return the token with user data
    },

    // This callback is fired when a session is created or updated.
    async session({ session, token }) {
      if (token) {
        // Ensure _id and username are added to the session from the token
        session.user._id = token._id;
        session.user.username = token.username;
      } // Log session data for debugging
      return session; // Return the session with updated user data
    },
  },
  pages: {
    signIn: "/sign-in", // Custom sign-in page (if applicable)
  },
  session: {
    strategy: "jwt", // Using JWT for session strategy
    maxAge: 60 * 60 * 24, // 1 day (set max age for the JWT token if needed)
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure you have a secure secret
};

export default authOptions;
