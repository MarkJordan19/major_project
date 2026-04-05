import { NextResponse } from "next/server";
import {
  getAllTestimonials,
  createTestimonial
} from "@/lib/testimonials";
import { requireAdmin } from "@/lib/requireAdmin";
import { withCORS, handlePreflight } from '@/lib/cors';

export async function OPTIONS(request: Request) {
  return handlePreflight(request);
}


/* GET /api/testimonials (public) */
export async function GET(request: Request) {
  const testimonials = await getAllTestimonials();
  const res = NextResponse.json({ success: true, testimonials });

  return withCORS(request,res)
}

/* POST /api/testimonials (admin only) */
export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    const res = NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );

    return withCORS(request,res);
  }

  try {
    const body = await request.json();
    const { client_name, content, rating } = body;

    if (!content) {
      const res = NextResponse.json(
        { success: false, message: "content is required" },
        { status: 400 }
      );

      return withCORS(request,res);
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      const res = NextResponse.json(
        { success: false, message: "rating must be between 1 and 5" },
        { status: 400 }
      );

      return withCORS(request,res);

    }

    const testimonialId = await createTestimonial({
      client_name,
      content,
      rating
    });

    const res = NextResponse.json(
      { success: true, testimonial_id: testimonialId },
      { status: 201 }
    );

    return withCORS(request,res);

  } catch (error) {
    console.error("Create testimonial error:", error);
    const res = NextResponse.json(
      { success: false, message: "Failed to create testimonial" },
      { status: 500 }
    );

    return withCORS(request,res);
  }
}
