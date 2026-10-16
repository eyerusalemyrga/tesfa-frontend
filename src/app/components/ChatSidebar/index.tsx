"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaChartPie, FaLock, FaPlus, FaRegCommentDots, FaSignOutAlt, FaThLarge, FaTimes, FaTrashAlt } from "react-icons/fa";
import ConfirmModal from "../../sharedComponents/ConfirmModal";
import Logo from "../../sharedComponents/Logo";
import { deleteConversation } from "../../utils/fetchConversations";
import { clearSession } from "../../utils/session";
import type { Conversation } from "../../utils/types/chat";
import type { User } from "../../utils/types/user";

interface Props {
  user: User | null;
  conversations: Conversation[];
  activeId: number | null;
  open: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onOpen: (id: number) => void;
  onDeleted: (id: number) => void;
}

export default function ChatSidebar({ user, conversations, activeId, open, onClose, onNewChat, onOpen, onDeleted }: Props) {
  const router = useRouter();
  const [toDelete, setToDelete] = useState<Conversation | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteConversation(toDelete.id);
      onDeleted(toDelete.id);
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  }

  function handleLogout() {
    clearSession();
    setConfirmLogout(false);
    onNewChat();
    router.push("/");
  }

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-brand p-4 text-white transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between px-1">
          <Logo light />
          <button type="button" onClick={onClose} aria-label="Close menu" className="rounded p-1 hover:bg-white/10 lg:hidden">
            <FaTimes />
          </button>
        </div>

        <button
          type="button"
          onClick={onNewChat}
          className="mb-6 flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2.5 font-semibold transition hover:bg-white/10"
        >
          <FaPlus /> New chat
        </button>

        <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-white/50">History</p>
        <div className="-mx-1 flex-1 overflow-y-auto px-1">
          {user ? (
            conversations.length ? (
              <ul className="space-y-1">
                {conversations.map((conversation) => (
                  <li key={conversation.id} className="group relative">
                    <button
                      type="button"
                      onClick={() => onOpen(conversation.id)}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 pr-9 text-left text-sm transition ${
                        activeId === conversation.id ? "bg-accent text-white" : "text-white/85 hover:bg-white/10"
                      }`}
                    >
                      <FaRegCommentDots className="shrink-0 opacity-70" />
                      <span className="truncate">{conversation.title || "Untitled"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setToDelete(conversation)}
                      aria-label={`Delete ${conversation.title}`}
                      className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1.5 text-white/60 opacity-0 hover:text-white group-hover:opacity-100 focus:opacity-100"
                    >
                      <FaTrashAlt className="text-xs" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-1 text-sm text-white/60">Your questions will show up here.</p>
            )
          ) : (
            <div className="rounded-xl bg-white/10 p-4 text-sm">
              <FaLock className="mb-2 text-accent" />
              <p className="font-bold">Save your history</p>
              <p className="mt-1 text-white/70">Create a free account to keep your conversations and explore graphs and charts.</p>
              <Link href="/signup" className="mt-3 inline-block rounded-lg bg-accent px-3 py-1.5 font-semibold hover:bg-accent-dark">
                Create account
              </Link>
            </div>
          )}
        </div>

        {user && (
          <div className="mt-4 space-y-1 border-t border-white/10 pt-4">
            {user.user_type === "Admin" && (
              <Link href="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10">
                <FaThLarge /> Admin dashboard
              </Link>
            )}
            <Link href="/insights" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10">
              <FaChartPie /> Insights
            </Link>
            <button type="button" onClick={() => setConfirmLogout(true)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10">
              <FaSignOutAlt /> Log out
            </button>
          </div>
        )}
      </aside>

      {toDelete && (
        <ConfirmModal
          title="Delete conversation"
          message={`Delete "${toDelete.title || "Untitled"}"? This can't be undone.`}
          confirmLabel="Delete"
          busy={deleting}
          onConfirm={handleDelete}
          onClose={() => setToDelete(null)}
        />
      )}
      {confirmLogout && (
        <ConfirmModal
          title="Confirm Log Out"
          message="Are you sure you want to sign out?"
          onConfirm={handleLogout}
          onClose={() => setConfirmLogout(false)}
        />
      )}
    </>
  );
}
