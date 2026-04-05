import { NextResponse } from "next/server";
import {
getProjectById,
updateProject,
deleteProject
} from "@/lib/projects";
import { requireAdmin } from "@/lib/requireAdmin";
import { withCORS, handlePreflight } from "@/lib/cors";

export async function OPTIONS(request: Request) {
return handlePreflight(request);
}

interface Params {
params: Promise<{ id: string }>;
}

/* GET /api/projects/[id] */
export async function GET(
request: Request,
{ params }: Params
) {
try {
const { id } = await params;
console.log("RAW ID:", id);

const projectId = Number(id);
if (Number.isNaN(projectId)) {
  const res = NextResponse.json(
    { success: false, message: "Invalid project ID" },
    { status: 400 }
  );
  return withCORS(request, res);
}

const project = await getProjectById(projectId);

if (!project) {
  const res = NextResponse.json(
    { success: false, message: "Project not found" },
    { status: 404 }
  );
  return withCORS(request, res);
}

const res = NextResponse.json({ success: true, data: project });
return withCORS(request, res);


} catch (error: any) {
  console.error("GET /projects/[id] error:", error);

  const res = NextResponse.json(
    { success: false, message: error?.message || "Failed to fetch project" },
    { status: 500 }
  );
  return withCORS(request, res);
}
}

/* PUT /api/projects/[id] */
export async function PUT(
request: Request,
{ params }: Params
) {
try {
await requireAdmin();
const { id } = await params;


const projectId = Number(id);
if (Number.isNaN(projectId)) {
  const res = NextResponse.json(
    { success: false, message: "Invalid project ID" },
    { status: 400 }
  );
  return withCORS(request, res);
}

const body = await request.json();
const updated = await updateProject(projectId, body);

if (!updated) {
  const res = NextResponse.json(
    { success: false, message: "Nothing to update" },
    { status: 400 }
  );
  return withCORS(request, res);
}

const res = NextResponse.json({ success: true });
return withCORS(request, res);


} catch {
const res = NextResponse.json(
{ success: false, message: "Unauthorized" },
{ status: 401 }
);
return withCORS(request, res);
}
}

/* DELETE /api/projects/[id] */
export async function DELETE(
request: Request,
{ params }: Params
) {
try {
await requireAdmin();
const { id } = await params;


const projectId = Number(id);
if (Number.isNaN(projectId)) {
  const res = NextResponse.json(
    { success: false, message: "Invalid project ID" },
    { status: 400 }
  );
  return withCORS(request, res);
}

const deleted = await deleteProject(projectId);

if (!deleted) {
  const res = NextResponse.json(
    { success: false, message: "Project not found" },
    { status: 404 }
  );
  return withCORS(request, res);
}

const res = NextResponse.json({ success: true });
return withCORS(request, res);


} catch {
const res = NextResponse.json(
{ success: false, message: "Unauthorized" },
{ status: 401 }
);
return withCORS(request, res);
}
}
