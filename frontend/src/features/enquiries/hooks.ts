import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEnquiries, getEnquiryById, createEnquiry, deleteEnquiry } from "./api";

export const ENQUIRY_KEYS = {
  all: ["enquiries"] as const,
  detail: (id: number) => ["enquiries", id] as const,
};

export const useEnquiriesList = () => {
  return useQuery({
    queryKey: ENQUIRY_KEYS.all,
    queryFn: getEnquiries,
  });
};

export const useEnquiryDetail = (id: number) => {
  return useQuery({
    queryKey: ENQUIRY_KEYS.detail(id),
    queryFn: () => getEnquiryById(id),
    enabled: !!id,
  });
};

export const useCreateEnquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEnquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENQUIRY_KEYS.all });
    },
  });
};

export const useDeleteEnquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEnquiry,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ENQUIRY_KEYS.all });
      queryClient.removeQueries({ queryKey: ENQUIRY_KEYS.detail(id) });
    },
  });
};
