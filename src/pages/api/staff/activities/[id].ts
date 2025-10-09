import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query

    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" })
    }

    try {
        const activity = await prisma.activities.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                title: true,
                location: true,
                start_time: true,
                end_time: true,
                description: true,
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
        })

        if (!activity) return res.status(404).json({ message: "Activity not found" })

        // map registerActivities เพิ่ม field stamped
        const registerWithStamp = await Promise.all(
            activity.RegisterActivities.map(async (r) => {
                const stamped = await prisma.eStamp.findFirst({
                    where: {
                        studentId: r.studentId,
                        activityId: r.activityId,
                    },
                })

                return {
                    ...r,
                    stamped: !!stamped, // true ถ้ามี
                }
            })
        )

        return res.status(200).json({
            ...activity,
            RegisterActivities: registerWithStamp,
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Server error" })
    }
}
