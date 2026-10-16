import type { LoginResponse, User } from "./types/user";

// Fired on window whenever the session changes, so open pages can re-read it.
export const SESSION_EVENT = "tesfa-session";

export function saveSession({ access, refresh, user }: LoginResponse) {
  localStorage.setItem("token", access);
  localStorage.setItem("refresh", refresh);
  localStorage.setItem("user", JSON.stringify(user));
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function saveUser(user: User) {
  localStorage.setItem("user", JSON.stringify(user));
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getRefreshToken() {
  return localStorage.getItem("refresh");
}

export function setToken(access: string) {
  localStorage.setItem("token", access);
}

export function getStoredUser(): User | null {
  try {
    const user = localStorage.getItem("user");
    return user ? (JSON.parse(user) as User) : null;
  } catch {
    return null;
  }
}
