import { NextResponse } from "next/server";
import { getRoomsByProject, createRoom } from "@/lib/rooms";
import { requireAdmin } from "@/lib/requireAdmin";
import { withCORS, handlePreflight } from '@/lib/cors';


export async function OPTIONS(request: Request) {
  return handlePreflight(request);
}

interface Params {
  params: Promise<{ id: string }>;
}

/* GET /api/projects/[id]/rooms */
export async function GET(
  request: Request,
  { params }: Params
) {
  const { id } = await params;
  const projectId = Number(id);

  if (Number.isNaN(projectId)) {
    const res = NextResponse.json(
      { success: false, message: "Invalid project ID" },
      { status: 400 }
    );

    return withCORS(request, res);
  }

  const rooms = await getRoomsByProject(projectId);
  const res = NextResponse.json({ success: true, rooms });
  return withCORS(request,res);
}

/* POST /api/projects/[id]/rooms (admin) */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  /* 1️⃣ AUTHORIZATION (only auth here) */
  try {
    await requireAdmin();
  } catch {
    const res = NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );

    return withCORS(request,res);

  }

  /* 2️⃣ INPUT + BUSINESS LOGIC */
  try {
    const { id } = await params;
    const projectId = Number(id);

    if (Number.isNaN(projectId)) {
      const res = NextResponse.json(
        { success: false, message: "Invalid project ID" },
        { status: 400 }
      );

      return withCORS(request,res);
    }

    const body = await request.json();
    const { room_type, description } = body;

    if (!room_type) {
      const res = NextResponse.json(
        { success: false, message: "room_type is required" },
        { status: 400 }
      );

      return withCORS(request,res);
    }

    const allowedRoomTypes = [
      "living",
      "bedroom",
      "kitchen",
      "bathroom",
      "office",
      "other"
    ] as const;

    if (!allowedRoomTypes.includes(room_type)) {
      const res = NextResponse.json(
        { success: false, message: "Invalid room_type" },
        { status: 400 }
      );

      return withCORS(request,res);
    }

    const roomId = await createRoom(
      projectId,
      room_type,
      description ?? null
    );

    const res = NextResponse.json(
      {
        success: true,
        room_id: roomId
      },
      { status: 201 }
    );

    return withCORS(request,res)

  } catch (error) {
    console.error("Create room error:", error);

    const res = NextResponse.json(
      { success: false, message: "Failed to create room" },
      { status: 500 }
    );

    return withCORS(request,res)
  }
}
