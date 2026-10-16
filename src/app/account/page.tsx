"use client";
import { useEffect, useState } from "react";
import { fetchProfile, updateProfile } from "../utils/fetchProfile";
import { formatDate } from "../utils/format";
import { saveUser } from "../utils/session";
import type { User } from "../utils/types/user";

const fields = [
  { name: "first_name", label: "First name" },
  { name: "last_name", label: "Last name" },
  { name: "email", label: "Email" },
  { name: "phone_number", label: "Phone number" },
  { name: "country", label: "Country" },
  { name: "organization", label: "Organization" },
] as const;

type Form = Record<(typeof fields)[number]["name"], string>;

export default function AccountPage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  function load(user: User) {
    setProfile(user);
    setForm(Object.fromEntries(fields.map((f) => [f.name, user[f.name] ?? ""])) as Form);
  }

  useEffect(() => {
    fetchProfile().then(load).catch((err) => setMessage({ ok: false, text: err.message }));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setBusy(true);
    setMessage(null);
    try {
      const user = await updateProfile(password ? { ...form, password } : form);
      load(user);
      saveUser(user);
      setPassword("");
      setMessage({ ok: true, text: "Profile saved." });
    } catch (err) {
      setMessage({ ok: false, text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-3xl font-extrabold text-brand sm:text-4xl">Account</h1>
      {!form ? (
        <p className={message ? "text-red-600" : "text-gray-500"}>{message?.text ?? "Loading..."}</p>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-accent text-xl font-bold text-white">
              {profile!.first_name.charAt(0)}{profile!.last_name.charAt(0)}
            </span>
            <div>
              <p className="text-lg font-bold text-brand">{profile!.first_name} {profile!.last_name}</p>
              <p className="text-sm text-gray-500">{profile!.user_type} · joined {formatDate(profile!.date_joined)}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <label key={field.name} className="flex flex-col gap-1 text-sm font-semibold text-brand">
                {field.label}
                <input
                  value={form[field.name]}
                  onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                  className="h-11 rounded-lg border border-accent px-3 font-normal focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
              </label>
            ))}
            <label className="flex flex-col gap-1 text-sm font-semibold text-brand sm:col-span-2">
              New password
              <input
                type="password"
                placeholder="Leave blank to keep your current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-lg border border-accent px-3 font-normal focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </label>
          </div>
          {message && <p role="status" className={`mt-4 text-sm ${message.ok ? "text-emerald-700" : "text-red-600"}`}>{message.text}</p>}
          <button type="submit" disabled={busy} className="mt-6 rounded-lg bg-accent px-6 py-2.5 font-semibold text-white hover:bg-accent-dark disabled:opacity-60">
            {busy ? "Saving..." : "Save changes"}
          </button>
        </form>
      )}
    </div>
  );
}
