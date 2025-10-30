import type { NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    // ✅ ดึง studentId จาก token โดยตรง
    const studentId = req.user.id;

    if (!studentId) {
      return res.status(400).json({ error: "Missing student ID" });
    }

    // ✅ ดึงข้อมูล e-stamp เฉพาะคณะวิศวกรรมศาสตร์ (facultyId = 1)
    const student = await prisma.students.findUnique({
      where: { id: studentId },
      select: {
        first_name: true,
        last_name: true,
        EStamp: {
          where: {
            activity: {
              department: { facultyId: 1 },
            },
          },
          select: {
            activity: {
              select: {
                title: true,
                point: true,
                activity_type: true,
                date: true,
                start_time: true,
                end_time: true,
                department: { select: { name_th: true } },
              },
            },
            issued_at: true, // เวลา stamp
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // ✅ รวมคะแนน
    const total_points = student.EStamp.reduce(
      (sum, e) => sum + (e.activity.point ?? 0),
      0
    );

    const activities = student.EStamp.map((e) => ({
      type: e.activity.activity_type,
      name: e.activity.title,
      point: e.activity.point,
      department: e.activity.department.name_th,
      date: e.activity.date,
      time: `${e.activity.start_time} - ${e.activity.end_time}`,
      stamp_time: e.issued_at,
    }));

    const response = {
      student: {
        name: `${student.first_name} ${student.last_name}`,
        total_points,
        // can_download: total_points >= 3,
        can_download: true, // ✅ อนุญาตให้ดาวน์โหลดได้ทุกคนชั่วคราว
      },
      activities,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching engineering points:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default withAuth(handler, ["student"]);
