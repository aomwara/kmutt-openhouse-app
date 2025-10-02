import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const departments = await prisma.department.findMany({
      where: {
        facultyId: 1, // ✅ filter เฉพาะคณะวิศวกรรมศาสตร์
      },
      select: {
        id: true,
        name_th: true,
        name_en: true,
        faculty: {
          select: {
            id: true,
            name_th: true,
            name_en: true,
          },
        },
      },
      orderBy: {
        name_th: "asc",
      },
    });

    return res.status(200).json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
