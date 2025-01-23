import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/src/app/lib/db";
import User from "@/src/app/models/User";
import axios from "axios";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Username or Email", type: "text", placeholder: "Enter username or email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({
          $or: [
            { username: credentials.identifier },
            { email: credentials.identifier },
          ],
        });

        if (!user) {
          throw new Error("No user found with this username or email");
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordCorrect) {
          throw new Error("Invalid password");
        }

        if (!user.isVerified) {
          throw new Error("Account not verified. Please verify your account.");
        }

        return { _id: user._id.toString(), username: user.username, email: user.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "google"|| account?.provider === "github") {
        await dbConnect();
        
        // First try to find an existing user
        let dbUser = await User.findOne({ email: profile.email });
        
        // If no user exists, create one
        if (!dbUser) {
          dbUser = await User.create({
            username: profile.name,
            email: profile.email,
            fullName: profile.name,
            isVerified: true,
            profileImg: profile.picture || null,
            password: "xyz",
          });
        }
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/createUser?userId=${dbUser._id.toString()}`);

        // Ensure we have the database user object before setting token properties
        if (dbUser) {
          token._id = dbUser._id.toString();
          token.username = dbUser.username;
          token.email = dbUser.email;
          token.picture = profile.picture;
        }
      } else if (user) {
        // For credentials provider
        token._id = user._id;
        token.username = user.username;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          _id: token._id,
          username: token.username,
          email: token.email,
          picture: token.picture || null,
        };
      }

      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);