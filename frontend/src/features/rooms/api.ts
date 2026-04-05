import axiosClient from "@/api/axiosClient";
import type { Room, CreateRoomPayload, UpdateRoomPayload } from "./types";

export const getRoomsByProject = async (projectId: number): Promise<Room[]> => {
  const response = await axiosClient.get<{ success: boolean; rooms: Room[] }>(`/projects/${projectId}/rooms`);
  return response.data.rooms;
};

export const getAllRooms = async (): Promise<Room[]> => {
  const response = await axiosClient.get<{ success: boolean; rooms: Room[] }>("/rooms");
  return response.data.rooms;
};

export const getRoomById = async (id: number): Promise<Room> => {
  const response = await axiosClient.get<{ success: boolean; room: Room }>(`/rooms/${id}`);
  return response.data.room;
};

export const createRoom = async ({ projectId, data }: { projectId: number; data: CreateRoomPayload }): Promise<number> => {
  const response = await axiosClient.post<{ success: boolean; room_id: number }>(`/projects/${projectId}/rooms`, data);
  return response.data.room_id;
};

export const updateRoom = async ({ id, data }: { id: number; data: UpdateRoomPayload }): Promise<void> => {
  await axiosClient.put(`/rooms/${id}`, data);
};

export const deleteRoom = async (id: number): Promise<void> => {
  await axiosClient.delete(`/rooms/${id}`);
};
