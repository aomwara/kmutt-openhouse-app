// pages/api/student/activities/registered.ts
import type { NextApiResponse } from "next";
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const studentId = req.user.id;

        const registrations = await prisma.registerActivities.findMany({
            where: { studentId, activity: { display: true } },
            include: {
                activity: {
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
                },
            },
            orderBy: [
                { activity: { date: "asc" } },
                { activity: { id: "asc" } },
            ],
        });

        const activities = registrations.map((r) => {
            const act = r.activity;
            return {
                id: act.id,
                title: act.title,
                description: act.description,
                date: act.date,
                round: act.round,
                start_time: act.start_time,
                end_time: act.end_time,
                location: act.location,
                point: act.point,
                max_participants: act.max_participants,
                current_register_participants: act._count.RegisterActivities,
                activity_type: act.activity_type,
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
            };
        });

        return res.status(200).json(activities);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export default withAuth(handler, ["student"]);
