import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const EXTERNAL_JWT_SECRET = process.env.EXTERNAL_JWT_SECRET || "localsecret"; 

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        emailOrUsername: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req): Promise<User | null> {
        if (!credentials) return null;
        const { emailOrUsername, password } = credentials;
        if(emailOrUsername.startsWith(`KM_`)){
          console.log("kmuser login")
          console.log(emailOrUsername)
          // KMUTT user role
          const kmuser = await prisma.admins.findUnique({ where: { username: emailOrUsername } });
          console.log(kmuser);
           if (!kmuser) return null;
          const isValid = await bcrypt.compare(password, kmuser.password_hash);
          if (!isValid) return null;
          return {
              id: kmuser.id,
              role: "kmuser",
              name: kmuser.name,
              email: kmuser.email
          };
          }else{
            // normal role
            const student = await prisma.students.findUnique({ where: { email: emailOrUsername } });
            const staff = await prisma.staffs.findUnique({ where: { username: emailOrUsername } });
            const user = student || staff 
            if (!user) return null;
            const isValid = await bcrypt.compare(password, user.password_hash);
            if (!isValid) return null;

            return {
                id: user.id,
                role: student ? student.role : "staff",
                name: student ? `${student.first_name} ${student.last_name}` : staff!.name,
                email: user.email
            };
          }
        }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 
  },
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.role = user.role;
      token.name = user.name;
      token.email = user.email;
      token.accessToken = jwt.sign(
        {
          id: user.id,
          role: user.role,
          name: user.name,
          email: user.email,
        },
        EXTERNAL_JWT_SECRET,
        { expiresIn: "1d" }
      );
    }
    return token;
  },

  async session({ session, token }) {
    session.user.id = token.id as number;
    session.user.role = token.role as "student" | "staff" | "kmuser" | "parent" | "guest" | "teacher";
    session.user.name = (token.name as string) ?? null;
    session.user.email = (token.email as string) ?? null;

    session.accessToken = token.accessToken as string;

    return session;
  }
},
  pages: {
    signIn: "/login"
  }
};

export default NextAuth(authOptions);
