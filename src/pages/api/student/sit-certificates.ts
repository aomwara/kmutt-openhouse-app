import type { NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const studentId = req.user.id;

    if (!studentId) {
      return res.status(400).json({ error: "Missing student ID" });
    }

    // 🔹 ดึงรายการ certificate จาก table SITCert
    const certs = await prisma.sITCert.findMany({
      where: { studentId },
      select: { certName: true },
      orderBy: { certName: "asc" },
    });

    return res.status(200).json({
      studentId,
      certificates: certs.map((c) => ({
        certName: c.certName,
        downloadUrl: `https://openhouse.kmutt.ac.th/sit-certificate/${c.certName}.pdf`,
      })),
    });
  } catch (error) {
    console.error("Error fetching SIT certificates:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default withAuth(handler, ["student"]);
