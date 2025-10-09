import { PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const {
        participantType,
        educationLevel,
        interestLevel,
        preferredFaculty,
        infoChannels,
        factors,
        creditTransferInterest,
        teachingMode,
        confusionRanking,
        interestKMUTT,
      } = req.body

      // แปลง array เป็น CSV string
      const preferredFacultyStr = Array.isArray(preferredFaculty) ? preferredFaculty.join(",") : ""
      const infoChannelsStr = Array.isArray(infoChannels) ? infoChannels.join(",") : ""
      const factorsStr = Array.isArray(factors) ? factors.join(",") : ""
      const confusionRankingStr = Array.isArray(confusionRanking) ? confusionRanking.join(",") : ""

      const survey = await prisma.publicSurvey.create({
        data: {
          participantType,
          educationLevel,
          interestLevel,
          preferredFaculty: preferredFacultyStr,
          infoChannels: infoChannelsStr,
          factors: factorsStr,
          creditTransferInterest: Number(creditTransferInterest) || null,
          teachingMode,
          confusionRanking: confusionRankingStr,
          interestKMUTT,
        },
      })

      return res.status(201).json({ survey })
    } catch (err: unknown) {
      console.error(err)
      return res.status(500).json({ error: (err as Error).message })
    }
  } else if (req.method === "GET") {
    // ดึงข้อมูลทั้งหมด สำหรับสรุปผล
    try {
      const surveys = await prisma.publicSurvey.findMany({ orderBy: { createdAt: "desc" } })
      return res.status(200).json({ surveys })
    } catch (err: unknown) {
      console.error(err)
      return res.status(500).json({ error: (err as Error).message })
    }
  } else {
    return res.status(405).end()
  }
}
