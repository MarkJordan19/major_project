import { NextResponse } from "next/server";
import { createEnquiry, getAllEnquiries } from "@/lib/enquiries";
import { requireAdmin } from "@/lib/requireAdmin";
import { withCORS, handlePreflight } from "@/lib/cors";

export async function OPTIONS(request: Request) {
  return handlePreflight(request);
}

/* POST /api/enquiries — public */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, project_id } = body;

    if (typeof name !== "string" || name.trim() === "") {
      const res = NextResponse.json(
        { success: false, message: "name must be a non-empty string" },
        { status: 400 }
      );
      return withCORS(request, res);
    }

    if (typeof email !== "string" || email.trim() === "") {
      const res = NextResponse.json(
        { success: false, message: "email must be a non-empty string" },
        { status: 400 }
      );
      return withCORS(request, res);
    }

    if (typeof message !== "string" || message.trim() === "") {
      const res = NextResponse.json(
        { success: false, message: "message must be a non-empty string" },
        { status: 400 }
      );
      return withCORS(request, res);
    }

    const enquiryId = await createEnquiry({
      name: name.trim(),
      email: email.trim(),
      phone: phone ?? null,
      message: message.trim(),
      project_id: project_id ?? null,
    });

    const res = NextResponse.json(
      { success: true, enquiry_id: enquiryId },
      { status: 201 }
    );
    return withCORS(request, res);
  } catch (error) {
    console.error("POST /api/enquiries error:", error);
    const res = NextResponse.json(
      { success: false, message: "Failed to submit enquiry" },
      { status: 500 }
    );
    return withCORS(request, res);
  }
}

/* GET /api/enquiries — admin only */
export async function GET(request: Request) {
  try {
    await requireAdmin();
    const enquiries = await getAllEnquiries();
    const res = NextResponse.json({ success: true, enquiries });
    return withCORS(request, res);
  } catch {
    const res = NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
    return withCORS(request, res);
  }
}
