import { NextResponse } from "next/server";
import { deleteTestimonial } from "@/lib/testimonials";
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
    const testimonialId = Number(id);

    if (Number.isNaN(testimonialId)) {
      const res = NextResponse.json(
        { success: false, message: "Invalid testimonial ID" },
        { status: 400 }
      );

      return withCORS(request,res);
    }

    const deleted = await deleteTestimonial(testimonialId);

    if (!deleted) {
      const res = NextResponse.json(
        { success: false, message: "Testimonial not found" },
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

    return withCORS(request,res);
  }
}
