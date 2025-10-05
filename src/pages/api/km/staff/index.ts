import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      // ดึง staff ทั้งหมด
      const staffs = await prisma.staffs.findMany({
        orderBy: { created_at: "desc" },
      });
      return res.status(200).json(staffs);
    }

    if (req.method === "POST") {
      const { username, password, name, email } = req.body;

      if (!username || !password || !name || !email) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const staff = await prisma.staffs.create({
        data: {
          username,
          password_hash: hashedPassword,
          name,
          email,
        },
      });

      return res.status(201).json(staff);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error in /api/km/staff:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default withAuth(handler, ["kmuser"]);