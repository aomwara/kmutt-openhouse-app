// pages/api/student/departments.ts
import type { NextApiResponse } from "next";
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // ดึงสาขาวิชาทั้งหมด
    const departments = await prisma.department.findMany({
      select: {
        id: true,
        name_th: true,
        name_en: true,
      },
      orderBy: { id: "asc" },
    });

    return res.status(200).json(departments);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default withAuth(handler, ["student"]);
