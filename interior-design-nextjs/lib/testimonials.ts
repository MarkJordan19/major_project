import { query } from "@/lib/db";

export interface Testimonial {
  testimonial_id: number;
  client_name: string | null;
  content: string;
  rating: number | null;
  created_at: string;
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  return await query<Testimonial[]>(
    `SELECT testimonial_id, client_name, content, rating, created_at
     FROM testimonials
     ORDER BY created_at DESC`
  );
}

export async function getTestimonialById(
  testimonialId: number
): Promise<Testimonial | null> {
  const rows = await query<Testimonial[]>(
    `SELECT testimonial_id, client_name, content, rating, created_at
     FROM testimonials
     WHERE testimonial_id = ?`,
    [testimonialId]
  );

  return rows.length ? rows[0] : null;
}

export async function createTestimonial(data: {
  client_name?: string | null;
  content: string;
  rating?: number | null;
}): Promise<number> {
  const result = await query<any>(
    `INSERT INTO testimonials (client_name, content, rating)
     VALUES (?, ?, ?)`,
    [data.client_name ?? null, data.content, data.rating ?? null]
  );

  return result.insertId;
}

export async function deleteTestimonial(
  testimonialId: number
): Promise<boolean> {
  const result = await query<any>(
    `DELETE FROM testimonials WHERE testimonial_id = ?`,
    [testimonialId]
  );

  return result.affectedRows > 0;
}
