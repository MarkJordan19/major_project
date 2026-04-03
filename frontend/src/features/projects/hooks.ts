import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjects, getProjectById, createProject, updateProject, deleteProject } from "./api";

export const PROJECT_KEYS = {
  all: ["projects"] as const,
  detail: (id: number) => ["projects", id] as const,
};

export const useProjectsList = () => {
  return useQuery({
    queryKey: PROJECT_KEYS.all,
    queryFn: getProjects,
  });
};

export const useProjectDetail = (id: number) => {
  return useQuery({
    queryKey: PROJECT_KEYS.detail(id),
    queryFn: () => getProjectById(id),
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProject,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.detail(variables.id) });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
      // Remove detail cache manually to free memory
      queryClient.removeQueries({ queryKey: PROJECT_KEYS.detail(id) });
    },
  });
};
