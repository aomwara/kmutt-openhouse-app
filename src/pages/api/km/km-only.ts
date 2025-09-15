import type { NextApiResponse } from "next";
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const user = req.user; 
  res.status(200).json({ message: "Welcome kmuser!", user });
}

// ใช้ wrapper และกำหนด role
export default withAuth(handler, ["kmuser"]);
