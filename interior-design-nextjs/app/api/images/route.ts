import { NextResponse } from "next/server";
import {
  createImage,
  getAllImages,
  getImagesByProject,
  getImagesByRoom,
} from "@/lib/designImages";
import { requireAdmin } from "@/lib/requireAdmin";
import { roomBelongsToProject } from "@/lib/rooms";
import { withCORS, handlePreflight } from "@/lib/cors";

export async function OPTIONS(request: Request) {
  return handlePreflight(request);
}

/* GET /api/images — public, supports ?project_id=N and ?room_id=N filters */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectIdParam = searchParams.get("project_id");
    const roomIdParam = searchParams.get("room_id");

    let images;

    if (roomIdParam !== null) {
      const roomId = Number(roomIdParam);
      if (Number.isNaN(roomId)) {
        const res = NextResponse.json(
          { success: false, message: "Invalid room_id" },
          { status: 400 }
        );
        return withCORS(request, res);
      }
      images = await getImagesByRoom(roomId);
    } else if (projectIdParam !== null) {
      const projectId = Number(projectIdParam);
      if (Number.isNaN(projectId)) {
        const res = NextResponse.json(
          { success: false, message: "Invalid project_id" },
          { status: 400 }
        );
        return withCORS(request, res);
      }
      images = await getImagesByProject(projectId);
    } else {
      images = await getAllImages();
    }

    const res = NextResponse.json({ success: true, images });
    return withCORS(request, res);
  } catch (error) {
    console.error("GET /api/images error:", error);
    const res = NextResponse.json(
      { success: false, message: "Failed to fetch images" },
      { status: 500 }
    );
    return withCORS(request, res);
  }
}

/* POST /api/images — admin only */
export async function POST(request: Request) {
  /* 1. AUTH */
  try {
    await requireAdmin();
  } catch {
    const res = NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
    return withCORS(request, res);
  }

  /* 2. LOGIC */
  try {
    const body = await request.json();
    const { project_id, room_id, image_url, alt_text } = body;

    if (typeof image_url !== "string" || image_url.trim() === "") {
      const res = NextResponse.json(
        { success: false, message: "image_url must be a non-empty string" },
        { status: 400 }
      );
      return withCORS(request, res);
    }

    if (!project_id && !room_id) {
      const res = NextResponse.json(
        { success: false, message: "Either project_id or room_id is required" },
        { status: 400 }
      );
      return withCORS(request, res);
    }

    if (project_id && room_id) {
      const validRelation = await roomBelongsToProject(room_id, project_id);
      if (!validRelation) {
        const res = NextResponse.json(
          {
            success: false,
            message: "room_id does not belong to the given project_id",
          },
          { status: 400 }
        );
        return withCORS(request, res);
      }
    }

    const imageId = await createImage({
      project_id: project_id ?? null,
      room_id: room_id ?? null,
      image_url: image_url.trim(),
      alt_text: alt_text ?? null,
    });

    const res = NextResponse.json(
      { success: true, image_id: imageId },
      { status: 201 }
    );
    return withCORS(request, res);
  } catch (error) {
    console.error("POST /api/images error:", error);
    const res = NextResponse.json(
      { success: false, message: "Failed to add image" },
      { status: 500 }
    );
    return withCORS(request, res);
  }
}