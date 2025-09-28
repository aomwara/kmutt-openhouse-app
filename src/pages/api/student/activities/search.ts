// pages/api/student/activities/search.ts
import type { NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { page = "1", limit = "10", search = "", departments = "", dates = "" } = req.query;

    const pageNumber = Number(page);
    const pageSize = Number(limit);

    const departmentIds: number[] = departments
      ? (departments as string).split(",").map((id) => Number(id))
      : [];

    const dateFilters: string[] = dates ? (dates as string).split(",") : [];

    // Build where condition
    const where: Prisma.ActivitiesWhereInput = { display: true };

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

    if (departmentIds.length > 0) {
      where.departmentId = { in: departmentIds };
    }


    if (dateFilters.length > 0) {
      where.date = { in: dateFilters };
    }

    const skip = (pageNumber - 1) * pageSize;

    const [activities, total] = await Promise.all([
      prisma.activities.findMany({
        where,
        include: {
          _count: { select: { RegisterActivities: true } },
          department: {
            select: {
              id: true,
              name_th: true,
              name_en: true,
              faculty: { select: { id: true, name_th: true, name_en: true } },
            },
          },
        },
        orderBy: [
            { date: "asc" },
            { id: "asc" },
        ],
        skip,
        take: pageSize,
      }),
      prisma.activities.count({ where }),
    ]);

    return res.status(200).json({
      data: activities.map((act) => ({
        id: act.id,
        title: act.title,
        description: act.description,
        date: act.date,
        start_time: act.start_time,
        end_time: act.end_time,
        location: act.location,
        max_participants: act.max_participants,
        current_register_participants: act._count.RegisterActivities,
        point: act.point,
        stars: act.stars,
        form_link: act.form_link,
        image_url: act.image_url,
        round: act.round,
        activity_type: act.activity_type,
        created_at: act.created_at,
        department: {
          id: act.department.id,
          name_th: act.department.name_th,
          name_en: act.department.name_en,
        },
        faculty: {
          id: act.department.faculty.id,
          name_th: act.department.faculty.name_th,
          name_en: act.department.faculty.name_en,
        },
      })),
      meta: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default withAuth(handler, ["student"]);
