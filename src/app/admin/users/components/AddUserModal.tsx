"use client";
import { useState } from "react";
import { createUser } from "../../../utils/fetchUsers";
import type { User, UserType } from "../../../utils/types/user";

const fields = [
  { name: "first_name", label: "First name", type: "text", required: true },
  { name: "last_name", label: "Last name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone_number", label: "Phone number", type: "tel", required: true },
  { name: "country", label: "Country", type: "text", required: false },
  { name: "organization", label: "Organization", type: "text", required: false },
  { name: "password", label: "Temporary password", type: "password", required: true },
] as const;

type Form = Record<(typeof fields)[number]["name"], string> & { user_type: UserType };

const empty: Form = {
  first_name: "", last_name: "", email: "", phone_number: "", country: "", organization: "", password: "",
  user_type: "Health Professional",
};

export default function AddUserModal({ onClose, onAdded }: { onClose: () => void; onAdded: (user: User) => void }) {
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      onAdded(await createUser(form));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Add user">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-brand">Add user</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {fields.map((field) => (
            <label key={field.name} className="flex flex-col gap-1 text-sm font-semibold text-brand">
              {field.label}
              <input
                type={field.type}
                required={field.required}
                value={form[field.name]}
                onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                className="h-10 rounded-lg border border-accent px-3 font-normal focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </label>
          ))}
          <label className="flex flex-col gap-1 text-sm font-semibold text-brand">
            Role
            <select
              value={form.user_type}
              onChange={(e) => setForm({ ...form, user_type: e.target.value as UserType })}
              className="h-10 rounded-lg border border-accent bg-white px-3 font-normal"
            >
              <option>Health Professional</option>
              <option>Admin</option>
            </select>
          </label>
        </div>
        {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-accent px-5 py-2 font-semibold text-accent hover:bg-accent-soft">
            Cancel
          </button>
          <button type="submit" disabled={busy} className="rounded-lg bg-accent px-5 py-2 font-semibold text-white hover:bg-accent-dark disabled:opacity-60">
            {busy ? "Adding..." : "Add user"}
          </button>
        </div>
      </form>
    </div>
  );
}
