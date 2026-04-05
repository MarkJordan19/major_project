import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllRooms, getRoomsByProject, createRoom, updateRoom, deleteRoom } from "./api";

export const ROOM_KEYS = {
  all: ["rooms"] as const,
  byProject: (projectId: number) => ["rooms", "project", projectId] as const,
};

export const useAllRoomsList = () => {
  return useQuery({
    queryKey: ROOM_KEYS.all,
    queryFn: getAllRooms,
  });
};

export const useProjectRoomsList = (projectId: number) => {
  return useQuery({
    queryKey: ROOM_KEYS.byProject(projectId),
    queryFn: () => getRoomsByProject(projectId),
    enabled: !!projectId,
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRoom,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ROOM_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ROOM_KEYS.byProject(variables.projectId) });
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRoom,
    onSuccess: () => {
      // Since we don't have project_id in update payload immediately, flush all room lists
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      // Flush all room lists
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
};
