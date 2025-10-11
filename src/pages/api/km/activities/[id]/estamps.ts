// pages/api/km/activities/[id]/estamps.ts
import type {  NextApiResponse } from "next";
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id } = req.query;
  const activityId = parseInt(Array.isArray(id) ? id[0] : id || "", 10);
  if (isNaN(activityId)) {
    return res.status(400).json({ error: "Invalid activity id" });
  }

  try {
    // ดึง EStamp ทั้งหมดของ activity พร้อม student และ staff
    const estamps = await prisma.eStamp.findMany({
      where: { activityId },
      include: {
        student: true, // Students
        staff: true, // Staffs
      },
      orderBy: { issued_at: "desc" },
    });

    // คำนวณสรุปของ rating
    const ratingCounts: Record<string, number> = {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
    };
    let ratingSum = 0;
    let ratingCounted = 0;

    const feedbacks: {
      id: number;
      studentId: number;
      studentName: string;
      rating?: number | null;
      feedback?: string | null;
      issued_at: string;
    }[] = [];

    estamps.forEach((e) => {
      if (e.rating !== null && e.rating !== undefined) {
        const r = e.rating;
        if (r >= 1 && r <= 5) {
          ratingCounts[String(r)] = (ratingCounts[String(r)] || 0) + 1;
          ratingSum += r;
          ratingCounted += 1;
        }
      }
      if (e.feedback) {
        feedbacks.push({
          id: e.id,
          studentId: e.studentId,
          studentName: `${e.student.first_name} ${e.student.last_name}`,
          rating: e.rating,
          feedback: e.feedback,
          issued_at: e.issued_at.toISOString(),
        });
      }
    });

    const averageRating = ratingCounted > 0 ? ratingSum / ratingCounted : null;

    // เตรียมข้อมูล table ของ EStamp (map ชื่อนักเรียน)
    const estampRows = estamps.map((e) => ({
      id: e.id,
      studentId: e.studentId,
      studentName: `${e.student.first_name} ${e.student.last_name}`,
      email: e.student.email,
      phone: e.student.phone,
      stampBy: e.stampBy,
      stampedByName: e.staff ? `${e.staff.username ?? ""}`.trim() : null,
      issued_at: e.issued_at.toISOString(),
      rating: e.rating,
      feedback: e.feedback,
    }));

    return res.status(200).json({
      estamps: estampRows,
      surveySummary: {
        ratingCounts,
        averageRating,
        ratingCounted,
        feedbacks, // already filtered with non-null feedbacks
      },
    });
  } catch (error) {
    console.error("estamps api error:", error);
    return res.status(500).json({ error: "Server error" });
  } finally {
    // don't disconnect prisma in lambda-like environments to allow pooling; if you prefer, remove this.
    // await prisma.$disconnect();
  }
}


export default withAuth(handler, ["kmuser"]); 