import type { NextApiResponse } from "next";
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const activities = await prisma.activities.findMany({
      include: {
        department: {
          select: {
            id: true,
            name_en: true,
            name_th: true,
            faculty: {
              select: {
                id: true,
                name_en: true,
                name_th: true,
              },
            },
          },
        },
      },
      where:{ ownerId: req.user.id },
      orderBy: {
        date: "asc",
      },
    });

    const mapped = activities.map((act) => ({
      id: act.id,
      activity_type: act.activity_type,
      title: act.title,
      description: act.description,
      date: act.date,
      round: act.round,
      start_time: act.start_time,
      end_time: act.end_time,
      location: act.location,
      point: act.point,
      form_link: act.form_link,
      image_url: act.image_url,
      stars: act.stars,
      max_participants: act.max_participants,
      current_register_participants: act.current_register_participants,
      created_at: act.created_at,
      department: {
        id: act.department.id,
        name_en: act.department.name_en,
        name_th: act.department.name_th,
      },
      faculty: {
        id: act.department.faculty.id,
        name_en: act.department.faculty.name_en,
        name_th: act.department.faculty.name_th,
      },
    }));


    return res.status(200).json(mapped);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default withAuth(handler, ["kmuser"]);
