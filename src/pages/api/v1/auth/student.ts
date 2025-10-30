import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const EXTERNAL_JWT_SECRET = process.env.EXTERNAL_JWT_SECRET!;

type LoginBody = {
  email: string;
  password: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body as LoginBody;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  const student = await prisma.students.findUnique({
    where: { email },
  });

  if (!student) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isValid = await bcrypt.compare(password, student.password_hash);
  if (!isValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const payload = {
    id: student.id,
    role: "student",
    name: student.first_name + " " + student.last_name,
    school: student.school,
    province: student.province,
    uuid: student.uuid,
    citizen_id: student.citizen_id,
    phone: student.phone,
    email: student.email,
  };

  const accessToken = jwt.sign(payload, EXTERNAL_JWT_SECRET, { expiresIn: "1h" });

  return res.status(200).json({ accessToken });
}
