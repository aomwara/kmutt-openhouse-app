import type { NextApiResponse } from "next";
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard";
import { PrismaClient } from "@prisma/client";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    const prisma = new PrismaClient();
    const student = await prisma.students.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
      school: true,
      province: true,
      created_at: true,
    },
  });

    return res.status(200).json(student);
}

export default withAuth(handler, ["student"]);
