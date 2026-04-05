import { createContext, useContext, useEffect } from "react";
import { useAuth, useLogout, AUTH_QUERY_KEY } from "@/features/auth/hooks";
import { useQueryClient } from "@tanstack/react-query";
import type { User } from "@/features/auth/types";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  user: User | null | undefined;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading: isQueryLoading, isFetching, isError } = useAuth();
  const { mutateAsync: logoutMutation } = useLogout();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleUnauthorized = () => {
      // The interceptor caught a 401. Let's invalidate the auth query
      // so it refetches, gets a 401 again, and marks isError = true, 
      // cleanly pushing the user out of protected routes.
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [queryClient]);

  const logout = async () => {
    await logoutMutation();
  };

  const isAuthenticated = !!user && !isError;
  const isAdmin = user?.role === "admin";
  const isLoading = isQueryLoading || isFetching;

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, isLoading, user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
