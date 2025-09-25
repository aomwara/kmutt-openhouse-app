import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const EXTERNAL_JWT_SECRET = process.env.EXTERNAL_JWT_SECRET!;

export type PayloadJWT = {
  id: number;                    
  role: "student" | "staff" | "admin" | "kmuser" | "parent" | "guest" | "teacher";
  name?: string;
  email?: string;
  iat?: number;
  exp?: number;
};

export interface AuthenticatedRequest extends NextApiRequest {
  user: {
    id: number;                   
    role: "student" | "staff" | "admin" | "kmuser" | "parent" | "guest" | "teacher";
    name?: string;
    email?: string;
  };
}

export function withExternalAuth(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => void | Promise<void>,
  roles: ("student" | "staff" | "admin" | "kmuser" | "parent" | "guest" | "teacher")[] = []
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization header incorrect" });
    }

    const token = authHeader.split(" ")[1];

    let payload: PayloadJWT;
    try {
      payload = jwt.verify(token, EXTERNAL_JWT_SECRET) as PayloadJWT;
    } catch {
      return res.status(401).json({ error: "Token incorrect or expired" });
    }

    if (roles.length > 0 && !roles.includes(payload.role)) {
      return res.status(403).json({ error: `Forbidden: Must be ${roles.join(", ")}` });
    }

    const authReq = req as AuthenticatedRequest;
    authReq.user = {
      id: payload.id,
      role: payload.role,
      name: payload.name,
      email: payload.email,
    };

    return handler(authReq, res);
  };
}
