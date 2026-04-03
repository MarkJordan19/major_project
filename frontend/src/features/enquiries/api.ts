import axiosClient from "@/api/axiosClient";
import type { Enquiry, CreateEnquiryPayload } from "./types";

export const getEnquiries = async (): Promise<Enquiry[]> => {
  const response = await axiosClient.get<{ success: boolean; enquiries: Enquiry[] }>("/enquiries");
  return response.data.enquiries;
};

export const getEnquiryById = async (id: number): Promise<Enquiry> => {
  const response = await axiosClient.get<{ success: boolean; enquiry: Enquiry }>(`/enquiries/${id}`);
  return response.data.enquiry;
};

export const createEnquiry = async (data: CreateEnquiryPayload): Promise<number> => {
  const response = await axiosClient.post<{ success: boolean; enquiry_id: number }>("/enquiries", data);
  return response.data.enquiry_id;
};

export const deleteEnquiry = async (id: number): Promise<void> => {
  await axiosClient.delete(`/enquiries/${id}`);
};
