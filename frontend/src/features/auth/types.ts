export interface User {
  user_id: number;
  role: "admin" | "customer";
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
}
