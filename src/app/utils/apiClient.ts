import { clearSession, getRefreshToken, getToken, setToken } from "./session";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

interface Options extends RequestInit {
  // Send the stored token. Off for login/signup, where a stale token would be rejected.
  auth?: boolean;
}

// Calls one of our /api routes. Attaches the token, refreshes it once when it has
// expired, and throws an ApiError with the backend's own message on failure.
export async function apiFetch<T>(path: string, { auth = true, ...init }: Options = {}): Promise<T> {
  const send = () => {
    const headers = new Headers(init.headers);
    if (init.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    const token = auth ? getToken() : null;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return fetch(path, { ...init, headers });
  };

  let response = await send();
  if (response.status === 401 && auth && getToken()) {
    if (await refreshAccessToken()) {
      response = await send();
    } else {
      clearSession();
      throw new ApiError("Your session has expired. Please sign in again.", 401);
    }
  }

  if (!response.ok) {
    throw new ApiError(await readError(response), response.status);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return await response.json();
}

let refreshing: Promise<boolean> | null = null;

function refreshAccessToken() {
  refreshing ??= (async () => {
    const refresh = getRefreshToken();
    if (!refresh) return false;
    try {
      const response = await fetch("/api/token/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      if (!response.ok) return false;
      const { access } = await response.json();
      setToken(access);
      return true;
    } catch {
      return false;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}

const fieldLabels: Record<string, string> = {
  first_name: "First name",
  last_name: "Last name",
  phone_number: "Phone number",
  non_field_errors: "",
};

// DRF errors come as {detail: "..."} or {field: ["..."]}; turn either into one sentence.
export async function readError(response: Response) {
  const text = await response.text().catch(() => "");
  try {
    const body = JSON.parse(text);
    if (typeof body === "string") return body;
    if (typeof body.detail === "string") return body.detail;
    if (typeof body.error === "string") return body.error;
    const messages = Object.entries(body).map(([field, value]) => {
      const message = Array.isArray(value) ? value.join(" ") : String(value);
      const label = fieldLabels[field] ?? field.charAt(0).toUpperCase() + field.slice(1);
      return label ? `${label}: ${message}` : message;
    });
    if (messages.length) return messages.join(" ");
  } catch {
    // Not JSON; fall through.
  }
  return text || response.statusText || "Something went wrong.";
}
