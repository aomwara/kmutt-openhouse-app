import { PrismaClient } from "@prisma/client";
import type { NextApiResponse } from "next";
import { withExternalAuth, AuthenticatedRequest } from "@/libs/externalAuthGuard";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid or missing department id" });
    }

    const activities = await prisma.activities.findMany({
      where: { departmentId: Number(id) },
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
        RegisterActivities: {
          include: {
            student: {
              // select: {
              //   id: true,
              //   first_name: true,
              //   last_name: true,
              //   email: true,
              //   phone: true,
              // },
            },
          },
        },
      },
    });

    if (!activities || activities.length === 0) {
      return res.status(404).json({ message: "No activities found for this department" });
    }

    return res.status(200).json(
      activities.map((activity) => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        date: activity.date,
        start_time: activity.start_time,
        end_time: activity.end_time,
        location: activity.location,
        point: activity.point,
         max_participants: activity.max_participants == 999 ? "unlimited" : activity.max_participants,
        display: activity.display,
        department: activity.department,
        faculty: activity.department.faculty,
        // registrations: activity.RegisterActivities.map((reg) => ({
        //   id: reg.id,
        //   registered_at: reg.registered_at,
        //   student: reg.student,
        // })),
        total_registrations: activity.RegisterActivities.length,
      }))
    );
  } catch (error) {
    console.error("Error fetching activities by department id:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default handler;
