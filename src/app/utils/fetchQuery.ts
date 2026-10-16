import { apiFetch } from "./apiClient";
import type { Message, QueryData } from "./types/chat";

// Asks Tesfa AI a question. Returns the saved assistant message.
export function fetchQuery(data: QueryData) {
  return apiFetch<Message>("/api/query", { method: "POST", body: JSON.stringify(data) });
}
