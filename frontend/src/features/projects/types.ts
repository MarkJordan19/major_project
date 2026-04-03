export interface Project {
  project_id: number;
  title: string;
  description: string | null;
  category: "residential" | "commercial" | "office";
  location: string | null;
  created_at: string;
}

export type CreateProjectPayload = Omit<Project, "project_id" | "created_at">;
export type UpdateProjectPayload = Partial<CreateProjectPayload>;
