import type { NextApiResponse } from "next";
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard";
import { PrismaClient } from "@prisma/client";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    const prisma = new PrismaClient();
    const guest = await prisma.students.findUnique({
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

    return res.status(200).json(guest);
}

export default withAuth(handler, ["guest", "teacher", "parent"]);
