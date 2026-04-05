import { query } from "@/lib/db";

export interface Room {
  room_id: number;
  project_id: number;
  room_type:
    | "living"
    | "bedroom"
    | "kitchen"
    | "bathroom"
    | "office"
    | "other";
  description: string | null;
}

export async function getAllRooms(): Promise<Room[]> {
  return await query<Room[]>(
    `SELECT room_id, project_id, room_type, description
     FROM rooms
     ORDER BY room_id ASC`
  );
}

export async function getRoomsByProject(
  projectId: number
): Promise<Room[]> {
  return await query<Room[]>(
    `SELECT room_id, project_id, room_type, description
     FROM rooms
     WHERE project_id = ?
     ORDER BY room_id ASC`,
    [projectId]
  );
}

export async function getRoomById(roomId: number): Promise<Room | null> {
  const rows = await query<Room[]>(
    `SELECT room_id, project_id, room_type, description
     FROM rooms
     WHERE room_id = ?`,
    [roomId]
  );

  return rows.length ? rows[0] : null;
}

export async function createRoom(
  projectId: number,
  roomType: Room["room_type"],
  description: string | null
): Promise<number> {
  const result = await query<any>(
    `INSERT INTO rooms (project_id, room_type, description)
     VALUES (?, ?, ?)`,
    [projectId, roomType, description]
  );

  return result.insertId;
}

export async function updateRoom(
  roomId: number,
  data: Partial<Pick<Room, "room_type" | "description">>
): Promise<boolean> {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.room_type !== undefined) {
    fields.push("room_type = ?");
    values.push(data.room_type);
  }

  if (data.description !== undefined) {
    fields.push("description = ?");
    values.push(data.description);
  }

  if (!fields.length) return false;

  const result = await query<any>(
    `UPDATE rooms SET ${fields.join(", ")} WHERE room_id = ?`,
    [...values, roomId]
  );

  return result.affectedRows > 0;
}

export async function deleteRoom(roomId: number): Promise<boolean> {
  const result = await query<any>(
    `DELETE FROM rooms WHERE room_id = ?`,
    [roomId]
  );

  return result.affectedRows > 0;
}

export async function roomBelongsToProject(
  roomId: number,
  projectId: number
): Promise<boolean> {
  const rows = await query<any[]>(
    `SELECT 1
     FROM rooms
     WHERE room_id = ? AND project_id = ?
     LIMIT 1`,
    [roomId, projectId]
  );

  return rows.length > 0;
}
