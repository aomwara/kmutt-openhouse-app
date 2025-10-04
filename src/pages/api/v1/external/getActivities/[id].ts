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
      return res.status(400).json({ message: "Invalid or missing activity id" });
    }

    const activity = await prisma.activities.findUnique({
      where: { id: Number(id), department: { facultyId: 1 } }, 
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
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    return res.status(200).json({
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
    });
  } catch (error) {
    console.error("Error fetching activity by id:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default handler;
