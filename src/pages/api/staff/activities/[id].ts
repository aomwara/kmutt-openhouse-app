import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query

    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" })
    }

    try {
        const activity = await prisma.activities.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                title: true,
                location: true,
                start_time: true,
                end_time: true,
                description: true,
            },
        })

        if (!activity) return res.status(404).json({ message: "Activity not found" })

        return res.status(200).json(activity)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Server error" })
    }
}
