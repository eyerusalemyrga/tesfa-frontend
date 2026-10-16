import { apiFetch } from "./apiClient";
import type { SignUpData } from "./types/user";

export function fetchSignUp(data: SignUpData) {
  return apiFetch<{ message: string }>("/api/signup", {
    method: "POST",
    auth: false,
    body: JSON.stringify(data),
  });
}
