"use client";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import MessageBubble from "../../../components/MessageBubble";
import { fetchConversation } from "../../../utils/fetchConversations";
import type { ConversationDetail } from "../../../utils/types/chat";
import type { User } from "../../../utils/types/user";

// Slide-over that shows one conversation's full thread.
export default function ConversationPanel({ id, owner, onClose }: { id: number; owner?: User; onClose: () => void }) {
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setConversation(null);
    setError(null);
    fetchConversation(id).then(setConversation).catch((err) => setError(err.message));
  }, [id]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <aside className="flex h-full w-full max-w-2xl flex-col bg-[#fafafa] shadow-xl" onClick={(e) => e.stopPropagation()} aria-label="Conversation">
        <header className="flex items-start justify-between gap-4 border-b bg-white px-6 py-4">
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-brand">{conversation?.title || "Conversation"}</p>
            {owner && <p className="text-sm text-gray-500">{owner.first_name} {owner.last_name} · {owner.email}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded p-2 text-gray-500 hover:bg-gray-100">
            <FaTimes />
          </button>
        </header>
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          {error && <p className="text-red-600">{error}</p>}
          {!conversation && !error && <p className="text-gray-500">Loading...</p>}
          {conversation?.messages.map((m) => <MessageBubble key={m.id} message={m} />)}
        </div>
      </aside>
    </div>
  );
}
