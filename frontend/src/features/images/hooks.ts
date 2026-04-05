import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getImages, createImage, deleteImage } from "./api";

export const IMAGE_KEYS = {
  all: ["images"] as const,
  byFilter: (filter: { project_id?: number; room_id?: number }) => ["images", filter] as const,
};

export const useImagesList = (filter?: { project_id?: number; room_id?: number }) => {
  return useQuery({
    queryKey: filter ? IMAGE_KEYS.byFilter(filter) : IMAGE_KEYS.all,
    queryFn: () => getImages(filter),
  });
};

export const useCreateImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
  });
};

export const useDeleteImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
  });
};
