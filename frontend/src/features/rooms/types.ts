export interface Room {
  room_id: number;
  project_id: number;
  room_type: "living" | "bedroom" | "kitchen" | "bathroom" | "office" | "other";
  description: string | null;
}

export type CreateRoomPayload = Omit<Room, "room_id" | "project_id">;
export type UpdateRoomPayload = Partial<CreateRoomPayload>;
