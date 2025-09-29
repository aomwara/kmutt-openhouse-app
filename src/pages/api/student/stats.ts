import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ตัวแปร global สำหรับ cache
let cache: { data: { activitiesCount: number; registrationsCount: number }; timestamp: number } | null = null;
const CACHE_TTL = 60 * 1000; // 60 วินาที

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const now = Date.now();

    if (cache && now - cache.timestamp < CACHE_TTL) {
      // ถ้า cache ยังไม่หมดอายุ ให้ return ค่าเดิม
      res.setHeader("X-Cache", "HIT");
      return res.status(200).json(cache.data);
    }

    // query DB
    const [activitiesCount, registrationsCount] = await Promise.all([
      prisma.activities.count({ where: { display: true } }),
      prisma.students.count(),
    ]);

    const data = { activitiesCount, registrationsCount };

    // อัพเดต cache
    cache = { data, timestamp: now };

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
