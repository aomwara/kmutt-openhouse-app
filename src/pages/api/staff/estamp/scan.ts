// /pages/api/staff/estamp/scan.ts
import { PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard";

const prisma = new PrismaClient()

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" })

  try {
    const { uuid, activityId } = req.body
    const staffId = req.user.id // ดึงจาก session staff ที่ login

    if (!uuid || !activityId) return res.status(400).json({ message: "Missing parameters" })

    // หา student จาก uuid
    const student = await prisma.students.findUnique({ where: { uuid } })
    if (!student) return res.status(404).json({ message: "Student not found" })

    // ตรวจสอบว่าเคยสแกนแล้วหรือยัง
    const existing = await prisma.eStamp.findFirst({
      where: { studentId: student.id, activityId: Number(activityId) },
    })
    if (existing)
      return res.status(400).json({ message: "นักเรียนคนนี้ได้รับ Stamp แล้ว" })

    // บันทึกลงฐานข้อมูล
    const newStamp = await prisma.eStamp.create({
      data: {
        studentId: student.id,
        activityId: Number(activityId),
        stampBy: staffId,
      },
      include: {
        student: true,
      },
    })

    return res.status(200).json({
      message: "Stamp success",
      data: newStamp,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export default withAuth(handler, ["staff"]);
