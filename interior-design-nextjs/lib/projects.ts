import { query } from "@/lib/db";

export interface Project {
  project_id: number;
  title: string;
  description: string | null;
  category: "residential" | "commercial" | "office";
  location: string | null;
  created_by: number | null;
  created_at: string;
}

export async function getAllProjects(): Promise<Project[]> {
  return await query<Project[]>(
    `SELECT project_id, title, description, category, location, created_at
     FROM projects
     ORDER BY created_at DESC`
  );
}

export async function getProjectById(
  projectId: number
): Promise<Project | null> {
  const rows = await query<Project[]>(
    `SELECT project_id, title, description, category, location, created_at
     FROM projects
     WHERE project_id = ?`,
    [projectId]
  );

  return rows.length ? rows[0] : null;
}

export async function createProject(
  data: Omit<Project, "project_id" | "created_at">
): Promise<number> {
  const result = await query<any>(
    `INSERT INTO projects (title, description, category, location, created_by)
     VALUES (?, ?, ?, ?, ?)`,
    [
      data.title,
      data.description,
      data.category,
      data.location,
      data.created_by,
    ]
  );

  return result.insertId;
}

export async function updateProject(
  projectId: number,
  data: Partial<Omit<Project, "project_id" | "created_at">>
): Promise<boolean> {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.title !== undefined) {
    fields.push("title = ?");
    values.push(data.title);
  }
  if (data.description !== undefined) {
    fields.push("description = ?");
    values.push(data.description);
  }
  if (data.category !== undefined) {
    fields.push("category = ?");
    values.push(data.category);
  }
  if (data.location !== undefined) {
    fields.push("location = ?");
    values.push(data.location);
  }

  if (!fields.length) return false;

  const result = await query<any>(
    `UPDATE projects SET ${fields.join(", ")} WHERE project_id = ?`,
    [...values, projectId]
  );

  return result.affectedRows > 0;
}

export async function deleteProject(projectId: number): Promise<boolean> {
  const result = await query<any>(
    `DELETE FROM projects WHERE project_id = ?`,
    [projectId]
  );

  return result.affectedRows > 0;
}
