import { NextResponse } from "next/server";
import { getImagesByProject } from "@/lib/designImages";
import { withCORS, handlePreflight } from '@/lib/cors';

export async function OPTIONS(request: Request) {
  return handlePreflight(request);
}

//Gets images by project id
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const projectId = Number(id);

  if (Number.isNaN(projectId)) {
    const res = NextResponse.json(
      { success: false, message: "Invalid project ID" },
      { status: 400 }
    );

    return withCORS(request,res);
  }

  const images = await getImagesByProject(projectId);
  const res = NextResponse.json({ success: true, images });
  return withCORS(request,res);
}
