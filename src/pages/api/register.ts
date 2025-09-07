import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { first_name, last_name, school, province, email, phone, password, citizen_id } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.students.create({
      data: {
        first_name,
        last_name,
        citizen_id,
        school,
        province,
        email,
        phone,
        password_hash: hashedPassword
      }
    });

    res.status(200).json({ message: "Registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error registering" });
  }
}
