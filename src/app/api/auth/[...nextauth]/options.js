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
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Connect to the database
        await dbConnect();

        try {
          // Find user by either username or email using 'identifier'
          const user = await User.findOne({
            $or: [
              { username: credentials.identifier },
              { email: credentials.identifier }
            ]
          });

          // If no user is found
          if (!user) {
            throw new Error("No user found with the provided identifier");
          }

          // Check if the user is verified
          if (!user.isVerified) {
            throw new Error("User account is not verified");
          }

          // Compare the provided password with the stored hashed password
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }

          // Return user object if everything checks out
          return { id: user._id.toString(), username: user.username, email: user.email };

        } catch (err) {
          // Catch and log any errors
          console.error("Authorize function error:", err);
          throw new Error(err.message || "Error in authorize function");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user details to the token after successful authentication
      if (user) {
        token._id = user.id;
        token.isVerified = user.isVerified;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      // Add token details to the session object
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.username = token.username;
      }
      return session;
    }
  },
  pages: {
    signIn: "/sign-in", // Custom sign-in page
  },
  session: {
    strategy: "jwt", // Use JWT for sessions
  },
  secret: process.env.NEXTAUTH_SECRET, // Secret for NextAuth (ensure it's set in the environment variables)
};
