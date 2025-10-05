import type { NextApiResponse } from "next";
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard";
import { PrismaClient } from "@prisma/client";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    const prisma = new PrismaClient();
    const staff  = await prisma.staffs.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
    },
  });

    return res.status(200).json(staff);
}

export default withAuth(handler, ["staff"]);
