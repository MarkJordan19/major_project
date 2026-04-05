export interface Testimonial {
  testimonial_id: number;
  client_name: string | null;
  content: string;
  rating: number | null;
  created_at: string;
}

export type CreateTestimonialPayload = Omit<Testimonial, "testimonial_id" | "created_at">;
