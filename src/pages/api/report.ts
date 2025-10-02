// pages/api/report.ts
import { PrismaClient, Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

// ----------------- censor utils -----------------
function censorText(text: string) {
  if (!text) return "";
  if (text.length <= 3) return text[0] + "*".repeat(text.length - 1);
  return text.slice(0, 3) + "*".repeat(text.length - 3);
}
function censorEmail(email: string) {
  if (!email.includes("@")) return censorText(email);
  const [name, domain] = email.split("@");
  return censorText(name) + "@" + domain;
}
function censorPhone(phone: string) {
  if (!phone) return "";
  return phone.replace(/^(\d{2})\d+(\d{2})$/, (_, a, b) => `${a}****${b}`);
}

// ----------------- API handler -----------------
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { departmentId, date } = req.query;

    if (!departmentId || !date) {
      return res.status(400).json({ message: "Missing departmentId or date" });
    }

    // ✅ กำหนด type ให้ชัดเจน
    const where: Prisma.ActivitiesWhereInput = {
      departmentId: Number(departmentId),
      display: true,
    };

    if (date !== "all") {
      where.date = date as string;
    }

    const activities = await prisma.activities.findMany({
      where,
      orderBy: [{ date: "asc" }, { start_time: "asc" }],
      include: {
        RegisterActivities: {
          include: {
            student: true,
          },
        },
      },
    });

    const data = activities.map((act) => ({
      id: act.id,
      title: act.title,
      date: act.date,
      start_time: act.start_time,
      end_time: act.end_time,
      location: act.location,
      activity_type: act.activity_type,
      max_participants: act.max_participants,
      point: act.point,
      participants: act.RegisterActivities.map((reg) => ({
        id: reg.student.id,
        name:
          censorText(reg.student.first_name) +
          " " +
          censorText(reg.student.last_name),
        email: censorEmail(reg.student.email),
        phone: censorPhone(reg.student.phone ?? ""),
      })),
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
