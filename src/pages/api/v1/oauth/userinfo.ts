// pages/api/v1/oauth/userinfo.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface JwtPayload {
  studentId: number;
  iat?: number;
  exp?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const student = await prisma.students.findUnique({
      where: { id: payload.studentId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        school: true,
        province: true,
      },
    });

    if (!student) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(student);
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
