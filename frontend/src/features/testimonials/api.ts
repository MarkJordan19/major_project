import axiosClient from "@/api/axiosClient";
import type { Testimonial, CreateTestimonialPayload } from "./types";

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const response = await axiosClient.get<{ success: boolean; testimonials: Testimonial[] }>("/testimonials");
  return response.data.testimonials;
};

export const createTestimonial = async (data: CreateTestimonialPayload): Promise<number> => {
  const response = await axiosClient.post<{ success: boolean; testimonial_id: number }>("/testimonials", data);
  return response.data.testimonial_id;
};

export const deleteTestimonial = async (id: number): Promise<void> => {
  await axiosClient.delete(`/testimonials/${id}`);
};
