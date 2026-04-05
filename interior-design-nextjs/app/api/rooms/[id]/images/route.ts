import { NextResponse } from "next/server";
import { getImagesByRoom } from "@/lib/designImages";
import { withCORS, handlePreflight } from '@/lib/cors';


export async function OPTIONS(request: Request) {
  return handlePreflight(request);
}

//Get images by room
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const roomId = Number(id);

  if (Number.isNaN(roomId)) {
    const res = NextResponse.json(
      { success: false, message: "Invalid room ID" },
      { status: 400 }
    );

    return withCORS(request,res);
  }

  const images = await getImagesByRoom(roomId);
  const res = NextResponse.json({ success: true, images });
  return withCORS(request,res);
}
