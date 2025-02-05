import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import {connectToDB} from "../../../../utils/database"
import bcrypt from "bcrypt"
import User from "../../../../models/user"

const authOptions = {
    providers:[
        CredentialsProvider({
            name:"credentials",
            credentials:{},
            
            async authorize(credentials){
                try {
                    await connectToDB();

                const {email,password} = credentials;
                const user = await User.findOne({email});
                
                if(!user){
                    throw new Error("Couldn't find the user")
                }
                
                const passwordMatch = await bcrypt.compare(password, user.password)
                
                if(!passwordMatch){
                    throw new Error("enter a correct password")
                }

                return user
                } catch (error) {
                    throw new Error(error.message || "Something went wrong");
                }
            }
        })
    ],
    session:{
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
          if (user) {
            token.id = user._id; // Store user ID in JWT token
            token.email = user.email; // Store user ID in JWT token
          }
          return token;
        },
        async session({ session, token }) {
          session.user.id = token.id; // Attach user ID to session
          session.user.email = token.email; // Attach user ID to session
          return session;
        },
      },
    pages:{
        signIn:"/",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST}; 
