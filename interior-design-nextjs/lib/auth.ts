import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

// export async function verifyPassword(
//   plainPassword: string,
//   hashedPassword: string
// ): Promise<boolean> {
//   return bcrypt.compare(plainPassword, hashedPassword);
// }

console.log("JWT_SECRET loaded:", process.env.JWT_SECRET);

interface JwtPayload {
  user_id: number;
  role: "admin" | "customer";
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h"
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
