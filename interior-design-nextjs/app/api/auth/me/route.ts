import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { withCORS, handlePreflight } from "@/lib/cors";
import { query } from "@/lib/db";

export async function OPTIONS(request: Request) {
  return handlePreflight(request);
}

export async function GET(request: Request) {
  const noCacheHeaders = {
    "Cache-Control": "no-store",
    "Pragma": "no-cache",
    "Expires": "0",
  };

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      const res = NextResponse.json(
        { error: "No token" },
        { status: 401, headers: noCacheHeaders }
      );
      return withCORS(request, res);
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      user_id: number;
      role: string;
    };

    //  Fetch fresh user data from DB
    const users = await query<any[]>(
      "SELECT user_id, name, email, role FROM users WHERE user_id = ? LIMIT 1",
      [decoded.user_id]
    );

    if (users.length === 0) {
      const res = NextResponse.json(
        { error: "User not found" },
        { status: 404, headers: noCacheHeaders }
      );
      return withCORS(request, res);
    }

    const res = NextResponse.json(
      { user: users[0] },
      { status: 200, headers: noCacheHeaders }
    );

    return withCORS(request, res);

  } catch (error) {
    console.error("JWT ERROR:", error);

    const res = NextResponse.json(
      { error: "Invalid token" },
      { status: 401, headers: noCacheHeaders }
    );

    return withCORS(request, res);
  }
}