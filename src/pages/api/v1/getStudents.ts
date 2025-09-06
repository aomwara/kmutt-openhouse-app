import { PrismaClient } from "@prisma/client";
import type { NextApiResponse } from "next";
import { withExternalAuth, AuthenticatedRequest } from "@/libs/externalAuthGuard";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const page = parseInt((req.query.page as string) || "1");
  const limit = parseInt((req.query.limit as string) || "10");

  const skip = (page - 1) * limit;

  const students = await prisma.students.findMany({
    select: {
      id: true,
      first_name: true,
      last_name: true,
      school: true,
      province: true,
    },
    skip,
    take: limit,
    orderBy: { id: "asc" }, 
  });

  const total = await prisma.students.count();

  return res.status(200).json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    students,
  });
}

export default withExternalAuth(handler, ["staff"]);
