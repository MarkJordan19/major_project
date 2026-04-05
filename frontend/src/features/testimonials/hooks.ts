import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTestimonials, createTestimonial, deleteTestimonial } from "./api";

export const TESTIMONIAL_KEYS = {
  all: ["testimonials"] as const,
};

export const useTestimonialsList = () => {
  return useQuery({
    queryKey: TESTIMONIAL_KEYS.all,
    queryFn: getTestimonials,
  });
};

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TESTIMONIAL_KEYS.all });
    },
  });
};

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TESTIMONIAL_KEYS.all });
    },
  });
};
