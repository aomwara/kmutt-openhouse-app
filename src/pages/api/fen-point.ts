import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ ตั้งค่า API Key (อย่าลืมใส่ใน .env)
const API_KEY = "faculty-engineering-kmutt-oph2025x";

// ✅ Cache Memory Types
interface ActivityData {
  type: string | null;
  name: string;
  point: number | null;
  department: string | null;
  date: string | Date | null; // 👈 รองรับทั้ง string และ Date
  time: string | null;
  stamp_time: string | Date | null; // 👈 รองรับทั้ง string และ Date
}

interface StudentData {
  id: number;
  name: string;
  school: string | null;
  province: string | null;
  email: string | null;
  phone: string | null;
  total_points: number;
}

interface StudentResult {
  student: StudentData;
  activities: ActivityData[];
}

// ✅ memory cache
let cacheData: StudentResult[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 นาที

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // ✅ ตรวจสอบ API Key ก่อน
    const apiKey = req.headers["x-api-key"];
    if (apiKey !== API_KEY) {
      return res.status(401).json({ error: "Unauthorized: invalid API key" });
    }

    // ✅ เช็ค cache ก่อน
    const now = Date.now();
    if (cacheData && now - cacheTimestamp < CACHE_TTL) {
      return res.status(200).json({
        fromCache: true,
        cachedAt: new Date(cacheTimestamp).toISOString(),
        data: cacheData,
      });
    }

    // ✅ Query จากฐานข้อมูล
    const students = await prisma.students.findMany({
      where: {
        EStamp: {
          some: {
            activity: {
              department: {
                facultyId: 1,
              },
            },
          },
        },
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        school: true,
        province: true,
        email: true,
        phone: true,
        EStamp: {
          where: {
            activity: {
              department: {
                facultyId: 1,
              },
            },
          },
          select: {
            issued_at: true,
            activity: {
              select: {
                title: true,
                activity_type: true,
                point: true,
                date: true,
                start_time: true,
                end_time: true,
                department: {
                  select: {
                    name_th: true,
                  },
                },
              },
            },
          },
          orderBy: {
            activity: {
              date: "asc",
            },
          },
        },
      },
    });

    // ✅ แปลงข้อมูลเป็นโครงสร้างใหม่
    const result: StudentResult[] = students.map((student) => {
      const validEstamps = student.EStamp.filter(
        (e) => e.activity !== null && e.activity.point !== null
      );

      const total_points = validEstamps.reduce(
        (sum, e) => sum + (e.activity.point ?? 0),
        0
      );

      const activities = validEstamps.map((e) => ({
        type: e.activity.activity_type ?? null,
        name: e.activity.title,
        point: e.activity.point,
        department: e.activity.department?.name_th ?? null,
        date: e.activity.date ?? null,
        time: e.activity.start_time && e.activity.end_time
          ? `${e.activity.start_time}-${e.activity.end_time}`
          : null,
        stamp_time: e.issued_at ?? null,
      }));

      return {
        student: {
          id: student.id,
          name: `${student.first_name} ${student.last_name}`,
          school: student.school,
          province: student.province,
          email: student.email,
          phone: student.phone,
          total_points,
        },
        activities,
      };
    });

    // ✅ sort จากคะแนนรวมมากไปน้อย
    result.sort((a, b) => b.student.total_points - a.student.total_points);

    // ✅ เก็บ cache
    cacheData = result;
    cacheTimestamp = now;

    return res.status(200).json({
      fromCache: false,
      cachedAt: new Date(cacheTimestamp).toISOString(),
      data: result,
    });
  } catch (error) {
    console.error("Error fetching student points:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
