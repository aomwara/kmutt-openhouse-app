// pages/api/student/profile.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const userId = req.user.id;

  if (req.method === "GET") {
    try {
      const student = await prisma.students.findUnique({
        where: { id: userId },
        select: {
          id: true,
          citizen_id: true,
          passport_id: true,
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
          school: true,
          province: true,
          created_at: true,
        },
      });

      if (!student) return res.status(404).json({ message: "Student not found" });

      return res.status(200).json(student);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  if (req.method === "PUT") {
    try {
      const { citizen_id, passport_id, first_name, last_name, school, province, phone } = req.body;

      const updated = await prisma.students.update({
        where: { id: userId },
        data: { citizen_id, passport_id, first_name, last_name, school, province, phone },
        select: {
          id: true,
          citizen_id: true,
          passport_id: true,
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
          school: true,
          province: true,
          created_at: true,
        },
      });

      return res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err || "Internal server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}

export default withAuth(handler, ["student"]);
