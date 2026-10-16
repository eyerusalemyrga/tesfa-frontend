import { useState } from "react";
import { ApiError } from "../utils/apiClient";
import { fetchConversation } from "../utils/fetchConversations";
import { fetchQuery } from "../utils/fetchQuery";
import { getToken } from "../utils/session";
import type { Message } from "../utils/types/chat";

export interface Filters {
  region: string;
  conflict_type: string;
}

function localMessage(content: string, filters: Filters): Message {
  return {
    id: -Date.now(),
    conversation: null,
    role: "user",
    content,
    region: filters.region,
    conflict_type: filters.conflict_type,
    metrics: null,
    top_conflicts: null,
    chart: null,
    countries: [],
    created_at: new Date().toISOString(),
  };
}

// One chat thread with Tesfa AI. Signed-in users' threads are saved by the backend;
// `onSaved` lets the history list refresh after each answer.
export function useChat(onSaved?: () => void) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(query: string, filters: Filters) {
    setError(null);
    setMessages((current) => [...current, localMessage(query, filters)]);
    setSending(true);
    try {
      const reply = await fetchQuery({
        query,
        region: filters.region || undefined,
        conflict_type: filters.conflict_type || undefined,
        conversation_id: conversationId ?? undefined,
      });
      setMessages((current) => [...current, reply]);
      if (reply.conversation) {
        setConversationId(reply.conversation);
      }
      onSaved?.();
    } catch (err) {
      const guest = err instanceof ApiError && err.status === 401 && !getToken();
      setError(
        guest
          ? "Sign in or create an account to ask Tesfa. Guest questions aren't switched on in the backend yet."
          : (err as Error).message
      );
    } finally {
      setSending(false);
    }
  }

  async function open(id: number) {
    setError(null);
    setLoadingThread(true);
    try {
      const conversation = await fetchConversation(id);
      setMessages(conversation.messages);
      setConversationId(conversation.id);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingThread(false);
    }
  }

  function reset() {
    setMessages([]);
    setConversationId(null);
    setError(null);
  }

  return { messages, conversationId, sending, loadingThread, error, send, open, reset };
}
