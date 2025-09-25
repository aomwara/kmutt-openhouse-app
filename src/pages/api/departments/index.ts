import type { NextApiResponse } from "next";
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard";
import { PrismaClient } from "@prisma/client";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    const prisma = new PrismaClient();
    const departments = await prisma.department.findMany({
      select: {
        id: true,
        name_th: true,
        name_en: true,
      },
    });

    return res.status(200).json(departments);
}

export default withAuth(handler, ["kmuser","student"]);
