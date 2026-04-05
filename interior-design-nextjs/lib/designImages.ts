import { query } from "@/lib/db";

export interface DesignImage {
  image_id: number;
  project_id: number | null;
  room_id: number | null;
  image_url: string;
  alt_text: string | null;
  uploaded_at: string;
}

export async function getAllImages(): Promise<DesignImage[]> {
  return await query<DesignImage[]>(
    `SELECT image_id, project_id, room_id, image_url, alt_text, uploaded_at
     FROM design_images
     ORDER BY uploaded_at DESC`
  );
}

export async function getImagesByProject(
  projectId: number
): Promise<DesignImage[]> {
  return await query<DesignImage[]>(
    `SELECT image_id, project_id, room_id, image_url, alt_text, uploaded_at
     FROM design_images
     WHERE project_id = ?
     ORDER BY uploaded_at DESC`,
    [projectId]
  );
}

export async function getImagesByRoom(
  roomId: number
): Promise<DesignImage[]> {
  return await query<DesignImage[]>(
    `SELECT image_id, project_id, room_id, image_url, alt_text, uploaded_at
     FROM design_images
     WHERE room_id = ?
     ORDER BY uploaded_at DESC`,
    [roomId]
  );
}

export async function getImageById(
  imageId: number
): Promise<DesignImage | null> {
  const rows = await query<DesignImage[]>(
    `SELECT image_id, project_id, room_id, image_url, alt_text, uploaded_at
     FROM design_images
     WHERE image_id = ?`,
    [imageId]
  );

  return rows.length ? rows[0] : null;
}

export async function createImage(data: {
  project_id?: number | null;
  room_id?: number | null;
  image_url: string;
  alt_text?: string | null;
}): Promise<number> {
  const result = await query<any>(
    `INSERT INTO design_images (project_id, room_id, image_url, alt_text)
     VALUES (?, ?, ?, ?)`,
    [
      data.project_id ?? null,
      data.room_id ?? null,
      data.image_url,
      data.alt_text ?? null,
    ]
  );

  return result.insertId;
}

export async function deleteImage(imageId: number): Promise<boolean> {
  const result = await query<any>(
    `DELETE FROM design_images WHERE image_id = ?`,
    [imageId]
  );

  return result.affectedRows > 0;
}
