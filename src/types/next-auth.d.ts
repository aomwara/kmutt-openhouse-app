import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: number;
    role: "student" | "staff" | "kmuser" | "parent" | "guest" | "teacher";
  }

  interface Session {
    user: User & DefaultSession["user"];
    accessToken?: string;
  }

  interface JWT {
    id: number;
    role: "student" | "staff";
    name?: string;
    email?: string;
    accessToken?: string;
  }
  
}
