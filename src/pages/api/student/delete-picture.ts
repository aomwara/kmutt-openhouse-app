import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard"

const prisma = new PrismaClient()

export default withAuth(async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== "DELETE") res.status(405).end()

    try {
        const id = Number(req.query.id)
        if (!id) return res.status(400).json({ error: "Missing id" })

        // ตรวจสอบว่าเป็นรูปของ user ตัวเอง
        const picture = await prisma.takePicture.findUnique({ where: { id } })
        if (!picture) return res.status(404).json({ error: "Picture not found" })
        if (picture.studentId !== req.user.id) return res.status(403).json({ error: "Unauthorized" })

        await prisma.takePicture.delete({ where: { id } })

        res.status(200).json({ message: "Deleted successfully" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: (err as Error).message })
    }
}, ["student"])
