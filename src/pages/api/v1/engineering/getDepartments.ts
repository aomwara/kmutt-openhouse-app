import { PrismaClient } from "@prisma/client";
import type { NextApiResponse } from "next";
import { withExternalAuth, AuthenticatedRequest } from "@/libs/externalAuthGuard";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const departments = await prisma.department.findMany({
    where:{
        facultyId: 1
    },
    select: {
      id: true,
      name_th: true,
      name_en: true,
      created_at: true,
    },
    orderBy: { id: "asc" },
  });

  const total = await prisma.department.count();

  return res.status(200).json({
    total,
    departments,
  });
}

export default withExternalAuth(handler, ["kmuser"]);
