// pages/api/student/activities.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { Prisma, PrismaClient } from "@prisma/client"
import { withAuth } from "@/libs/authGuard"

const prisma = new PrismaClient()

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 5
    const skip = (page - 1) * limit
    const search = String(req.query.search || "").trim()

    // Build where condition
    const where: Prisma.ActivitiesWhereInput = { display: true }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
        { department: { name_th: { contains: search } } },
        { department: { name_en: { contains: search } } },
        { department: { faculty: { name_th: { contains: search } } } },
        { department: { faculty: { name_en: { contains: search } } } },
      ]
    }

    // Query activities + count
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
              faculty: {
                select: {
                  id: true,
                  name_th: true,
                  name_en: true,
                },
              },
            },
          },
        },
        orderBy: [{ date: "asc" }, { id: "asc" }],
        skip,
        take: limit,
      }),
      prisma.activities.count({ where }),
    ])

    // Map to frontend format
    const mapped = activities.map((act) => ({
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
    }))

    return res.status(200).json({
      data: mapped,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export default withAuth(handler, ["student"])
