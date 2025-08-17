import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@/utils/database";
import bcrypt from "bcrypt";
import User from "@/models/user";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        try {
          await connectToDB();

          const { email, password } = credentials;
          const user = await User.findOne({ email });

          if (!user) {
            throw new Error("Couldn't find the user");
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            throw new Error("enter a correct password");
          }

          // Return user with essential fields only
          return {
            _id: user._id,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          throw new Error(error.message || "Something went wrong");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
