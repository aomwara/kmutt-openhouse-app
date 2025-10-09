import { PrismaClient } from "@prisma/client"
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard"
import type { NextApiResponse } from "next"

const prisma = new PrismaClient()

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).end()
    return
  }

  const studentId = req.user.id // ดึงจาก token
  const estamps = await prisma.eStamp.findMany({
    where: { studentId },
    include: {
      activity: true,
    },
    orderBy: { issued_at: "desc" },
  })

  res.json(estamps)
}

export default withAuth(handler, ["student"])
