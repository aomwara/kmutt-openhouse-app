// pages/api/staff/my-activity.ts
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard";
import type { NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const staffId = req.user?.id;

  if (!staffId) return res.status(401).json({ message: "Unauthorized" });
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  try {

    console.log(staffId)
    // ขั้นแรก: หา activityId จาก StaffMapping
    const mappings = await prisma.staffMapping.findMany({
      where: { staffId },
      select: { activityId: true },
    });

    console.log("Staff Mappings:", mappings);

    const activityIds = mappings.map((m) => m.activityId);
    if (activityIds.length === 0) return res.status(200).json([]);

    // ขั้นสอง: ดึงรายละเอียด activity จาก Activities
    const activities = await prisma.activities.findMany({
      where: { id: { in: activityIds } },
      include: {
        department: true,
        RegisterActivities: {
          include: {
            student: true,
          },
        },
      },
      orderBy: [
        { date: "asc" },
        { start_time: "asc" },
      ],
    });

    // map RegisterActivities → registrations ให้ frontend ใช้งานง่าย
    const result = activities.map((act) => ({
      ...act,
      registrations: act.RegisterActivities,
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export default withAuth(handler, ["staff"]);
