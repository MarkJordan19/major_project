import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMe, login, logout } from "./api";
import type { User } from "./types";

export const AUTH_QUERY_KEY = ["auth"];

export const useAuth = () => {
  return useQuery<User, Error>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: getMe,
    staleTime: 0,
    gcTime: 0, // Disable caching entirely
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Reset the auth state to force re-render/redirect
      queryClient.cancelQueries({ queryKey: AUTH_QUERY_KEY });
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
    },
  });
};