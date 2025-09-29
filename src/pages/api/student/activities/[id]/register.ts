// pages/api/student/activities/[id]/register.ts
import type { NextApiResponse } from "next";
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const activityId = Number(id);
    const studentId = req.user.id;

    // ดึงข้อมูลกิจกรรมที่ต้องการลงทะเบียน
    const activity = await prisma.activities.findUnique({
      where: { id: activityId },
      include: { _count: { select: { RegisterActivities: true } } },
    });

    if (!activity) {
      return res.status(404).json({ message: "กิจกรรมไม่พบ" });
    }

    // ตรวจสอบว่าผู้ใช้งานเคยลงทะเบียนแล้วหรือยัง
    const registration = await prisma.registerActivities.findUnique({
      where: { studentId_activityId: { studentId, activityId } },
    });

    if (registration) {
      // ถ้ามีแล้ว => ลบ (ยกเลิก) โดยไม่ตรวจสอบว่าเต็มหรือไม่
      await prisma.registerActivities.delete({
        where: { studentId_activityId: { studentId, activityId } },
      });
      return res.status(200).json({ registered: false, message: "ยกเลิกการลงทะเบียนเรียบร้อย" });
    }

    // ตรวจสอบกิจกรรมที่ชนกันตามวันและเวลา
    const conflicting = await prisma.registerActivities.findFirst({
      where: {
        studentId,
        activity: {
          date: activity.date,
          AND: [
            { start_time: { lt: activity.end_time } },
            { end_time: { gt: activity.start_time } },
          ],
        },
      },
      include: {
        activity: true,
      },
    });

    if (conflicting) {
      return res.status(400).json({
        registered: false,
        message: `คุณมีการลงทะเบียนกิจกรรม "${conflicting.activity.title}" ในช่วงเวลาเดียวกันแล้ว`,
      });
    }

    // ตรวจสอบว่ากิจกรรมเต็มหรือไม่ (max_participants = 999 คือไม่จำกัด)
    if (activity.max_participants !== 999 && activity._count.RegisterActivities >= activity.max_participants) {
      return res.status(400).json({ registered: false, message: "จำนวนผู้เข้าร่วมเต็มแล้ว" });
    }

    // ลงทะเบียนใหม่
    await prisma.registerActivities.create({
      data: { studentId, activityId },
    });

    return res.status(200).json({ registered: true, message: "ลงทะเบียนเรียบร้อย" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default withAuth(handler, ["student"]);
