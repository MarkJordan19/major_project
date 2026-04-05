import { NextResponse } from "next/server";
import { updateRoom, deleteRoom } from "@/lib/rooms";
import { requireAdmin } from "@/lib/requireAdmin";
import { withCORS, handlePreflight } from '@/lib/cors';


export async function OPTIONS(request: Request) {
  return handlePreflight(request);
}

interface Params {
  params: Promise<{ id: string }>;
}

/* PUT /api/rooms/[id] */
export async function PUT(
  request: Request,
  { params }: Params
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const roomId = Number(id);

    if (Number.isNaN(roomId)) {
      const res = NextResponse.json(
        { success: false, message: "Invalid room ID" },
        { status: 400 }
      );

      return withCORS(request,res);
    }

    const body = await request.json();
    const updated = await updateRoom(roomId, body);

    if (!updated) {
      const res = NextResponse.json(
        { success: false, message: "Nothing to update" },
        { status: 400 }
      );

      return withCORS(request,res);
    }

    const res = NextResponse.json({ success: true });

    return withCORS(request,res);

  } catch {
    const res = NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );

    return withCORS(request,res);
  }
}

/* DELETE /api/rooms/[id] */
export async function DELETE(
  request: Request,
  { params }: Params
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const roomId = Number(id);

    if (Number.isNaN(roomId)) {
      const res = NextResponse.json(
        { success: false, message: "Invalid room ID" },
        { status: 400 }
      );

      return withCORS(request,res);

    }

    const deleted = await deleteRoom(roomId);

    if (!deleted) {
      const res = NextResponse.json(
        { success: false, message: "Room not found" },
        { status: 404 }
      );
      
      return withCORS(request,res);

    }

    const res = NextResponse.json({ success: true });

    return withCORS(request,res);

  } catch {
    const res = NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );

    return withCORS(request, res);

  }
}
