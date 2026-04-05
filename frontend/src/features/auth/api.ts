import axiosClient from "@/api/axiosClient";
import type { AuthResponse, User } from "./types";

export const login = async (credentials: Record<string, string>): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>("/auth/login", credentials);
  return response.data; // normalization happens in the hook
};

export const logout = async (): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>("/auth/logout");
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await axiosClient.get("/auth/me");
  if (!response.data || !response.data.user) {
    throw new Error("Not authenticated");
  }
  return response.data.user;
};