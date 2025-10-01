import { PrismaClient, Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { withExternalAuth, AuthenticatedRequest } from "@/libs/externalAuthGuard";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { page = "1", limit = "10", search = "" } = req.query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // ✅ สร้าง where condition
    const where: Prisma.ActivitiesWhereInput = {
      display: true,
      department: {
        facultyId: 1, // filter เฉพาะวิศวะ
      },
    };

    if (search) {
      where.OR = [
        { title: { contains: search as string,  } },
        { description: { contains: search as string,  } },
        { location: { contains: search as string,  } },
        { department: { name_th: { contains: search as string,  } } },
        { department: { name_en: { contains: search as string,  } } },
        { department: { faculty: { name_th: { contains: search as string,  } } } },
        { department: { faculty: { name_en: { contains: search as string,  } } } },
      ];
    }

    // ✅ query กิจกรรม + total
    const [activities, total] = await Promise.all([
      prisma.activities.findMany({
        where,
        include: {
          department: {
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
          },
          _count: {
            select: { RegisterActivities: true },
          },
        },
        skip,
        take: pageSize,
        orderBy: [{ date: "asc" }, { id: "asc" }],
      }),
      prisma.activities.count({ where }),
    ]);

    return res.status(200).json({
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      activities: activities.map((act) => ({
        id: act.id,
        title: act.title,
        description: act.description,
        date: act.date,
        start_time: act.start_time,
        end_time: act.end_time,
        location: act.location,
        point: act.point,
        max_participants: act.max_participants,
        current_register_participants: act._count.RegisterActivities,
        department: act.department,
        faculty: act.department.faculty,
        display: act.display,
      })),
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default withExternalAuth(handler, ["kmuser"]);
