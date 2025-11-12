import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    // ดึงนักเรียนที่มี EStamp ของคณะเทคโนโลยีสารสนเทศ (facultyId = 4)
    const students = await prisma.students.findMany({
      where: {
        EStamp: {
          some: {
            activity: {
              department: {
                facultyId: 4
              }
            }
          }
        }
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
                facultyId: 4
              }
            }
          },
          select: {
            issued_at: true, // เวลาที่นักเรียน stamp
            activity: {
              select: {
                title: true,
                activity_type: true,
                point: true,
                date: true,
                start_time: true,
                end_time: true
              }
            }
          },
          orderBy: {
            activity: {
              date: "asc"
            }
          }
        }
      }
    });

    // map data ให้อยู่ในรูปแบบที่ frontend ใช้
    const result = students.map((student) => {
      const total_points = student.EStamp.reduce(
        (sum, e) => sum + (e.activity.point ?? 0),
        0
      );

      const activities: Record<string, string | null> = {};
      student.EStamp.forEach((e, idx) => {
        const colName = `activity_${idx + 1}`;
        activities[colName] = `[${e.activity.activity_type}] [${e.activity.point}] ${e.activity.title} (${e.activity.date} ${e.activity.start_time}-${e.activity.end_time})`;
      });

      return {
        student_id: student.id,
        student_name: `${student.first_name} ${student.last_name}`,
        school: student.school,
        province: student.province,
        email: student.email,
        phone: student.phone,
        total_points,
        ...activities
      };
    });

    // sort by total_points desc
    result.sort((a, b) => b.total_points - a.total_points);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withAuth(handler, ["kmuser"]);
