import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export interface AdminSession {
  user_id: number;
  role: "admin";
}

export async function requireAdmin(): Promise<AdminSession> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  try {
    const payload = verifyToken(token);

    if (payload.role !== "admin") {
      throw new Error("FORBIDDEN");
    }

    return {
      user_id: payload.user_id,
      role: payload.role
    };
  } catch {
    throw new Error("UNAUTHORIZED");
  }
}
