// pages/api/km/activities/[id].ts
import type { NextApiResponse } from "next";
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const act = await prisma.activities.findUnique({
        where: { id: Number(id), ownerId: req.user.id },
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
      });

      if (!act) {
        return res.status(404).json({ message: "Activity not found" });
      }

      return res.status(200).json({
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
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  if (req.method === "PUT") {
    try {
      const existing = await prisma.activities.findUnique({
        where: { id: Number(id), ownerId: req.user.id },
      });

      if (!existing) {
        return res.status(404).json({ message: "Activity not found or not authorized" });
      }

      const {
        title,
        description,
        date,
        round,
        start_time,
        end_time,
        location,
        point,
        form_link,
        image_url,
        max_participants,
      } = req.body;

      const updated = await prisma.activities.update({
        where: { id: Number(id) },
        data: {
          title,
          description,
          date,
          round,
          start_time,
          end_time,
          location,
          point,
          form_link,
          image_url,
          max_participants,
        },
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
      });

      return res.status(200).json({
        id: updated.id,
        activity_type: updated.activity_type,
        title: updated.title,
        description: updated.description,
        date: updated.date,
        round: updated.round,
        start_time: updated.start_time,
        end_time: updated.end_time,
        location: updated.location,
        point: updated.point,
        form_link: updated.form_link,
        image_url: updated.image_url,
        stars: updated.stars,
        max_participants: updated.max_participants,
        current_register_participants: updated.current_register_participants,
        created_at: updated.created_at,
        department: {
          id: updated.department.id,
          name_en: updated.department.name_en,
          name_th: updated.department.name_th,
        },
        faculty: {
          id: updated.department.faculty.id,
          name_en: updated.department.faculty.name_en,
          name_th: updated.department.faculty.name_th,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to update activity" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}

export default withAuth(handler, ["kmuser"]);
