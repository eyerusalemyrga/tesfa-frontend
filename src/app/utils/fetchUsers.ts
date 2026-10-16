import { apiFetch } from "./apiClient";
import type { User, UserType } from "./types/user";

const baseUrl = "/api/users";

export function fetchUsers(userType?: UserType) {
  const query = userType ? `?user_type=${encodeURIComponent(userType)}` : "";
  return apiFetch<User[]>(baseUrl + query);
}

export function createUser(data: Partial<User> & { password: string }) {
  return apiFetch<User>(baseUrl, { method: "POST", body: JSON.stringify(data) });
}

export function updateUser(id: number, data: Partial<User>) {
  return apiFetch<User>(`${baseUrl}/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export function deleteUser(id: number) {
  return apiFetch<void>(`${baseUrl}/${id}`, { method: "DELETE" });
}
