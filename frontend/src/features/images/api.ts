import axiosClient from "@/api/axiosClient";
import type { DesignImage, CreateImagePayload } from "./types";

export const getImages = async (params?: { project_id?: number; room_id?: number }): Promise<DesignImage[]> => {
  const response = await axiosClient.get<{ success: boolean; images: DesignImage[] }>("/images", { params });
  return response.data.images;
};

export const getImageById = async (id: number): Promise<DesignImage> => {
  const response = await axiosClient.get<{ success: boolean; image: DesignImage }>(`/images/${id}`);
  return response.data.image;
};

export const createImage = async (data: CreateImagePayload): Promise<number> => {
  const response = await axiosClient.post<{ success: boolean; image_id: number }>("/images", data);
  return response.data.image_id;
};

export const deleteImage = async (id: number): Promise<void> => {
  await axiosClient.delete(`/images/${id}`);
};
