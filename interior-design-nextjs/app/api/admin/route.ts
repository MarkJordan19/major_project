import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { withCORS, handlePreflight } from "@/lib/cors";

export async function OPTIONS(request: Request) {
  return handlePreflight(request);
}

export async function GET(request: Request) {
  try {
    const admin = await requireAdmin();

    const res = NextResponse.json({
      success: true,
      message: "Admin route working",
      admin_id: admin.user_id,
    });

    return withCORS(request, res);

  } catch (error) {
    if ((error as Error).message === "FORBIDDEN") {
      const res = NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
      return withCORS(request, res);
    }

    const res = NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );

    return withCORS(request, res);
  }
}