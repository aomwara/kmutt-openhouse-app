// pages/api/v1/oauth/token.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { grant_type, code, client_id, client_secret, redirect_uri } = req.body;

  if (grant_type !== "authorization_code") return res.status(400).send("Invalid grant_type");

  // ตรวจสอบ code
  const authCode = await prisma.oAuthCode.findUnique({ where: { code } });
  if (!authCode) return res.status(400).send("Invalid code");

  // ตรวจสอบ client
  const client = await prisma.oAuthClient.findUnique({ where: { client_id } });
  if (!client || client.client_secret !== client_secret) return res.status(401).send("Invalid client");

  // สร้าง access_token
  const access_token = Math.random().toString(36).substring(2, 20);

  await prisma.oAuthToken.create({
    data: {
      access_token,
      studentId: authCode.studentId,
      clientId: client_id,
      expires_at: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  res.json({
    access_token,
    token_type: "bearer",
    expires_in: 3600,
  });
}
