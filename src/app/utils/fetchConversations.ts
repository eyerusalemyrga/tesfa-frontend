import { apiFetch } from "./apiClient";
import type { Conversation, ConversationDetail } from "./types/chat";

const baseUrl = "/api/conversations";

export function fetchConversations() {
  return apiFetch<Conversation[]>(baseUrl);
}

export function fetchConversation(id: number) {
  return apiFetch<ConversationDetail>(`${baseUrl}/${id}`);
}

export function deleteConversation(id: number) {
  return apiFetch<void>(`${baseUrl}/${id}`, { method: "DELETE" });
}
