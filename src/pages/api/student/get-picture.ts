// src/pages/api/student/get-picture.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard"

const prisma = new PrismaClient()

export default withAuth(async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "GET") res.status(405).end()

  try {
    // ดึงรูปทั้งหมดของนักเรียนที่ login
    const pictures = await prisma.takePicture.findMany({
      where: {
        studentId: req.user.id,
      },
      orderBy: { taken_at: "desc" },
    })

    // map เป็น logs สำหรับ frontend
    const logs = pictures.map(pic => ({
      id: pic.id,
      image_url: pic.image_url,
      taken_at: pic.taken_at,
    }))

    res.status(200).json({ logs })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: (err as Error).message })
  }
}, ["student"])
