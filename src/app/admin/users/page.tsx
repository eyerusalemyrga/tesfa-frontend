"use client";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useUsers } from "../../hooks/useFetchUsers";
import { useSession } from "../../hooks/useSession";
import ConfirmModal from "../../sharedComponents/ConfirmModal";
import { deleteUser, updateUser } from "../../utils/fetchUsers";
import { formatDate } from "../../utils/format";
import type { User } from "../../utils/types/user";
import AddUserModal from "./components/AddUserModal";

const PAGE_SIZE = 10;
const roleFilters = ["All", "Health Professional", "Admin"] as const;

export default function UsersPage() {
  const { user: me } = useSession();
  const { users, setUsers, loading, error } = useUsers();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<(typeof roleFilters)[number]>("All");
  const [page, setPage] = useState(1);
  const [adding, setAdding] = useState(false);
  const [toDelete, setToDelete] = useState<User | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const term = search.trim().toLowerCase();
  const filtered = users.filter(
    (u) =>
      (role === "All" || u.user_type === role) &&
      (!term || [`${u.first_name} ${u.last_name}`, u.email, u.organization, u.country].some((v) => v?.toLowerCase().includes(term)))
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function flash(message: string) {
    setNotice(message);
    setTimeout(() => setNotice(null), 3000);
  }

  function replace(updated: User) {
    setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
  }

  async function toggleActive(user: User) {
    try {
      replace(await updateUser(user.id, { is_active: !user.is_active }));
      flash(`${user.first_name} is now ${user.is_active ? "deactivated" : "active"}.`);
    } catch (err) {
      flash((err as Error).message);
    }
  }

  async function handleDelete() {
    if (!toDelete) return;
    setBusy(true);
    try {
      await deleteUser(toDelete.id);
      setUsers(users.filter((u) => u.id !== toDelete.id));
      flash("User deleted.");
    } catch (err) {
      flash((err as Error).message);
    } finally {
      setBusy(false);
      setToDelete(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="mb-6 text-3xl font-extrabold text-brand sm:text-4xl">Users</h1>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            aria-label="Search users"
            placeholder="Search by name, email, organization..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="h-10 w-full rounded-lg border border-accent px-3 focus:outline-none focus:ring-2 focus:ring-accent/30 sm:w-80"
          />
          <div className="flex overflow-hidden rounded-lg border border-accent">
            {roleFilters.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => { setRole(r); setPage(1); }}
                className={`px-3 py-2 text-sm font-semibold ${role === r ? "bg-accent text-white" : "bg-white text-accent-dark hover:bg-accent-soft"}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <button type="button" onClick={() => setAdding(true)} className="rounded-lg bg-accent px-4 py-2 font-semibold text-white hover:bg-accent-dark">
          Add user
        </button>
      </div>

      {notice && <div className="fixed right-4 top-5 z-50 rounded bg-accent px-4 py-3 text-white shadow-lg">{notice}</div>}

      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-accent text-white">
            <tr>
              {["Name", "Email", "Phone", "Role", "Country", "Organization", "Joined", "Status", ""].map((h) => (
                <th key={h} className="whitespace-nowrap px-3 py-3 font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="px-3 py-8">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={9} className="px-3 py-8 text-red-600">{error}</td></tr>
            ) : current.length === 0 ? (
              <tr><td colSpan={9} className="px-3 py-8">No users found.</td></tr>
            ) : (
              current.map((u) => (
                <tr key={u.id} className="border-t border-gray-100">
                  <td className="whitespace-nowrap px-3 py-3 font-semibold">{u.first_name} {u.last_name}</td>
                  <td className="px-3 py-3">{u.email}</td>
                  <td className="whitespace-nowrap px-3 py-3">{u.phone_number}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${u.user_type === "Admin" ? "bg-brand text-white" : "bg-accent-soft text-accent-dark"}`}>
                      {u.user_type}
                    </span>
                  </td>
                  <td className="px-3 py-3">{u.country || "-"}</td>
                  <td className="px-3 py-3">{u.organization || "-"}</td>
                  <td className="whitespace-nowrap px-3 py-3">{formatDate(u.date_joined)}</td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      onClick={() => toggleActive(u)}
                      disabled={u.id === me?.id}
                      title={u.id === me?.id ? "You can't deactivate yourself" : u.is_active ? "Deactivate" : "Activate"}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold disabled:cursor-not-allowed ${u.is_active ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-600"}`}
                    >
                      {u.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-3 py-3">
                    {u.id !== me?.id && (
                      <button type="button" onClick={() => setToDelete(u)} aria-label={`Delete ${u.email}`} className="text-gray-400 hover:text-red-600">
                        <FaTrashAlt />
                      </button>
                    )}
                  </td>
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

      {adding && (
        <AddUserModal
          onClose={() => setAdding(false)}
          onAdded={(user) => {
            setUsers([user, ...users]);
            setAdding(false);
            flash("User added.");
          }}
        />
      )}
      {toDelete && (
        <ConfirmModal
          title="Delete user"
          message={`Delete ${toDelete.first_name} ${toDelete.last_name}? Their conversations will be deleted too.`}
          confirmLabel="Delete"
          busy={busy}
          onConfirm={handleDelete}
          onClose={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
