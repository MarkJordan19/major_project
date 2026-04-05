import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/users";
import { verifyPassword, generateToken } from "@/lib/auth";
import { withCORS, handlePreflight } from "@/lib/cors";

export async function OPTIONS(request: Request) {
  return handlePreflight(request);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      const res = NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
      return withCORS(request, res);
    }

    const user = await getUserByEmail(email);

    if (!user) {
      const res = NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
      return withCORS(request, res);
    }

    if (user.role !== "admin") {
      const res = NextResponse.json(
        { success: false, message: "Access denied" },
        { status: 403 }
      );
      return withCORS(request, res);
    }

    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) {
      const res = NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
      return withCORS(request, res);
    }

    // Create JWT
    const token = generateToken({
      user_id: user.user_id,
      role: user.role,
    });

    // Set HttpOnly cookie
    const response = NextResponse.json({
      success: true,
      message: "Admin login successful",
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return withCORS(request, response);

  } catch (error) {
    console.error(error);

    const res = NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );

    return withCORS(request, res);
  }
}