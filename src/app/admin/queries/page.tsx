"use client";
import { useState } from "react";
import { useConversations } from "../../hooks/useFetchConversations";
import { useUsers } from "../../hooks/useFetchUsers";
import { formatDateTime } from "../../utils/format";
import ConversationPanel from "./components/ConversationPanel";

const PAGE_SIZE = 15;

export default function QueriesPage() {
  const { conversations, loading, error } = useConversations();
  const { users } = useUsers();
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState("");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<number | null>(null);

  const usersById = new Map(users.map((u) => [u.id, u]));
  const nameOf = (id: number) => {
    const u = usersById.get(id);
    return u ? `${u.first_name} ${u.last_name}` : `User #${id}`;
  };

  const term = search.trim().toLowerCase();
  const filtered = conversations.filter(
    (c) => (!userId || c.user === Number(userId)) && (!term || c.title.toLowerCase().includes(term) || nameOf(c.user).toLowerCase().includes(term))
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const askers = users.filter((u) => conversations.some((c) => c.user === u.id));

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="text-3xl font-extrabold text-brand sm:text-4xl">Queries</h1>
      <p className="mb-6 mt-1 text-gray-600">Every conversation people have had with Tesfa AI. Open one to read it.</p>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          aria-label="Search queries"
          placeholder="Search questions or people..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="h-10 w-full rounded-lg border border-accent px-3 focus:outline-none focus:ring-2 focus:ring-accent/30 sm:w-80"
        />
        <select
          aria-label="Filter by user"
          value={userId}
          onChange={(e) => { setUserId(e.target.value); setPage(1); }}
          className="h-10 rounded-lg border border-accent bg-white px-3"
        >
          <option value="">Everyone</option>
          {askers.map((u) => (
            <option key={u.id} value={u.id}>{u.first_name} {u.last_name}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-accent text-white">
            <tr>
              <th className="px-4 py-3 font-bold">Question</th>
              <th className="px-4 py-3 font-bold">Asked by</th>
              <th className="px-4 py-3 font-bold">Started</th>
              <th className="px-4 py-3 font-bold">Last activity</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={4} className="px-4 py-8 text-red-600">{error}</td></tr>
            ) : current.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8">No queries found.</td></tr>
            ) : (
              current.map((c) => (
                <tr key={c.id} onClick={() => setOpenId(c.id)} className="cursor-pointer border-t border-gray-100 hover:bg-accent-soft/40">
                  <td className="max-w-md px-4 py-3">
                    <button type="button" className="truncate text-left font-semibold text-brand hover:underline">{c.title || "Untitled"}</button>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{nameOf(c.user)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">{formatDateTime(c.created_at)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">{formatDateTime(c.updated_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > PAGE_SIZE && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button type="button" onClick={() => setPage(page - 1)} disabled={page === 1} className="rounded-lg border border-accent bg-white px-5 py-2 text-accent disabled:opacity-50">
            Previous
          </button>
          <span className="font-medium text-brand">Page {page} of {totalPages}</span>
          <button type="button" onClick={() => setPage(page + 1)} disabled={page === totalPages} className="rounded-lg border border-accent bg-accent px-5 py-2 text-white disabled:bg-white disabled:text-accent disabled:opacity-50">
            Next
          </button>
        </div>
      )}

      {openId !== null && (
        <ConversationPanel
          id={openId}
          owner={usersById.get(conversations.find((c) => c.id === openId)?.user ?? -1)}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}
