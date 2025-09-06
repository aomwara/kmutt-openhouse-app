import { PrismaClient } from "@prisma/client";
import type { NextApiResponse } from "next";
import { withExternalAuth, AuthenticatedRequest } from "@/libs/externalAuthGuard";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Missing or invalid student id" });
  }

  const studentId = parseInt(id, 10);
  if (isNaN(studentId)) {
    return res.status(400).json({ error: "Student id must be a number" });
  }

  const student = await prisma.students.findUnique({
    where: { id: studentId },
    select: {
      first_name: true,
      last_name: true,
      school: true,
      province: true,
      email: true,
      phone: true,
      created_at: true,
      
    },
  });

  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  return res.status(200).json(student);
}

export default withExternalAuth(handler, ["staff"]);
