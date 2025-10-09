import { PrismaClient } from "@prisma/client"
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard"
import type { NextApiResponse } from "next"

const prisma = new PrismaClient()

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id } = req.query
  const studentId = req.user.id

  // ตรวจสอบว่า id เป็นตัวเลข
  const estampId = parseInt(id as string, 10)
  if (isNaN(estampId)) {
    res.status(400).json({ message: "Invalid ID" })
    return
  }

  if (req.method === "GET") {
    // ดึงข้อมูล EStamp รายการเดียว
    const estamp = await prisma.eStamp.findFirst({
      where: {
        id: estampId,
        studentId,
      },
      include: {
        activity: true,
      },
    })

    if (!estamp) {
      res.status(404).json({ message: "EStamp not found" })
      return
    }

    res.json(estamp)
    return
  }

  if (req.method === "PUT") {
    const { rating, feedback } = req.body

    if (rating && (rating < 1 || rating > 5)) {
      res.status(400).json({ message: "Rating must be between 1 and 5" })
      return
    }

    const updated = await prisma.eStamp.updateMany({
      where: {
        id: estampId,
        studentId,
      },
      data: {
        rating,
        feedback,
      },
    })

    if (updated.count === 0) {
      res.status(404).json({ message: "EStamp not found or not authorized" })
      return
    }

    res.json({ message: "Updated successfully" })
    return
  }

  res.status(405).json({ message: "Method not allowed" })
}

export default withAuth(handler, ["student"])
