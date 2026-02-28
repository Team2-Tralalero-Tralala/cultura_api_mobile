import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface JwtPayload {
  userId: number;
  username: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
/**
 * คำอธิบาย: ตรวจสอบ token จาก cookie หรือ header
 */
export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  const token = req.cookies?.token || authHeader?.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    return res.sendStatus(403);
  }
}
