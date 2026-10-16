import { apiFetch } from "./apiClient";

type Reply = { message: string };

function post(path: string, body: object) {
  return apiFetch<Reply>(path, { method: "POST", auth: false, body: JSON.stringify(body) });
}

export const requestOtp = (email: string) => post("/api/forgot-password", { email });

export const verifyOtp = (email: string, otp: string) => post("/api/verify-otp", { email, otp });

export const resetPassword = (email: string, password: string) =>
  post("/api/reset-password", { email, password });
