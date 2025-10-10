
import { PrismaClient } from "@prisma/client"
import { withAuth } from "@/libs/authGuard"

const prisma = new PrismaClient()

export default withAuth(async function handler(req, res) {
  const { query } = req.query
  if (!query) return res.status(400).json({ error: "Missing query" })

  const students = await prisma.students.findMany({
    where: {
      role: "student",
      email: { contains: String(query), },
    },
    select: { id: true, first_name: true, last_name: true, email: true },
    take: 20,
  })

  res.status(200).json({ students })
}, ["staff"])
