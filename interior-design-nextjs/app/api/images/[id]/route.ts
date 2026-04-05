import { NextResponse } from "next/server";
import { deleteImage } from "@/lib/designImages";
import { requireAdmin } from "@/lib/requireAdmin";
import { withCORS, handlePreflight } from '@/lib/cors';

export async function OPTIONS(request: Request) {
  return handlePreflight(request);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const imageId = Number(id);

    if (Number.isNaN(imageId)) {
      const res = NextResponse.json(
        { success: false, message: "Invalid image ID" },
        { status: 400 }
      );

      return withCORS(request,res);

      
    }

    const deleted = await deleteImage(imageId);

    if (!deleted) {
      const  res=  NextResponse.json(
        { success: false, message: "Image not found" },
        { status: 404 }
      );

      return withCORS(request,res);
    }

    const res = NextResponse.json({ success: true });
    return withCORS(request,res);

  } catch {
    const res =  NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );

    return withCORS(request,res);
    
  }
}
