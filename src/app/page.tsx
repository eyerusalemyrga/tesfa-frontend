"use client";
import { useEffect, useRef, useState } from "react";
import { FaDove } from "react-icons/fa";
import ChatSidebar from "./components/ChatSidebar";
import Composer from "./components/Composer";
import EmptyState from "./components/EmptyState";
import MessageBubble from "./components/MessageBubble";
import TopBar from "./components/TopBar";
import { useChat } from "./hooks/useChat";
import { useConversations } from "./hooks/useFetchConversations";
import { useSession } from "./hooks/useSession";

// Ask Tesfa AI, ChatGPT style. Anyone can ask; signed-in users also get saved history.
export default function ChatPage() {
  const { user, ready } = useSession();
  const { conversations, setConversations, reload } = useConversations(ready && !!user);
  const chat = useChat(() => {
    if (user) reload();
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Admins can list everyone's conversations; the chat history shows only their own.
  const myConversations = user ? conversations.filter((c) => c.user === user.id) : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ behavior: "smooth" });
  }, [chat.messages.length, chat.sending]);

  function newChat() {
    chat.reset();
    setMenuOpen(false);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#fafafa]">
      <ChatSidebar
        user={user}
        conversations={myConversations}
        activeId={chat.conversationId}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNewChat={newChat}
        onOpen={(id) => {
          chat.open(id);
          setMenuOpen(false);
        }}
        onDeleted={(id) => {
          setConversations(conversations.filter((c) => c.id !== id));
          if (chat.conversationId === id) chat.reset();
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar user={user} ready={ready} onMenu={() => setMenuOpen(true)} />

        <div className="flex-1 overflow-y-auto">
          {chat.loadingThread ? (
            <p className="py-16 text-center text-gray-500">Loading conversation...</p>
          ) : chat.messages.length === 0 ? (
            <EmptyState onPick={(question) => chat.send(question, { region: "", conflict_type: "" })} />
          ) : (
            <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
              {chat.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {chat.sending && (
                <div className="flex items-center gap-3 text-gray-500">
                  <span className="grid h-8 w-8 animate-pulse place-items-center rounded-lg bg-accent text-white">
                    <FaDove aria-hidden />
                  </span>
                  Tesfa is thinking...
                </div>
              )}
            </div>
          )}
          {chat.error && (
            <p role="alert" className="mx-auto mb-4 max-w-3xl rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {chat.error}
            </p>
          )}
          <div ref={bottomRef} />
        </div>

        <Composer disabled={chat.sending} onSend={chat.send} />
      </div>
    </div>
  );
}
