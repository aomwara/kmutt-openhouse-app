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
            name: true,
            faculty: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    const mapped = activities.map((act) => ({
      id: act.id,
      title: act.title,
      description: act.description,
      date: act.date,
      location: act.location,
      created_at: act.created_at,
      max_participants: act.max_participants,
      activity_type: act.activity_type,
      department: {
        id: act.department.id,
        name: act.department.name,
      },
      faculty: {
        id: act.department.faculty.id,
        name: act.department.faculty.name,
      },
    }));

    return res.status(200).json(mapped);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default withAuth(handler, ["kmuser"]);
