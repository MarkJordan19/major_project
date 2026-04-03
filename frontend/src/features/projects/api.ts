import axiosClient from "@/api/axiosClient";
import type { Project, CreateProjectPayload, UpdateProjectPayload } from "./types";

export const getProjects = async (): Promise<Project[]> => {
  const response = await axiosClient.get<{ success: boolean; projects: Project[] }>("/projects");
  return response.data.projects;
};

export const getProjectById = async (id: number): Promise<Project> => {
  const response = await axiosClient.get<{ success: boolean; project: Project }>(`/projects/${id}`);
  return response.data.project;
};

export const createProject = async (data: CreateProjectPayload): Promise<number> => {
  const response = await axiosClient.post<{ success: boolean; project_id: number }>("/projects", data);
  return response.data.project_id;
};

export const updateProject = async ({ id, data }: { id: number; data: UpdateProjectPayload }): Promise<void> => {
  await axiosClient.put(`/projects/${id}`, data);
};

export const deleteProject = async (id: number): Promise<void> => {
  await axiosClient.delete(`/projects/${id}`);
};
