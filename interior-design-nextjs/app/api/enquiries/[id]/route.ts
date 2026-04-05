import { NextResponse } from "next/server";
import { getEnquiryById, deleteEnquiry } from "@/lib/enquiries";
import { requireAdmin } from "@/lib/requireAdmin";
import { withCORS, handlePreflight } from "@/lib/cors";

export async function OPTIONS(request: Request) {
  return handlePreflight(request);
}

interface Params {
  params: Promise<{ id: string }>;
}

/* GET /api/enquiries/[id] — admin only */
export async function GET(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const enquiryId = Number(id);

    if (Number.isNaN(enquiryId)) {
      const res = NextResponse.json(
        { success: false, message: "Invalid enquiry ID" },
        { status: 400 }
      );
      return withCORS(request, res);
    }

    const enquiry = await getEnquiryById(enquiryId);

    if (!enquiry) {
      const res = NextResponse.json(
        { success: false, message: "Enquiry not found" },
        { status: 404 }
      );
      return withCORS(request, res);
    }

    const res = NextResponse.json({ success: true, enquiry });
    return withCORS(request, res);
  } catch {
    const res = NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
    return withCORS(request, res);
  }
}

/* DELETE /api/enquiries/[id] — admin only */
export async function DELETE(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const enquiryId = Number(id);

    if (Number.isNaN(enquiryId)) {
      const res = NextResponse.json(
        { success: false, message: "Invalid enquiry ID" },
        { status: 400 }
      );
      return withCORS(request, res);
    }

    const deleted = await deleteEnquiry(enquiryId);

    if (!deleted) {
      const res = NextResponse.json(
        { success: false, message: "Enquiry not found" },
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
