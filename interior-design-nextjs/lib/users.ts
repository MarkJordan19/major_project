import { query } from "@/lib/db";

export interface User {
  user_id: number;
  name: string;
  email: string;
  password_hash: string;
  role: "admin" | "customer";
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await query<User[]>(
    "SELECT user_id, name, email, password_hash, role FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  return result.length > 0 ? result[0] : null;
}