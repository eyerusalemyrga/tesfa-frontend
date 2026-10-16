import { apiFetch } from "./apiClient";
import type { User } from "./types/user";

export function fetchProfile() {
  return apiFetch<User>("/api/profile");
}

export function updateProfile(data: Partial<User> & { password?: string }) {
  return apiFetch<User>("/api/profile", { method: "PATCH", body: JSON.stringify(data) });
}
