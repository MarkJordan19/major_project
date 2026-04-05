import { NextResponse } from "next/server";
import { getAllProjects, createProject } from "@/lib/projects";
import { requireAdmin } from "@/lib/requireAdmin";
import { withCORS, handlePreflight } from "@/lib/cors";

export async function OPTIONS(request: Request) {
  return handlePreflight(request);
}

/* GET /api/projects — public */
export async function GET(request: Request) {
  try {
    const projects = await getAllProjects();
    const res = NextResponse.json({ success: true, projects });
    return withCORS(request, res);
  } catch (error) {
    console.error("GET /api/projects error:", error);
    const res = NextResponse.json(
      { success: false, message: "Failed to fetch projects" },
      { status: 500 }
    );
    return withCORS(request, res);
  }
}

/* POST /api/projects — admin only */
export async function POST(request: Request) {
  /* 1. AUTH */
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    const res = NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
    return withCORS(request, res);
  }

  /* 2. PARSE + VALIDATE */
  try {
    const body = await request.json();
    const { title, description, category, location } = body;

    const allowedCategories = ["residential", "commercial", "office"] as const;

    if (typeof title !== "string" || title.trim() === "") {
      const res = NextResponse.json(
        { success: false, message: "title must be a non-empty string" },
        { status: 400 }
      );
      return withCORS(request, res);
    }

    if (typeof category !== "string" || !allowedCategories.includes(category as any)) {
      const res = NextResponse.json(
        {
          success: false,
          message: `category must be one of: ${allowedCategories.join(", ")}`,
        },
        { status: 400 }
      );
      return withCORS(request, res);
    }

    if (description !== undefined && description !== null && typeof description !== "string") {
      const res = NextResponse.json(
        { success: false, message: "description must be a string or null" },
        { status: 400 }
      );
      return withCORS(request, res);
    }

    if (location !== undefined && location !== null && typeof location !== "string") {
      const res = NextResponse.json(
        { success: false, message: "location must be a string or null" },
        { status: 400 }
      );
      return withCORS(request, res);
    }

    /* 3. SERVICE CALL */
    const projectId = await createProject({
      title: title.trim(),
      description: description ?? null,
      category: category as "residential" | "commercial" | "office",
      location: location ?? null,
      created_by: admin.user_id,
    });

    const res = NextResponse.json(
      { success: true, project_id: projectId },
      { status: 201 }
    );
    return withCORS(request, res);
  } catch (error) {
    console.error("POST /api/projects error:", error);
    const res = NextResponse.json(
      { success: false, message: "Failed to create project" },
      { status: 500 }
    );
    return withCORS(request, res);
  }
}