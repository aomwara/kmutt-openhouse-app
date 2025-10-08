// /pages/api/staff/estamp/[id].ts
import { PrismaClient } from "@prisma/client"
import type { NextApiResponse } from "next"
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard";

const prisma = new PrismaClient()

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id } = req.query
  const staffId = req.user.id

  if (req.method !== "DELETE") return res.status(405).json({ message: "Method not allowed" })

  try {
    const stamp = await prisma.eStamp.findUnique({ where: { id: Number(id) } })
    if (!stamp || stamp.stampBy !== staffId)
      return res.status(404).json({ message: "ไม่พบรายการนี้หรือไม่มีสิทธิ์ลบ" })

    await prisma.eStamp.delete({ where: { id: Number(id) } })
    return res.status(200).json({ message: "ยกเลิกการสแกนสำเร็จ" })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export default withAuth(handler, ["staff"]);
