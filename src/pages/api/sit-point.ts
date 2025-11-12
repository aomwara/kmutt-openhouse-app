import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    // ดึงข้อมูลนักเรียน + EStamp + Activity ของคณะเทคโนโลยีสารสนเทศ (facultyId = 4)
    const students = await prisma.students.findMany({
      where: {
        EStamp: {
          some: {
            activity: {
              department: { facultyId: 4 },
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
              department: { facultyId: 4 },
            },
          },
          select: {
            issued_at: true,
            activity: {
              select: {
                id: true,
                title: true,
                activity_type: true,
                point: true,
                date: true,
                start_time: true,
                end_time: true,
              },
            },
          },
        },
      },
    });

    // แปลงข้อมูล + คำนวณแต้มรวม
    const result = students.map((student) => {
      // sort activities ตามวันที่และเวลา
      const sortedEStamp = [...student.EStamp].sort((a, b) => {
        const da = new Date(a.activity.date);
        const db = new Date(b.activity.date);
        if (da.getTime() !== db.getTime()) return da.getTime() - db.getTime();
        return (a.activity.start_time ?? "").localeCompare(b.activity.start_time ?? "");
      });

      // รวมแต้ม
      const total_points = sortedEStamp.reduce(
        (sum, e) => sum + (e.activity.point ?? 0),
        0
      );

      // ทำ pivot (activity_1, activity_2, ...)
      const activities: Record<string, string | null> = {};
      sortedEStamp.forEach((e, idx) => {
        const colName = `activity_${idx + 1}`;
        const act = e.activity;
        activities[colName] = `[${act.activity_type}] [${act.point}] ${act.title}`;
      });

      return {
        student_id: student.id,
        student_name: `${student.first_name} ${student.last_name}`,
        school: student.school,
        province: student.province,
        email: student.email,
        phone: student.phone,
        total_points,
        ...activities,
      };
    });

    // เรียงจากแต้มรวมมากไปน้อย
    result.sort((a, b) => b.total_points - a.total_points);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in student report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler, ["kmuser"]);
