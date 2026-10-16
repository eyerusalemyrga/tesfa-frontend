import { apiFetch } from "./apiClient";
import type { LoginResponse } from "./types/user";

export function fetchLogin(email: string, password: string) {
  return apiFetch<LoginResponse>("/api/auth", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email, password }),
  });
}
