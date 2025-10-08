// /pages/api/staff/estamp/logs.ts
import { PrismaClient } from "@prisma/client"
import type { NextApiResponse } from "next"
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard";

const prisma = new PrismaClient()

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" })

  try {
    const { activityId } = req.query
    const staffId = req.user.id

    const logs = await prisma.eStamp.findMany({
      where: { activityId: Number(activityId), stampBy: staffId },
      include: {
        student: { select: { first_name: true,last_name:true, email: true, school: true, uuid: true } },
      },
      orderBy: { issued_at: "desc" },
    })

    return res.status(200).json(logs)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export default withAuth(handler, ["staff"]);
