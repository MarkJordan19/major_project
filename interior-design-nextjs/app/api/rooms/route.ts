import { NextResponse } from "next/server";
import { getAllRooms } from "@/lib/rooms";
import { withCORS, handlePreflight } from "@/lib/cors";

export async function OPTIONS(request: Request) {
  return handlePreflight(request);
}

/* GET /api/rooms — admin only, returns all rooms across all projects */
export async function GET(request: Request) {
  try {
    const rooms = await getAllRooms();
    const res = NextResponse.json({ success: true, rooms });
    return withCORS(request, res);
  } catch (error) {
    console.error("GET /api/rooms error:", error);
    const res = NextResponse.json(
      { success: false, message: "Failed to fetch rooms" },
      { status: 500 }
    );
    return withCORS(request, res);
  }
}
